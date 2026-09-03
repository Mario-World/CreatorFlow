import { useCreatorFlowStore } from '@/store/creatorFlowStore';
import { AspectRatio, PlatformId, PlatformPublishData } from '@/types';
import { executeWebMCPTool } from '@/lib/webmcp';

/**
 * Domain Operations Layer
 * 
 * Single authoritative source of actions for both:
 * 1. CreatorFlow UI
 * 2. WebMCP Agent Tools (registered on document.modelContext)
 * 
 * Both interfaces execute these exact same operations, modifying the central Zustand store.
 */

export const creatorFlowOperations = {
  /**
   * Selects a transcript segment by ID and synchronizes playhead and captions.
   */
  selectTranscriptSegment: (segmentId: string | null) => {
    const store = useCreatorFlowStore.getState();
    store.selectTranscriptSegment(segmentId);
    
    const segment = store.transcript.find((s) => s.id === segmentId);
    store.logAgentActivity({
      tool: 'transcript.selectSegment',
      action: segmentId ? `Selected segment: "${segment?.text.slice(0, 32)}..."` : 'Deselected segment',
      status: 'completed',
      details: segment ? `Jumped playhead to ${segment.startFormatted} (${segment.start}s)` : undefined,
    });
  },

  /**
   * Sets the active timeline trim range.
   */
  selectTimelineRange: (start: number, end: number) => {
    const store = useCreatorFlowStore.getState();
    store.selectTimelineRange(start, end);
    store.logAgentActivity({
      tool: 'timeline.setRange',
      action: `Set timeline range to ${formatSeconds(start)} → ${formatSeconds(end)}`,
      status: 'completed',
      details: `Active duration: ${Math.round(end - start)} seconds`,
    });
  },

  /**
   * Applies an edit cut to the timeline and records the edit plan.
   */
  applyEdit: (params: { name: string; description?: string; start: number; end: number }) => {
    const store = useCreatorFlowStore.getState();
    store.applyEdit({
      name: params.name,
      description: params.description || `Applied cut from ${formatSeconds(params.start)} to ${formatSeconds(params.end)}`,
      start: params.start,
      end: params.end,
    });

    store.logAgentActivity({
      tool: 'editor.applyEdit',
      action: `Applied edit cut: "${params.name}"`,
      status: 'completed',
      details: `Trimmed to ${formatSeconds(params.start)} - ${formatSeconds(params.end)} (${Math.round(params.end - params.start)}s)`,
    });
  },

  /**
   * Changes the video framing aspect ratio.
   */
  changeAspectRatio: (ratio: AspectRatio) => {
    const store = useCreatorFlowStore.getState();
    store.changeAspectRatio(ratio);
    store.logAgentActivity({
      tool: 'canvas.setAspectRatio',
      action: `Updated aspect ratio to ${ratio}`,
      status: 'completed',
      details: ratio === '9:16' ? 'Optimized for Reels/Shorts' : ratio === '1:1' ? 'Square feed format' : 'Landscape 16:9 format',
    });
  },

  /**
   * Enables or disables captions overlay.
   */
  toggleCaptions: (enabled?: boolean) => {
    const store = useCreatorFlowStore.getState();
    store.toggleCaptions(enabled);
    const newState = enabled !== undefined ? enabled : !store.captions.enabled;
    store.logAgentActivity({
      tool: 'subtitles.toggleCaptions',
      action: newState ? 'Captions enabled' : 'Captions disabled',
      status: 'completed',
      details: newState ? 'High-contrast modern subtitle styling active' : 'Subtitles hidden',
    });
  },

  /**
   * Sets current playhead position.
   */
  setCurrentTime: (time: number) => {
    useCreatorFlowStore.getState().setCurrentTime(time);
  },

  /**
   * Toggles playback.
   */
  togglePlayback: () => {
    const store = useCreatorFlowStore.getState();
    store.setIsPlaying(!store.timeline.isPlaying);
  },

  /**
   * Switches the active publishing platform.
   */
  setCurrentPlatform: (platform: PlatformId) => {
    useCreatorFlowStore.getState().setCurrentPlatform(platform);
  },

  /**
   * Prepares publishing copy and formats for a specified platform.
   */
  preparePlatformOutput: (platform: PlatformId, data?: Partial<PlatformPublishData>) => {
    const store = useCreatorFlowStore.getState();
    store.preparePlatformOutput(platform, data);
    store.logAgentActivity({
      tool: 'publish.prepareOutput',
      action: `Prepared output for ${store.publishing[platform].name}`,
      status: 'completed',
      details: `Status: Prepared for publishing. Format: ${store.publishing[platform].format}`,
    });
  },

  /**
   * Undoes the last operation.
   */
  undo: () => {
    return useCreatorFlowStore.getState().undo();
  },

  /**
   * Redoes the last undone operation.
   */
  redo: () => {
    return useCreatorFlowStore.getState().redo();
  },

  // --------------------------------------------------------------------------
  // WebMCP Main Demo Workflow: Discovery -> Proposal -> Approval -> Undo
  // --------------------------------------------------------------------------

  /**
   * Executes the 4 WebMCP tools to inspect project and formulate a proposed edit.
   * DOES NOT MUTATE THE PROJECT STATE.
   */
  proposeStrongestShort: async () => {
    const store = useCreatorFlowStore.getState();

    // 1. get_project_state
    await executeWebMCPTool('get_project_state');

    // 2. get_transcript
    await executeWebMCPTool('get_transcript');

    // 3. find_best_moment (durationSeconds = 30)
    const moment = await executeWebMCPTool('find_best_moment', { durationSeconds: 30 });

    // 4. create_edit_plan (Proposal only)
    const planResult = await executeWebMCPTool('create_edit_plan', {
      startSeconds: moment.startSeconds,
      endSeconds: moment.endSeconds,
      aspectRatio: '9:16',
    });

    // Set proposed edit for human creator review
    store.setProposedEdit(planResult.proposal);

    store.logAgentActivity({
      tool: 'director.proposeEdit',
      action: 'Generated edit proposal: "Strongest explanation of WebMCP"',
      status: 'completed',
      details: 'Evaluated WebMCP tools. Proposed 00:18 → 00:48 in 9:16 format with captions. Awaiting creator approval.',
    });
  },

  /**
   * Approves the proposed edit: Executes mutating WebMCP tools:
   * 1. apply_edit_plan
   * 2. change_aspect_ratio
   * 3. add_captions
   * Displays "AI changed this" banner with Undo action.
   */
  approveProposedEdit: async () => {
    const store = useCreatorFlowStore.getState();
    const proposal = store.proposedEdit;
    if (!proposal) return;

    // 1. apply_edit_plan
    await executeWebMCPTool('apply_edit_plan', {
      startSeconds: proposal.startSeconds,
      endSeconds: proposal.endSeconds,
    });

    // 2. change_aspect_ratio
    await executeWebMCPTool('change_aspect_ratio', {
      aspectRatio: proposal.aspectRatio,
    });

    // 3. add_captions
    await executeWebMCPTool('add_captions', {
      enabled: proposal.captions,
    });

    // Clear proposal and show AI change banner
    store.setProposedEdit(null);
    store.setLastAIAction({
      description: `Applied 30s cut (${proposal.startFormatted} → ${proposal.endFormatted}) as 9:16 vertical short with captions`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    store.logAgentActivity({
      tool: 'creator.approved',
      action: 'Creator approved proposed edit: WebMCP tools executed',
      status: 'completed',
      details: 'Timeline trimmed, canvas reframed to 9:16, subtitles enabled. "AI changed this" banner active.',
    });
  },

  /**
   * Rejects the proposed edit without changing state.
   */
  rejectProposedEdit: () => {
    const store = useCreatorFlowStore.getState();
    store.setProposedEdit(null);
    store.logAgentActivity({
      tool: 'creator.rejected',
      action: 'Creator rejected proposed edit',
      status: 'completed',
      details: 'Proposal dismissed. Project state remained completely untouched.',
    });
  },

  /**
   * Undoes the AI change action using WebMCP undo_last_action.
   */
  undoAIAction: async () => {
    const store = useCreatorFlowStore.getState();
    await executeWebMCPTool('undo_last_action');
    store.setLastAIAction(null);
  },

  /**
   * Deterministic Director execution of natural creator intents.
   */
  runDirectorIntent: async (intentInput: string) => {
    const store = useCreatorFlowStore.getState();
    const intent = intentInput.trim();
    if (!intent) return;

    const lower = intent.toLowerCase();

    // Primary Phase 2 Demo Action:
    // "Find the strongest 30 seconds and make it a vertical short" or "Find the strongest 30 seconds"
    if (
      (lower.includes('strongest') && (lower.includes('vertical') || lower.includes('short'))) ||
      lower.includes('find the strongest 30') ||
      lower.includes('strongest 30 seconds')
    ) {
      await creatorFlowOperations.proposeStrongestShort();
      return;
    }

    // Intent 2: "Turn this into a LinkedIn post"
    if (lower.includes('linkedin')) {
      await executeWebMCPTool('prepare_for_platform', { platform: 'linkedin' });
      store.setCurrentArea('publish');
      return;
    }

    // Intent 3: "Make this a vertical reel"
    if (lower.includes('vertical') || lower.includes('reel') || lower.includes('tiktok') || lower.includes('shorts') || lower.includes('9:16')) {
      await executeWebMCPTool('change_aspect_ratio', { aspectRatio: '9:16' });
      await executeWebMCPTool('add_captions', { enabled: true });
      await executeWebMCPTool('apply_edit_plan', { startSeconds: 0, endSeconds: 31 });
      return;
    }

    // Intent 4: "Prepare this for X"
    if (lower.includes('x') || lower.includes('twitter') || lower.includes('tweet') || lower.includes('thread')) {
      await executeWebMCPTool('prepare_for_platform', { platform: 'x' });
      store.setCurrentArea('publish');
      return;
    }

    // Generic matching / fallback:
    if (lower.includes('caption') || lower.includes('subtitle')) {
      await executeWebMCPTool('add_captions', { enabled: true });
      return;
    }

    if (lower.includes('youtube')) {
      await executeWebMCPTool('change_aspect_ratio', { aspectRatio: '16:9' });
      await executeWebMCPTool('prepare_for_platform', { platform: 'youtube' });
      store.setCurrentArea('publish');
      return;
    }

    if (lower.includes('reset') || lower.includes('uncut') || lower.includes('full')) {
      await executeWebMCPTool('apply_edit_plan', { startSeconds: 0, endSeconds: 92 });
      await executeWebMCPTool('change_aspect_ratio', { aspectRatio: '16:9' });
      return;
    }

    // Default custom intent: propose cut
    await creatorFlowOperations.proposeStrongestShort();
  },

  /**
   * Saves a structured research brief to the active project state.
   */
  saveResearchBrief: (brief: import('@/types').ResearchBrief) => {
    const store = useCreatorFlowStore.getState();
    store.saveResearchBrief(brief);
  },
};

// Expose on window for runtime inspection
if (typeof window !== 'undefined') {
  (window as unknown as { CreatorFlowDomain: typeof creatorFlowOperations }).CreatorFlowDomain = creatorFlowOperations;
}

function formatSeconds(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
