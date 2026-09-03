import { create } from 'zustand';
import {
  CreatorFlowState,
  StateSnapshot,
  PlatformId,
  AspectRatio,
  WorkspaceArea,
  PlatformPublishData,
  AgentActivityItem,
} from '@/types';
import { SAMPLE_PROJECT, SAMPLE_TRANSCRIPT, INITIAL_PUBLISHING_DATA } from '@/data/sampleProject';

interface CreatorFlowActions {
  // Navigation
  setCurrentArea: (area: WorkspaceArea) => void;
  toggleDirector: (open?: boolean) => void;

  // Domain & State Operations (Used directly or through domain/operations.ts)
  selectTranscriptSegment: (segmentId: string | null) => void;
  selectTimelineRange: (start: number, end: number, recordHistory?: boolean) => void;
  setCurrentTime: (time: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  applyEdit: (plan: { name: string; description: string; start: number; end: number }) => void;
  changeAspectRatio: (ratio: AspectRatio) => void;
  toggleCaptions: (enabled?: boolean) => void;
  setCurrentPlatform: (platform: PlatformId) => void;
  preparePlatformOutput: (platform: PlatformId, data?: Partial<PlatformPublishData>) => void;
  
  // History
  undo: () => boolean;
  redo: () => boolean;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Agent Activity
  logAgentActivity: (activity: Omit<AgentActivityItem, 'id' | 'timestamp'>) => void;
  clearAgentActivity: () => void;

  // WebMCP Integration Actions
  setProposedEdit: (edit: import('@/types').ProposedEdit | null) => void;
  setWebMCPReady: (ready: boolean, count: number) => void;
  logWebMCPExecution: (execution: Omit<import('@/types').WebMCPToolExecution, 'id' | 'timestamp'>) => void;
  clearWebMCPExecutions: () => void;
  setLastAIAction: (action: { description: string; timestamp: string } | null) => void;

  // Real Media & Local Video
  uploadLocalVideo: (file: File) => Promise<void>;
  resetToSampleVideo: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
}

export type CreatorFlowStore = CreatorFlowState & CreatorFlowActions;

function createSnapshot(state: CreatorFlowState): StateSnapshot {
  return {
    timeline: {
      currentTime: state.timeline.currentTime,
      trimStart: state.timeline.trimStart,
      trimEnd: state.timeline.trimEnd,
    },
    selectedSegment: state.selectedSegment,
    editPlan: JSON.parse(JSON.stringify(state.editPlan)),
    captions: JSON.parse(JSON.stringify(state.captions)),
    aspectRatio: state.aspectRatio,
    currentPlatform: state.currentPlatform,
    publishing: JSON.parse(JSON.stringify(state.publishing)),
  };
}

export const useCreatorFlowStore = create<CreatorFlowStore>((set, get) => ({
  // Navigation
  currentArea: 'create',
  directorOpen: true,

  // Initial Data
  project: SAMPLE_PROJECT,
  transcript: SAMPLE_TRANSCRIPT,
  timeline: {
    currentTime: 0,
    duration: 92,
    trimStart: 0,
    trimEnd: 92,
    isPlaying: false,
    volume: 1,
    isMuted: false,
    playbackRate: 1,
  },
  selectedSegment: null,
  editPlan: {
    name: 'Full Recording (Uncut)',
    description: 'Complete source recording without cuts applied.',
    activeCut: null,
  },
  captions: {
    enabled: true,
    style: 'punchy',
    currentText: SAMPLE_TRANSCRIPT[0].text,
  },
  aspectRatio: '16:9',
  currentPlatform: 'youtube',
  publishing: INITIAL_PUBLISHING_DATA,

  history: {
    past: [],
    future: [],
  },

  agentActivity: [
    {
      id: 'act_init',
      timestamp: 'Just now',
      tool: 'system.loadProject',
      action: 'Loaded demo project "Building with WebMCP" (01:32)',
      status: 'completed',
      details: '7 transcript segments parsed, timeline initialized to 00:00 - 01:32.',
    },
  ],

  // WebMCP Integration State
  webmcpReady: false,
  webmcpToolCount: 0,
  webmcpExecutions: [],
  proposedEdit: null,
  lastAIAction: null,

  // Real Media & Local Video
  localVideoUrl: null,
  isLocalVideo: false,

  setCurrentArea: (area) => set({ currentArea: area }),
  toggleDirector: (open) => set((state) => ({ directorOpen: open ?? !state.directorOpen })),

  selectTranscriptSegment: (segmentId) => {
    const state = get();
    if (state.selectedSegment === segmentId && segmentId !== null) {
      // Toggle off if already selected
      set({ selectedSegment: null });
      return;
    }

    const segment = state.transcript.find((s) => s.id === segmentId);
    if (segment) {
      // Save snapshot for undo
      const snapshot = createSnapshot(state);
      set((s) => ({
        selectedSegment: segmentId,
        timeline: {
          ...s.timeline,
          currentTime: segment.start,
        },
        captions: {
          ...s.captions,
          currentText: segment.text,
        },
        history: {
          past: [...s.history.past.slice(-20), snapshot],
          future: [],
        },
      }));
    } else {
      set({ selectedSegment: null });
    }
  },

  selectTimelineRange: (start, end, recordHistory = true) => {
    const state = get();
    const clampedStart = Math.max(0, Math.min(start, state.timeline.duration));
    const clampedEnd = Math.max(clampedStart + 1, Math.min(end, state.timeline.duration));

    const snapshot = recordHistory ? createSnapshot(state) : null;

    set((s) => ({
      timeline: {
        ...s.timeline,
        trimStart: clampedStart,
        trimEnd: clampedEnd,
        currentTime: Math.max(clampedStart, Math.min(s.timeline.currentTime, clampedEnd)),
      },
      history: snapshot
        ? {
            past: [...s.history.past.slice(-20), snapshot],
            future: [],
          }
        : s.history,
    }));
  },

  setCurrentTime: (time) => {
    const state = get();
    const clamped = Math.max(0, Math.min(time, state.timeline.duration));
    
    // Find matching transcript segment for captions
    const activeSegment = state.transcript.find(
      (s) => clamped >= s.start && clamped < s.end
    ) || state.transcript[state.transcript.length - 1];

    set((s) => ({
      timeline: {
        ...s.timeline,
        currentTime: clamped,
      },
      captions: {
        ...s.captions,
        currentText: activeSegment ? activeSegment.text : s.captions.currentText,
      },
    }));
  },

  setIsPlaying: (isPlaying) => {
    set((s) => ({
      timeline: {
        ...s.timeline,
        isPlaying,
      },
    }));
  },

  applyEdit: (plan) => {
    const state = get();
    const snapshot = createSnapshot(state);

    const clampedStart = Math.max(0, Math.min(plan.start, state.timeline.duration));
    const clampedEnd = Math.max(clampedStart + 1, Math.min(plan.end, state.timeline.duration));

    // Find segment within this cut
    const matchingSegment = state.transcript.find(
      (s) => s.start >= clampedStart && s.start < clampedEnd
    );

    set((s) => ({
      editPlan: {
        name: plan.name,
        description: plan.description,
        activeCut: {
          start: clampedStart,
          end: clampedEnd,
        },
        appliedAt: new Date().toLocaleTimeString(),
      },
      timeline: {
        ...s.timeline,
        trimStart: clampedStart,
        trimEnd: clampedEnd,
        currentTime: clampedStart,
      },
      selectedSegment: matchingSegment ? matchingSegment.id : s.selectedSegment,
      history: {
        past: [...s.history.past.slice(-20), snapshot],
        future: [],
      },
    }));
  },

  changeAspectRatio: (ratio) => {
    const state = get();
    if (state.aspectRatio === ratio) return;

    const snapshot = createSnapshot(state);
    set((s) => ({
      aspectRatio: ratio,
      history: {
        past: [...s.history.past.slice(-20), snapshot],
        future: [],
      },
    }));
  },

  toggleCaptions: (enabled) => {
    const state = get();
    const targetState = enabled ?? !state.captions.enabled;
    if (state.captions.enabled === targetState) return;

    const snapshot = createSnapshot(state);
    set((s) => ({
      captions: {
        ...s.captions,
        enabled: targetState,
      },
      history: {
        past: [...s.history.past.slice(-20), snapshot],
        future: [],
      },
    }));
  },

  setCurrentPlatform: (platform) => {
    set({ currentPlatform: platform });
  },

  preparePlatformOutput: (platform, data) => {
    const state = get();
    const snapshot = createSnapshot(state);

    set((s) => ({
      publishing: {
        ...s.publishing,
        [platform]: {
          ...s.publishing[platform],
          ...(data || {}),
          status: 'Prepared for publishing',
        },
      },
      currentPlatform: platform,
      history: {
        past: [...s.history.past.slice(-20), snapshot],
        future: [],
      },
    }));
  },

  undo: () => {
    const state = get();
    if (state.history.past.length === 0) return false;

    const currentSnapshot = createSnapshot(state);
    const previousSnapshot = state.history.past[state.history.past.length - 1];
    const newPast = state.history.past.slice(0, -1);

    set({
      timeline: {
        ...state.timeline,
        currentTime: previousSnapshot.timeline.currentTime,
        trimStart: previousSnapshot.timeline.trimStart,
        trimEnd: previousSnapshot.timeline.trimEnd,
      },
      selectedSegment: previousSnapshot.selectedSegment,
      editPlan: previousSnapshot.editPlan,
      captions: previousSnapshot.captions,
      aspectRatio: previousSnapshot.aspectRatio,
      currentPlatform: previousSnapshot.currentPlatform,
      publishing: previousSnapshot.publishing,
      history: {
        past: newPast,
        future: [currentSnapshot, ...state.history.future.slice(0, 20)],
      },
    });

    get().logAgentActivity({
      tool: 'history.undo',
      action: 'Reverted previous action via Undo',
      status: 'completed',
      details: `Restored timeline trim [${formatTime(previousSnapshot.timeline.trimStart)} - ${formatTime(previousSnapshot.timeline.trimEnd)}] and ratio ${previousSnapshot.aspectRatio}.`,
    });

    return true;
  },

  redo: () => {
    const state = get();
    if (state.history.future.length === 0) return false;

    const currentSnapshot = createSnapshot(state);
    const nextSnapshot = state.history.future[0];
    const newFuture = state.history.future.slice(1);

    set({
      timeline: {
        ...state.timeline,
        currentTime: nextSnapshot.timeline.currentTime,
        trimStart: nextSnapshot.timeline.trimStart,
        trimEnd: nextSnapshot.timeline.trimEnd,
      },
      selectedSegment: nextSnapshot.selectedSegment,
      editPlan: nextSnapshot.editPlan,
      captions: nextSnapshot.captions,
      aspectRatio: nextSnapshot.aspectRatio,
      currentPlatform: nextSnapshot.currentPlatform,
      publishing: nextSnapshot.publishing,
      history: {
        past: [...state.history.past.slice(-20), currentSnapshot],
        future: newFuture,
      },
    });

    get().logAgentActivity({
      tool: 'history.redo',
      action: 'Re-applied state action via Redo',
      status: 'completed',
      details: `Advanced to timeline trim [${formatTime(nextSnapshot.timeline.trimStart)} - ${formatTime(nextSnapshot.timeline.trimEnd)}] and ratio ${nextSnapshot.aspectRatio}.`,
    });

    return true;
  },

  canUndo: () => get().history.past.length > 0,
  canRedo: () => get().history.future.length > 0,

  logAgentActivity: (activity) => {
    const newItem: AgentActivityItem = {
      ...activity,
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    set((s) => ({
      agentActivity: [newItem, ...s.agentActivity.slice(0, 30)],
    }));
  },

  clearAgentActivity: () => set({ agentActivity: [] }),

  setProposedEdit: (edit) => set({ proposedEdit: edit }),
  setWebMCPReady: (ready, count) => set({ webmcpReady: ready, webmcpToolCount: count }),
  logWebMCPExecution: (execution) => {
    const item = {
      ...execution,
      id: `mcp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    set((s) => ({
      webmcpExecutions: [item, ...s.webmcpExecutions.slice(0, 40)],
    }));
  },
  clearWebMCPExecutions: () => set({ webmcpExecutions: [] }),
  setLastAIAction: (action) => set({ lastAIAction: action }),

  setVolume: (volume) =>
    set((s) => ({
      timeline: { ...s.timeline, volume: Math.max(0, Math.min(1, volume)), isMuted: volume === 0 },
    })),
  toggleMute: () =>
    set((s) => ({
      timeline: { ...s.timeline, isMuted: !s.timeline.isMuted },
    })),
  setPlaybackRate: (rate) =>
    set((s) => ({
      timeline: { ...s.timeline, playbackRate: rate },
    })),

  uploadLocalVideo: async (file) => {
    const url = URL.createObjectURL(file);
    const cleanTitle = file.name.replace(/\.[^/.]+$/, '');

    let duration = 60;
    try {
      if (typeof window !== 'undefined') {
        duration = await new Promise<number>((resolve) => {
          const v = document.createElement('video');
          v.preload = 'metadata';
          v.src = url;
          v.onloadedmetadata = () => {
            resolve(v.duration && !isNaN(v.duration) ? Math.round(v.duration) : 60);
          };
          v.onerror = () => resolve(60);
        });
      }
    } catch {
      duration = 60;
    }

    const step = Math.max(5, Math.floor(duration / 5));
    const generatedTranscript = [
      { id: 'seg_loc_1', start: 0, end: Math.min(step, duration), startFormatted: '00:00', endFormatted: formatTime(Math.min(step, duration)), text: `Opening visual hook for ${cleanTitle}.` },
      { id: 'seg_loc_2', start: Math.min(step, duration), end: Math.min(step * 2, duration), startFormatted: formatTime(Math.min(step, duration)), endFormatted: formatTime(Math.min(step * 2, duration)), text: `Core action and primary footage focus.` },
      { id: 'seg_loc_3', start: Math.min(step * 2, duration), end: Math.min(step * 3, duration), startFormatted: formatTime(Math.min(step * 2, duration)), endFormatted: formatTime(Math.min(step * 3, duration)), text: `Key climax moment and high retention point.` },
      { id: 'seg_loc_4', start: Math.min(step * 3, duration), end: Math.min(step * 4, duration), startFormatted: formatTime(Math.min(step * 3, duration)), endFormatted: formatTime(Math.min(step * 4, duration)), text: `Supporting sequence and narrative arc.` },
      { id: 'seg_loc_5', start: Math.min(step * 4, duration), end: duration, startFormatted: formatTime(Math.min(step * 4, duration)), endFormatted: formatTime(duration), text: `Closing resolution and call to action.` },
    ].filter((s) => s.start < duration);

    set((s) => ({
      localVideoUrl: url,
      isLocalVideo: true,
      project: {
        id: `proj_local_${Date.now()}`,
        title: cleanTitle,
        type: `Local Video (${file.type.split('/')[1] || 'mp4'})`,
        duration,
        durationFormatted: formatTime(duration),
        source: 'local',
        videoUrl: url,
      },
      transcript: generatedTranscript,
      timeline: {
        ...s.timeline,
        currentTime: 0,
        duration,
        trimStart: 0,
        trimEnd: duration,
        isPlaying: false,
      },
      editPlan: {
        name: `Source: ${cleanTitle}`,
        description: `Imported local video file (${file.name}, ${(file.size / (1024 * 1024)).toFixed(1)} MB)`,
        activeCut: null,
      },
      captions: {
        ...s.captions,
        currentText: generatedTranscript[0]?.text || cleanTitle,
      },
    }));

    get().logAgentActivity({
      tool: 'media.uploadLocalVideo',
      action: `Loaded local video: "${file.name}"`,
      status: 'completed',
      details: `Parsed duration (${formatTime(duration)}), audio & video tracks active. WebMCP tools connected.`,
    });
  },

  resetToSampleVideo: () => {
    set((s) => ({
      localVideoUrl: null,
      isLocalVideo: false,
      project: SAMPLE_PROJECT,
      transcript: SAMPLE_TRANSCRIPT,
      timeline: {
        ...s.timeline,
        currentTime: 0,
        duration: SAMPLE_PROJECT.duration,
        trimStart: 0,
        trimEnd: SAMPLE_PROJECT.duration,
        isPlaying: false,
      },
      editPlan: {
        name: 'Full Recording (Uncut)',
        description: 'Sample recording restored.',
        activeCut: null,
      },
      captions: {
        ...s.captions,
        currentText: SAMPLE_TRANSCRIPT[0].text,
      },
    }));

    get().logAgentActivity({
      tool: 'media.resetSample',
      action: 'Switched back to sample video "Building with WebMCP"',
      status: 'completed',
    });
  },
}));

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
