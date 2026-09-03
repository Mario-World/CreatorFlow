import { useCreatorFlowStore } from '@/store/creatorFlowStore';
import { AspectRatio, PlatformId, ProposedEdit, WebMCPToolDefinition } from '@/types';

/**
 * WebMCP Specification & Safe Client Integration
 * 
 * Imperative API: document.modelContext.registerTool({...})
 * Operates the exact same Zustand state and domain logic as the human UI.
 */

// Extend Document interface for TypeScript
declare global {
  interface Document {
    modelContext?: {
      registerTool: (tool: WebMCPToolDefinition) => void;
      unregisterTool?: (name: string) => void;
      getTools?: () => WebMCPToolDefinition[];
      executeTool?: (name: string, args?: any) => Promise<any> | any;
      hasTool?: (name: string) => boolean;
      [key: string]: any;
    };
    __creatorflow_webmcp_registered__?: boolean;
  }
}

// In-memory registry for inspection and dispatch
const toolRegistry = new Map<string, WebMCPToolDefinition>();
const nativeToolMap = new Map<string, any>();

/**
 * Safe client-side WebMCP initialization and tool registration.
 * Ensures compatibility across all environments without crashing.
 */
export function initWebMCP(): { ready: boolean; toolCount: number } {
  const doc: any = typeof document !== 'undefined' 
    ? document 
    : ((globalThis as any).document = (globalThis as any).document || {});

  // Prevent duplicate registration
  if (doc.__creatorflow_webmcp_registered__) {
    const count = toolRegistry.size;
    useCreatorFlowStore.getState().setWebMCPReady(true, count);
    return { ready: true, toolCount: count };
  }

  // Initialize or augment document.modelContext
  if (!doc.modelContext) {
    const mockContext = {
      registerTool: (tool: WebMCPToolDefinition) => {
        const t: WebMCPToolDefinition = {
          ...tool,
          execute: tool.execute || tool.handler!,
          handler: tool.handler || tool.execute,
        };
        toolRegistry.set(t.name, t);
      },
      unregisterTool: (name: string) => {
        toolRegistry.delete(name);
      },
      getTools: () => Array.from(toolRegistry.values()),
      executeTool: async (name: string, input?: any) => {
        const tool = toolRegistry.get(name);
        if (!tool) {
          throw new Error(`WebMCP Tool not found: "${name}"`);
        }
        const fn = tool.execute || tool.handler;
        return await fn!(input);
      },
      hasTool: (name: string) => toolRegistry.has(name),
    };
    doc.modelContext = mockContext;
  } else {
    // If native document.modelContext exists, augment with tracking registry & execution helper
    const originalRegisterTool = doc.modelContext.registerTool.bind(doc.modelContext);
    doc.modelContext.registerTool = (tool: WebMCPToolDefinition) => {
      const toolToRegister: WebMCPToolDefinition = {
        ...tool,
        execute: tool.execute || tool.handler!,
        handler: tool.handler || tool.execute,
      };
      toolRegistry.set(toolToRegister.name, toolToRegister);
      try {
        const registered = originalRegisterTool(toolToRegister);
        if (registered) {
          nativeToolMap.set(toolToRegister.name, registered);
        }
        return registered;
      } catch (err) {
        console.warn('Native registerTool warning:', err);
      }
    };
    if (!doc.modelContext.getTools) {
      doc.modelContext.getTools = () => Array.from(toolRegistry.values());
    }
    const originalExecuteTool = doc.modelContext.executeTool 
      ? doc.modelContext.executeTool.bind(doc.modelContext) 
      : null;
    doc.modelContext.executeTool = async (target: any, input?: any) => {
      const toolName = typeof target === 'string' ? target : target?.name;
      const nativeTool = toolName ? nativeToolMap.get(toolName) : (target?.name ? target : null);

      if (originalExecuteTool && (nativeTool || (target && typeof target !== 'string'))) {
        try {
          return await originalExecuteTool(nativeTool || target, input);
        } catch {
          // fall through to internal execution
        }
      }

      if (toolName) {
        const tool = toolRegistry.get(toolName);
        if (tool) {
          const fn = tool.execute || tool.handler;
          return await fn!(input);
        }
      }

      if (originalExecuteTool) {
        return await originalExecuteTool(target, input);
      }
      throw new Error(`WebMCP Tool not found: "${toolName || target}"`);
    };
    if (!doc.modelContext.hasTool) {
      doc.modelContext.hasTool = (name: string) => toolRegistry.has(name);
    }
  }

  const context = doc.modelContext!;

  // --------------------------------------------------------------------------
  // TOOL 1: get_project_state (Read-only)
  // --------------------------------------------------------------------------
  context.registerTool({
    name: 'get_project_state',
    description:
      'Get the current CreatorFlow project state including content, timeline, selected segment, captions, aspect ratio, and publishing preparation.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    execute: async () => {
      const state = useCreatorFlowStore.getState();
      const result = {
        project: state.project,
        timeline: {
          currentTime: state.timeline.currentTime,
          duration: state.timeline.duration,
          trimStart: state.timeline.trimStart,
          trimEnd: state.timeline.trimEnd,
          activeDuration: state.timeline.trimEnd - state.timeline.trimStart,
        },
        selectedSegment: state.selectedSegment,
        editPlan: state.editPlan,
        captions: state.captions,
        aspectRatio: state.aspectRatio,
        currentPlatform: state.currentPlatform,
        publishingReady: Object.keys(state.publishing).map((p) => ({
          platform: p,
          status: state.publishing[p as PlatformId].status,
        })),
      };

      state.logWebMCPExecution({
        tool: 'get_project_state',
        status: 'completed',
        shortResult: `Project "${state.project.title}" (${state.project.durationFormatted}, ${state.aspectRatio})`,
      });

      return result;
    },
  });

  // --------------------------------------------------------------------------
  // TOOL 2: get_transcript (Read-only)
  // --------------------------------------------------------------------------
  context.registerTool({
    name: 'get_transcript',
    description: 'Get the transcript of the current creator project with timestamps.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    execute: async () => {
      const state = useCreatorFlowStore.getState();
      const segments = state.transcript;

      state.logWebMCPExecution({
        tool: 'get_transcript',
        status: 'completed',
        shortResult: `Returned ${segments.length} transcript segments (00:00 - ${state.project.durationFormatted})`,
      });

      return {
        projectId: state.project.id,
        duration: state.project.duration,
        segments,
      };
    },
  });

  // --------------------------------------------------------------------------
  // TOOL 3: find_best_moment (Read-only)
  // --------------------------------------------------------------------------
  context.registerTool({
    name: 'find_best_moment',
    description:
      'Find the highest-impact segment for a given duration based on narrative thesis and audience retention.',
    inputSchema: {
      type: 'object',
      properties: {
        durationSeconds: {
          type: 'number',
          description: 'Target duration in seconds for the highlight',
        },
      },
      required: ['durationSeconds'],
    },
    execute: async (input: { durationSeconds?: number } = {}) => {
      const durationSeconds = input.durationSeconds || 30;
      const state = useCreatorFlowStore.getState();

      // Deterministic highlight for demo: 00:18 → 00:48 (30s)
      const startSeconds = 18;
      const endSeconds = Math.min(startSeconds + durationSeconds, 48);

      const result = {
        startSeconds,
        endSeconds,
        startFormatted: formatTime(startSeconds),
        endFormatted: formatTime(endSeconds),
        duration: endSeconds - startSeconds,
        reason: 'This section clearly explains WebMCP and why agent-operable websites matter.',
        matchedSegments: state.transcript.filter(
          (s) => s.start >= startSeconds && s.start < endSeconds
        ),
      };

      state.logWebMCPExecution({
        tool: 'find_best_moment',
        status: 'completed',
        input: { durationSeconds },
        shortResult: `Found 30s cut [${result.startFormatted} → ${result.endFormatted}]: "${result.reason.slice(0, 42)}..."`,
      });

      return result;
    },
  });

  // --------------------------------------------------------------------------
  // TOOL 4: create_edit_plan (Proposal - DOES NOT MUTATE)
  // --------------------------------------------------------------------------
  context.registerTool({
    name: 'create_edit_plan',
    description: 'Create an edit proposal without mutating project state.',
    inputSchema: {
      type: 'object',
      properties: {
        startSeconds: { type: 'number' },
        endSeconds: { type: 'number' },
        aspectRatio: { type: 'string', enum: ['16:9', '9:16', '1:1'] },
      },
      required: ['startSeconds', 'endSeconds'],
    },
    execute: async (input: {
      startSeconds: number;
      endSeconds: number;
      aspectRatio?: AspectRatio;
    }) => {
      const state = useCreatorFlowStore.getState();
      const start = Math.max(0, input.startSeconds);
      const end = Math.min(state.timeline.duration, input.endSeconds);
      const ratio = input.aspectRatio || '9:16';

      const proposal: ProposedEdit = {
        id: `prop_${Date.now()}`,
        startSeconds: start,
        endSeconds: end,
        startFormatted: formatTime(start),
        endFormatted: formatTime(end),
        title: 'Strongest explanation of WebMCP',
        reason: 'Selected core thesis: WebMCP gives websites structured tools for agents.',
        aspectRatio: ratio,
        captions: true,
        createdAt: new Date().toLocaleTimeString(),
      };

      state.logWebMCPExecution({
        tool: 'create_edit_plan',
        status: 'completed',
        input: { startSeconds: start, endSeconds: end, aspectRatio: ratio },
        shortResult: `Proposed edit: ${proposal.startFormatted} → ${proposal.endFormatted} (${ratio}, Captions: On)`,
      });

      return {
        status: 'proposed',
        mutated: false,
        proposal,
      };
    },
  });

  // --------------------------------------------------------------------------
  // TOOL 5: apply_edit_plan (Mutating)
  // --------------------------------------------------------------------------
  context.registerTool({
    name: 'apply_edit_plan',
    description:
      'Apply an edit cut to the timeline, mutating actual project state, updating history, and triggering UI updates.',
    inputSchema: {
      type: 'object',
      properties: {
        startSeconds: { type: 'number' },
        endSeconds: { type: 'number' },
      },
      required: ['startSeconds', 'endSeconds'],
    },
    execute: async (input: { startSeconds: number; endSeconds: number }) => {
      const state = useCreatorFlowStore.getState();
      const start = Math.max(0, input.startSeconds);
      const end = Math.min(state.timeline.duration, input.endSeconds);

      state.applyEdit({
        name: 'WebMCP Agent Cut: Structured Tools',
        description: `Agent-trimmed region from ${formatTime(start)} to ${formatTime(end)}`,
        start,
        end,
      });

      state.logAgentActivity({
        tool: 'webmcp.apply_edit_plan',
        action: `Applied WebMCP edit cut [${formatTime(start)} → ${formatTime(end)}]`,
        status: 'completed',
        details: `Duration: ${Math.round(end - start)} seconds. Real state updated.`,
      });

      state.logWebMCPExecution({
        tool: 'apply_edit_plan',
        status: 'completed',
        input: { startSeconds: start, endSeconds: end },
        shortResult: `Applied timeline cut: ${formatTime(start)} → ${formatTime(end)} (${Math.round(end - start)}s)`,
      });

      return {
        success: true,
        mutated: true,
        trimStart: start,
        trimEnd: end,
        duration: end - start,
      };
    },
  });

  // --------------------------------------------------------------------------
  // TOOL 6: add_captions (Mutating)
  // --------------------------------------------------------------------------
  context.registerTool({
    name: 'add_captions',
    description: 'Enable or disable caption overlay in real project state.',
    inputSchema: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean' },
      },
      required: ['enabled'],
    },
    execute: async (input: { enabled: boolean }) => {
      const state = useCreatorFlowStore.getState();
      state.toggleCaptions(input.enabled);

      state.logAgentActivity({
        tool: 'webmcp.add_captions',
        action: input.enabled ? 'Enabled synchronized captions' : 'Disabled captions',
        status: 'completed',
        details: input.enabled ? 'High-contrast mobile safe-zone subtitle styling active' : 'Subtitles disabled',
      });

      state.logWebMCPExecution({
        tool: 'add_captions',
        status: 'completed',
        input: { enabled: input.enabled },
        shortResult: `Captions set to: ${input.enabled ? 'Enabled (ON)' : 'Disabled (OFF)'}`,
      });

      return {
        success: true,
        mutated: true,
        captionsEnabled: input.enabled,
      };
    },
  });

  // --------------------------------------------------------------------------
  // TOOL 7: change_aspect_ratio (Mutating)
  // --------------------------------------------------------------------------
  context.registerTool({
    name: 'change_aspect_ratio',
    description: 'Change video canvas framing aspect ratio in real project state.',
    inputSchema: {
      type: 'object',
      properties: {
        aspectRatio: { type: 'string', enum: ['16:9', '9:16', '1:1'] },
      },
      required: ['aspectRatio'],
    },
    execute: async (input: { aspectRatio: AspectRatio }) => {
      const state = useCreatorFlowStore.getState();
      state.changeAspectRatio(input.aspectRatio);

      state.logAgentActivity({
        tool: 'webmcp.change_aspect_ratio',
        action: `Canvas reframed to ${input.aspectRatio}`,
        status: 'completed',
        details: input.aspectRatio === '9:16' ? 'Vertical Short / Reel layout active' : `${input.aspectRatio} format`,
      });

      state.logWebMCPExecution({
        tool: 'change_aspect_ratio',
        status: 'completed',
        input: { aspectRatio: input.aspectRatio },
        shortResult: `Reframed canvas to ${input.aspectRatio}`,
      });

      return {
        success: true,
        mutated: true,
        aspectRatio: input.aspectRatio,
      };
    },
  });

  // --------------------------------------------------------------------------
  // TOOL 8: prepare_for_platform (Mutating preparation state)
  // --------------------------------------------------------------------------
  context.registerTool({
    name: 'prepare_for_platform',
    description: 'Prepare publishing metadata and format for a specific platform. Never publishes directly.',
    inputSchema: {
      type: 'object',
      properties: {
        platform: {
          type: 'string',
          enum: ['youtube', 'instagram', 'linkedin', 'x', 'medium'],
        },
      },
      required: ['platform'],
    },
    execute: async (input: { platform: PlatformId }) => {
      const state = useCreatorFlowStore.getState();
      const platform = input.platform;

      let platformConfig = { ...state.publishing[platform] };

      // Deterministic platform metadata per specification
      if (platform === 'linkedin') {
        platformConfig = {
          ...platformConfig,
          format: 'Short video + text post',
          title: 'Why WebMCP Changes the Web',
          caption:
            'Most websites were designed for humans. WebMCP gives agents structured capabilities they can actually operate.',
          hashtags: ['#WebMCP', '#AI', '#Agents', '#Creators'],
        };
      } else if (platform === 'instagram') {
        platformConfig = {
          ...platformConfig,
          format: '9:16 Reel',
          title: 'WebMCP: Structured Tools for AI Agents',
        };
      } else if (platform === 'x') {
        platformConfig = {
          ...platformConfig,
          format: 'Video + post',
          title: 'Websites were designed for humans. WebMCP makes them agent-native.',
        };
      } else if (platform === 'medium') {
        platformConfig = {
          ...platformConfig,
          format: 'Article',
          title: 'Architecting Agent-Native Workspaces with WebMCP',
        };
      } else if (platform === 'youtube') {
        platformConfig = {
          ...platformConfig,
          format: '16:9 video',
          title: 'Building with WebMCP: Why Websites Need Structured Agent Tools',
        };
      }

      state.preparePlatformOutput(platform, platformConfig);
      state.setCurrentPlatform(platform);

      state.logAgentActivity({
        tool: 'webmcp.prepare_for_platform',
        action: `Prepared publishing package for ${platformConfig.name} (${platformConfig.format})`,
        status: 'completed',
        details: 'Export-ready metadata generated. Real publishing APIs are never called.',
      });

      state.logWebMCPExecution({
        tool: 'prepare_for_platform',
        status: 'completed',
        input: { platform },
        shortResult: `Prepared ${platformConfig.name} package: "${platformConfig.title.slice(0, 36)}..."`,
      });

      return {
        success: true,
        mutated: true,
        platform,
        status: 'Prepared for publishing',
        data: platformConfig,
      };
    },
  });

  // --------------------------------------------------------------------------
  // TOOL 9: undo_last_action (Mutating)
  // --------------------------------------------------------------------------
  context.registerTool({
    name: 'undo_last_action',
    description: 'Restore the previous project state using the actual history stack.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    execute: async () => {
      const state = useCreatorFlowStore.getState();
      const success = state.undo();

      state.logWebMCPExecution({
        tool: 'undo_last_action',
        status: success ? 'completed' : 'failed',
        shortResult: success ? 'Restored prior state snapshot via history stack' : 'No prior history state to revert',
      });

      return {
        success,
        mutated: success,
        hasMoreUndo: state.canUndo(),
      };
    },
  });

  // --------------------------------------------------------------------------
  // TOOL 10: save_research_brief (Phase 6 — Research)
  // --------------------------------------------------------------------------
  context.registerTool({
    name: 'save_research_brief',
    description:
      'Save a structured research brief (topic, audience, thesis, hooks, narrative beats) to the active project state.',
    inputSchema: {
      type: 'object',
      properties: {
        topic: { type: 'string' },
        audience: { type: 'string' },
        coreThesis: { type: 'string' },
        hooks: { type: 'array', items: { type: 'string' } },
        keyBeats: { type: 'array', items: { type: 'string' } },
      },
      required: ['topic', 'coreThesis'],
    },
    handler: async (input: any) => {
      const state = useCreatorFlowStore.getState();
      const brief = {
        id: `brief_${Date.now()}`,
        topic: input.topic,
        audience: input.audience || 'Target Audience',
        coreThesis: input.coreThesis,
        hooks: input.hooks || [],
        keyBeats: input.keyBeats || [],
        savedAt: new Date().toLocaleTimeString(),
      };
      state.saveResearchBrief(brief);
      return { success: true, brief };
    },
    execute: async (input: any) => {
      const state = useCreatorFlowStore.getState();
      const brief = {
        id: `brief_${Date.now()}`,
        topic: input.topic,
        audience: input.audience || 'Target Audience',
        coreThesis: input.coreThesis,
        hooks: input.hooks || [],
        keyBeats: input.keyBeats || [],
        savedAt: new Date().toLocaleTimeString(),
      };
      state.saveResearchBrief(brief);
      return { success: true, brief };
    },
  });

  // Mark as registered and update store status
  doc.__creatorflow_webmcp_registered__ = true;
  const totalCount = toolRegistry.size;
  useCreatorFlowStore.getState().setWebMCPReady(true, totalCount);

  // Log system initialization in agent activity
  useCreatorFlowStore.getState().logAgentActivity({
    tool: 'webmcp.init',
    action: `Registered ${totalCount} WebMCP tools with document.modelContext`,
    status: 'completed',
    details: 'Agent-native imperative bridge connected and operable.',
  });

  return { ready: true, toolCount: totalCount };
}

/**
 * Direct execution helper for registered tools (used by Director & test suite)
 */
export async function executeWebMCPTool(name: string, args?: any): Promise<any> {
  initWebMCP();
  const tool = toolRegistry.get(name);
  if (!tool) throw new Error(`WebMCP Tool "${name}" is not registered.`);

  // If native ModelContext has an executeTool function, attempt calling with the RegisteredTool
  if (typeof document !== 'undefined' && document.modelContext?.executeTool) {
    const nativeRegistered = nativeToolMap.get(name);
    if (nativeRegistered) {
      try {
        return await document.modelContext.executeTool(nativeRegistered, args);
      } catch (err) {
        console.warn(`Native executeTool call for "${name}" threw, falling back to direct execution:`, err);
      }
    }
  }

  const fn = tool.execute || tool.handler;
  return await fn!(args);
}

/**
 * Returns all registered tools
 */
export function getRegisteredTools(): WebMCPToolDefinition[] {
  initWebMCP();
  return Array.from(toolRegistry.values());
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
