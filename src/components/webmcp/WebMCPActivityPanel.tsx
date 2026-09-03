'use client';

import React, { useState } from 'react';
import { useCreatorFlowStore } from '@/store/creatorFlowStore';
import { 
  Terminal, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Code2, 
  Layers, 
  Wrench, 
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const WebMCPActivityPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'executions' | 'tools'>('executions');

  const webmcpReady = useCreatorFlowStore((s) => s.webmcpReady);
  const webmcpToolCount = useCreatorFlowStore((s) => s.webmcpToolCount || 9);
  const webmcpExecutions = useCreatorFlowStore((s) => s.webmcpExecutions);

  const registeredToolNames = [
    { name: 'get_project_state', desc: 'Read-only: Project details, timeline state, aspect ratio & publishing info' },
    { name: 'get_transcript', desc: 'Read-only: 7-cue transcript with precise timestamps' },
    { name: 'find_best_moment', desc: 'Read-only: Deterministic highlight finder (00:18 → 00:48)' },
    { name: 'create_edit_plan', desc: 'Proposal: Generates edit proposal without mutating state' },
    { name: 'apply_edit_plan', desc: 'Mutating: Trims timeline, sets edit plan, updates history' },
    { name: 'add_captions', desc: 'Mutating: Toggles captions overlay in actual project state' },
    { name: 'change_aspect_ratio', desc: 'Mutating: Reframes canvas to 16:9, 9:16, or 1:1' },
    { name: 'prepare_for_platform', desc: 'Mutating: Generates platform metadata for YouTube, IG, LinkedIn, X, Medium' },
    { name: 'undo_last_action', desc: 'Mutating: Restores prior project state via actual history stack' },
  ];

  return (
    <div className="border-t border-[#1f222b] bg-[#0c0d12] flex flex-col shrink-0 select-none">
      {/* Header Bar */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-[#12141c] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-semibold text-white tracking-tight flex items-center gap-2">
            WebMCP Activity
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-800/50 text-[10px] text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Connected
          </span>
          <span className="text-[10px] font-mono text-[#8b91a2] bg-[#161822] px-1.5 py-0.5 rounded border border-[#232634]">
            Registered tools: {webmcpToolCount}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[#787f90]">
          <span className="text-[10px] font-mono hidden sm:inline">
            {webmcpExecutions.length} execution{webmcpExecutions.length === 1 ? '' : 's'}
          </span>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </div>
      </div>

      {/* Expandable Body */}
      {isOpen && (
        <div className="p-3 border-t border-[#1a1c24] bg-[#090a0e] space-y-2.5 max-h-60 overflow-y-auto">
          {/* Subtabs: Executions vs Registered Tools */}
          <div className="flex items-center gap-2 border-b border-[#181a22] pb-2">
            <button
              onClick={() => setActiveTab('executions')}
              className={`text-[11px] font-medium px-2 py-0.5 rounded transition-colors ${
                activeTab === 'executions'
                  ? 'bg-[#1e2230] text-white'
                  : 'text-[#717789] hover:text-[#c0c5d4]'
              }`}
            >
              Real Executions ({webmcpExecutions.length})
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`text-[11px] font-medium px-2 py-0.5 rounded transition-colors ${
                activeTab === 'tools'
                  ? 'bg-[#1e2230] text-white'
                  : 'text-[#717789] hover:text-[#c0c5d4]'
              }`}
            >
              Registered Tools ({registeredToolNames.length})
            </button>
          </div>

          {/* Tab 1: Real Tool Executions */}
          {activeTab === 'executions' && (
            <div className="space-y-1.5">
              {webmcpExecutions.length === 0 ? (
                <div className="py-4 text-center text-[#636879] text-xs">
                  No WebMCP tools executed yet.
                  <span className="block text-[11px] text-[#4f5362] mt-0.5">
                    Click &ldquo;Find the strongest 30 seconds...&rdquo; in Director to trigger real agent tools.
                  </span>
                </div>
              ) : (
                webmcpExecutions.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 rounded bg-[#11131a] border border-[#1d202b] flex items-start justify-between gap-2 text-xs"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="text-emerald-400 font-semibold truncate">
                          {item.tool}
                        </span>
                        <span className="text-[#555a6a] text-[10px]">
                          • {item.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#c4c9d7] truncate leading-tight">
                        {item.shortResult}
                      </p>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#181a24] text-emerald-400 border border-emerald-900/50 shrink-0">
                      success
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 2: Registered Tools */}
          {activeTab === 'tools' && (
            <div className="grid grid-cols-1 gap-1.5">
              {registeredToolNames.map((tool, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded bg-[#101219] border border-[#1b1e28] flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <span className="font-mono text-xs text-white font-medium block truncate">
                      {tool.name}
                    </span>
                    <span className="text-[10px] text-[#717789] block truncate">
                      {tool.desc}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-white/50 bg-[#161822] px-1.5 py-0.5 rounded shrink-0">
                    document.modelContext
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
