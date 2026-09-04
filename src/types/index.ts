export type AspectRatio = '16:9' | '9:16' | '1:1';

export type PlatformId = 'youtube' | 'instagram' | 'linkedin' | 'x' | 'medium';

export type WorkspaceArea = 'overview' | 'workspace' | 'publish' | 'research';

export interface ResearchBrief {
  id: string;
  topic: string;
  audience: string;
  coreThesis: string;
  hooks: string[];
  keyBeats: string[];
  recommendedCut?: {
    name: string;
    start: number;
    end: number;
  };
  savedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  type: string;
  duration: number; // in seconds (92s = 01:32)
  durationFormatted: string;
  source?: 'sample' | 'local';
  videoUrl?: string | null;
  researchBrief?: ResearchBrief | null;
}

export interface TranscriptSegment {
  id: string;
  start: number; // in seconds
  end: number;   // in seconds
  startFormatted: string;
  endFormatted: string;
  text: string;
}

export interface TimelineState {
  currentTime: number;
  duration: number;
  trimStart: number;
  trimEnd: number;
  isPlaying: boolean;
  volume: number;        // 0 to 1
  isMuted: boolean;
  playbackRate: number;  // 1, 1.5, 2
}

export interface EditPlan {
  name: string;
  description: string;
  activeCut: {
    start: number;
    end: number;
  } | null;
  appliedAt?: string;
}

export interface CaptionsState {
  enabled: boolean;
  style: 'punchy' | 'clean';
  currentText: string;
}

export interface PlatformPublishData {
  platform: PlatformId;
  name: string;
  format: string;
  title: string;
  caption: string;
  description: string;
  hashtags: string[];
  previewHeadline: string;
  status: 'Prepared for publishing';
  mediaMode?: 'video_text' | 'video_only' | 'text_only' | 'article';
  isSelected?: boolean;
}

export interface AgentActivityItem {
  id: string;
  timestamp: string;
  tool: string;
  action: string;
  status: 'completed' | 'running' | 'idle';
  intent?: string;
  details?: string;
}

export interface StateSnapshot {
  timeline: {
    currentTime: number;
    trimStart: number;
    trimEnd: number;
  };
  selectedSegment: string | null;
  editPlan: EditPlan;
  captions: CaptionsState;
  aspectRatio: AspectRatio;
  currentPlatform: PlatformId;
  publishing: Record<PlatformId, PlatformPublishData>;
}

export interface ProposedEdit {
  id: string;
  startSeconds: number;
  endSeconds: number;
  startFormatted: string;
  endFormatted: string;
  title: string;
  reason: string;
  aspectRatio: AspectRatio;
  captions: boolean;
  createdAt: string;
}

export interface WebMCPToolExecution {
  id: string;
  tool: string;
  status: 'completed' | 'failed';
  timestamp: string;
  shortResult: string;
  input?: Record<string, unknown>;
}

export interface WebMCPToolDefinition {
  name: string;
  description: string;
  inputSchema?: Record<string, unknown>;
  execute: (args?: any) => Promise<any> | any;
  handler?: (args?: any) => Promise<any> | any;
}

export interface CreatorFlowState {
  // Navigation & Workspace
  currentArea: WorkspaceArea;
  directorOpen: boolean;

  // Central required project state
  project: Project;
  transcript: TranscriptSegment[];
  timeline: TimelineState;
  selectedSegment: string | null;
  editPlan: EditPlan;
  captions: CaptionsState;
  aspectRatio: AspectRatio;
  currentPlatform: PlatformId;
  publishing: Record<PlatformId, PlatformPublishData>;
  
  // History for full Undo / Redo
  history: {
    past: StateSnapshot[];
    future: StateSnapshot[];
  };

  // Agent Activity log
  agentActivity: AgentActivityItem[];

  // WebMCP Integration State
  webmcpReady: boolean;
  webmcpToolCount: number;
  webmcpExecutions: WebMCPToolExecution[];
  proposedEdit: ProposedEdit | null;
  lastAIAction: {
    description: string;
    timestamp: string;
  } | null;

  // Real Video & Media
  localVideoUrl: string | null;
  isLocalVideo: boolean;

  // ChatGPT Authentication & AI Connection
  chatGPTAuth: ChatGPTAuthSession;

  // Live Collaboration & Real-Time Presence
  collaboration: CollaborationSession;
}

export interface ChatGPTAuthSession {
  isAuthenticated: boolean;
  apiKey?: string;
  user?: {
    name: string;
    email: string;
    avatar: string;
  };
  model: string;
  connectedAt?: string;
  status: 'connected' | 'disconnected' | 'connecting';
}

export interface CollaboratorPresence {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  isAi?: boolean;
  status: 'active' | 'idle';
}

export interface CollaborationSession {
  sessionElapsedSeconds: number;
  collaborators: CollaboratorPresence[];
  activeTopic: string;
}
