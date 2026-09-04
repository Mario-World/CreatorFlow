'use client';

import React, { useState, useMemo } from 'react';
import { useCreatorFlowStore } from '@/store/creatorFlowStore';
import { 
  Terminal, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2,
  Workflow
} from 'lucide-react';

import { getRegisteredTools } from '@/lib/webmcp';

export const WebMCPActivityPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'executions' | 'tools' | 'architecture'>('executions');

  const webmcpExecutions = useCreatorFlowStore((s) => s.webmcpExecutions);
  const webmcpToolCount = useCreatorFlowStore((s) => s.webmcpToolCount);
  const registeredTools = useMemo(() => getRegisteredTools(), [webmcpToolCount]);

  return (
    <div className="border-t border-[#1c1f2b] bg-[#090a0f] flex flex-col shrink-0 select-none">
      {/* Header Bar */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-[#11131c] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-semibold text-white tracking-tight">
            WebMCP Activity
          </span>
        </div>

        <div className="flex items-center gap-2 text-[#787f90]">
          <span className="text-xs font-mono">
            {webmcpExecutions.length} tool dispatch{webmcpExecutions.length === 1 ? '' : 'es'}
          </span>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </div>
      </div>

      {/* Expandable Body */}
      {isOpen && (
        <div className="p-3 border-t border-[#1a1c26] bg-black space-y-2.5 max-h-72 overflow-y-auto">
          {/* Subtabs */}
          <div className="flex items-center justify-between border-b border-[#181a24] pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('executions')}
                className={`text-xs font-medium px-2.5 py-1 rounded transition-colors ${
                  activeTab === 'executions'
                    ? 'bg-[#181b26] text-white'
                    : 'text-[#717789] hover:text-[#c0c5d4]'
                }`}
              >
                Executions ({webmcpExecutions.length})
              </button>
              <button
                onClick={() => setActiveTab('tools')}
                className={`text-xs font-medium px-2.5 py-1 rounded transition-colors ${
                  activeTab === 'tools'
                    ? 'bg-[#181b26] text-white'
                    : 'text-[#717789] hover:text-[#c0c5d4]'
                }`}
              >
                Tools ({registeredTools.length})
              </button>
              <button
                onClick={() => setActiveTab('architecture')}
                className={`text-xs font-medium px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                  activeTab === 'architecture'
                    ? 'bg-[#181b26] text-emerald-400 border border-emerald-900/50'
                    : 'text-[#717789] hover:text-[#c0c5d4]'
                }`}
              >
                <Workflow className="w-3 h-3" />
                <span>Architecture Flow</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Real Tool Executions */}
          {activeTab === 'executions' && (
            <div className="space-y-2">
              {webmcpExecutions.length === 0 ? (
                <div className="py-5 text-center text-[#636879] text-xs space-y-1">
                  <p className="font-medium text-[#888e9f]">No tools executed yet.</p>
                  <p className="text-[11px] text-[#555a69]">
                    Click &ldquo;Find the strongest 30 seconds...&rdquo; in Director to run agent actions.
                  </p>
                </div>
              ) : (
                webmcpExecutions.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-[#0e1017] border border-[#1d202d] space-y-1.5 text-xs animate-fade-in"
                  >
                    <div className="flex items-center justify-between font-mono text-xs">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-emerald-400 font-semibold truncate">
                          {item.tool}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-[#646a7d]">
                        <span>{item.timestamp}</span>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-900/50">
                          ok
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#cfd4e2] leading-snug">
                      {item.shortResult}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 2: Registered Tools */}
          {activeTab === 'tools' && (
            <div className="grid grid-cols-1 gap-2">
              {registeredTools.map((tool, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-[#0e1017] border border-[#1b1e2a] flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <span className="font-mono text-xs text-white font-medium block truncate">
                      {tool.name}
                    </span>
                    <span className="text-xs text-[#7e8598] block truncate">
                      {tool.description}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400/90 bg-[#141620] px-1.5 py-0.5 rounded shrink-0">
                    tool
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Architecture Flow Diagram */}
          {activeTab === 'architecture' && (
            <div className="p-3 rounded-xl bg-[#090b10] border border-[#1b202e] space-y-3 font-mono text-xs animate-fade-in">
              <div className="flex items-center justify-between border-b border-[#171b26] pb-2 text-[11px] text-[#71788c]">
                <span className="text-white font-semibold flex items-center gap-1.5">
                  <Workflow className="w-3.5 h-3.5 text-emerald-400" />
                  Agent-Native WebMCP Flow
                </span>
                <span className="text-emerald-400 font-medium">Human-in-the-Loop</span>
              </div>

              {/* Step Flow */}
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-[#10131d] border border-[#202638] flex items-center justify-between">
                  <span className="text-white font-bold">1. CREATOR INTENT</span>
                  <span className="text-sky-400 font-sans italic">&ldquo;Make this a strong short&rdquo;</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-2 rounded-lg bg-[#0e121a] border border-[#1c2436] space-y-1">
                    <span className="text-sky-400 font-bold block">1. Understand</span>
                    <p className="text-[10px] text-[#8e96aa] leading-tight font-sans">
                      • Transcript cues<br />• Best moment detect<br />• get_project_state
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#0e121a] border border-[#1c2436] space-y-1">
                    <span className="text-emerald-400 font-bold block">2. Edit</span>
                    <p className="text-[10px] text-[#8e96aa] leading-tight font-sans">
                      • Timeline trim (30s)<br />• Captions overlay<br />• 9:16 vertical canvas
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#0e121a] border border-[#1c2436] space-y-1">
                    <span className="text-purple-400 font-bold block">3. Prepare</span>
                    <p className="text-[10px] text-[#8e96aa] leading-tight font-sans">
                      • LinkedIn, X, Medium<br />• Headline & copy<br />• Research brief
                    </p>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-[#141915] border border-emerald-500/40 flex items-center justify-between">
                  <span className="text-emerald-300 font-bold">2. HUMAN REVIEW</span>
                  <span className="text-xs text-[#cad0e0] font-sans">Approve Edit / Undo AI changes</span>
                </div>

                <div className="p-2 rounded-lg bg-[#12141c] border border-[#212638] flex items-center justify-between">
                  <span className="text-white font-bold">3. OUTPUT</span>
                  <span className="text-emerald-400 font-bold">READY TO PUBLISH</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
