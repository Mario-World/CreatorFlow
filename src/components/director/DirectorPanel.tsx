'use client';

import React, { useState } from 'react';
import { useCreatorFlowStore } from '@/store/creatorFlowStore';
import { creatorFlowOperations } from '@/domain/operations';
import { WebMCPActivityPanel } from '@/components/webmcp/WebMCPActivityPanel';
import { 
  Bot, 
  Sparkles, 
  ArrowRight, 
  Activity, 
  Check, 
  X,
  Layers, 
  Compass, 
  RotateCcw,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export const DirectorPanel: React.FC = () => {
  const directorOpen = useCreatorFlowStore((s) => s.directorOpen);
  const agentActivity = useCreatorFlowStore((s) => s.agentActivity);
  const proposedEdit = useCreatorFlowStore((s) => s.proposedEdit);
  const lastAIAction = useCreatorFlowStore((s) => s.lastAIAction);
  const [intentInput, setIntentInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  if (!directorOpen) return null;

  const exampleIntents = [
    'Find the strongest 30 seconds and make it a vertical short',
    'Turn this into a LinkedIn post',
    'Make this a vertical reel',
    'Prepare this for X',
  ];

  const handleRunIntent = async (text: string) => {
    if (!text.trim() || isRunning) return;
    setIsRunning(true);

    try {
      await creatorFlowOperations.runDirectorIntent(text);
    } finally {
      setIsRunning(false);
      setIntentInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRunIntent(intentInput);
  };

  return (
    <aside className="w-80 lg:w-92 border-l border-[#1f222b] bg-[#0d0e13] flex flex-col h-full shrink-0 select-none">
      {/* Header */}
      <div className="p-4 border-b border-[#1f222b]">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-white" />
            <h2 className="text-sm font-semibold text-white tracking-tight">
              Director
            </h2>
          </div>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#171a24] text-[10px] text-emerald-400 font-mono border border-emerald-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            WebMCP Active
          </span>
        </div>
        <p className="text-xs text-[#8c92a2] leading-snug">
          Tell CreatorFlow what you want to make.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* PROPOSED EDIT CARD (Visible when agent generates an edit proposal) */}
        {proposedEdit && (
          <div className="p-3.5 rounded-xl bg-[#131622] border border-emerald-500/50 shadow-xl space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                PROPOSED EDIT
              </span>
              <span className="text-[10px] font-mono text-[#788094]">
                Awaiting Approval
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm font-bold text-white font-mono">
                {proposedEdit.startFormatted} → {proposedEdit.endFormatted}
              </div>
              <p className="text-xs text-[#cad0e0] font-medium">
                &ldquo;{proposedEdit.title}&rdquo;
              </p>
              <div className="flex items-center gap-3 text-[11px] font-mono text-[#8e95aa] pt-0.5">
                <span>Format: <strong className="text-white">{proposedEdit.aspectRatio}</strong></span>
                <span>•</span>
                <span>Captions: <strong className="text-white">{proposedEdit.captions ? 'On' : 'Off'}</strong></span>
              </div>
            </div>

            {/* Approve / Reject Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => creatorFlowOperations.approveProposedEdit()}
                className="w-full py-1.5 px-3 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve</span>
              </button>
              <button
                onClick={() => creatorFlowOperations.rejectProposedEdit()}
                className="w-full py-1.5 px-3 rounded-lg bg-[#1a1c27] hover:bg-[#252838] text-[#9ca2b6] hover:text-white text-xs font-medium border border-[#272b3c] transition-colors flex items-center justify-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            </div>
            <p className="text-[10px] text-[#6b7182] text-center leading-tight">
              State will not mutate until approved.
            </p>
          </div>
        )}

        {/* Intent Input Form */}
        <form onSubmit={handleSubmit} className="space-y-2">
          <label className="block text-[11px] font-medium uppercase tracking-wider text-[#737a8c]">
            Creator Intent
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={intentInput}
              onChange={(e) => setIntentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleRunIntent(intentInput);
                }
              }}
              placeholder="What should we make?"
              className="w-full resize-none rounded-lg bg-[#14161f] border border-[#232734] px-3 py-2 text-xs text-white placeholder-[#555a69] focus:outline-none focus:border-[#424b64] focus:ring-1 focus:ring-[#424b64] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={!intentInput.trim() || isRunning}
            className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              intentInput.trim() && !isRunning
                ? 'bg-white text-black hover:bg-neutral-200 shadow-sm'
                : 'bg-[#181a24] text-[#4f5567] border border-[#232634] cursor-not-allowed'
            }`}
          >
            {isRunning ? (
              <>
                <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Invoking WebMCP Tools...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run with Agent</span>
              </>
            )}
          </button>
        </form>

        {/* Example Intents */}
        <div className="space-y-2">
          <span className="block text-[11px] font-medium uppercase tracking-wider text-[#737a8c]">
            Example Intents
          </span>
          <div className="grid grid-cols-1 gap-1.5">
            {exampleIntents.map((intent, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleRunIntent(intent)}
                disabled={isRunning}
                className="group w-full text-left p-2.5 rounded-lg bg-[#12141c] hover:bg-[#191c27] border border-[#1f222e] hover:border-[#32384a] text-xs text-[#c6cbda] hover:text-white transition-all flex items-center justify-between"
              >
                <span className="pr-2 leading-tight">{intent}</span>
                <ArrowRight className="w-3 h-3 text-[#585e72] group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Agent Activity Trace */}
        <div className="space-y-2 pt-2 border-t border-[#1c1e28]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#737a8c] flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-[#8a91a3]" />
              Agent Activity
            </span>
            <span className="text-[10px] font-mono text-[#585e70]">
              {agentActivity.length} events
            </span>
          </div>

          <div className="space-y-2">
            {agentActivity.slice(0, 4).map((act) => (
              <div
                key={act.id}
                className="p-2.5 rounded-lg bg-[#11131a] border border-[#1e212c] space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-900/50">
                    {act.tool}
                  </span>
                  <span className="text-[#5b6173]">{act.timestamp}</span>
                </div>
                <p className="text-xs text-[#d3d8e5] font-medium">
                  {act.action}
                </p>
                {act.details && (
                  <p className="text-[11px] text-[#787f92] leading-tight">
                    {act.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WebMCP Activity Expandable Panel at bottom of Director */}
      <WebMCPActivityPanel />
    </aside>
  );
};
