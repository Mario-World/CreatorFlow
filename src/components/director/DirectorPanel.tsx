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
  RotateCcw
} from 'lucide-react';

export const DirectorPanel: React.FC = () => {
  const directorOpen = useCreatorFlowStore((s) => s.directorOpen);
  const agentActivity = useCreatorFlowStore((s) => s.agentActivity);
  const proposedEdit = useCreatorFlowStore((s) => s.proposedEdit);
  const project = useCreatorFlowStore((s) => s.project);
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
    <aside className="w-80 lg:w-92 border-l border-[#1c1f2b] bg-black flex flex-col h-full shrink-0 select-none">
      {/* Header */}
      <div className="p-4 border-b border-[#1c1f2b]">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-white" />
            <h2 className="text-sm font-semibold text-white tracking-tight">
              Director
            </h2>
          </div>
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#11131b] text-xs text-emerald-400 font-mono border border-emerald-900/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Connected
          </span>
        </div>
        <p className="text-xs text-[#8c92a2] leading-snug">
          Express the outcome you want to make.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* PROPOSED EDIT CARD */}
        {proposedEdit && (
          <div className="p-4 rounded-2xl bg-[#0e1017] border border-emerald-500/40 shadow-xl space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-mono font-bold tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                PROPOSED EDIT
              </span>
              <span className="text-xs font-mono text-[#788094]">
                Awaiting Approval
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="text-base font-bold text-white font-mono">
                {proposedEdit.startFormatted} → {proposedEdit.endFormatted}
              </div>
              <p className="text-xs text-[#cad0e0] font-medium leading-snug">
                &ldquo;{proposedEdit.title}&rdquo;
              </p>
              <div className="flex items-center gap-3 text-xs font-mono text-[#8e95aa] pt-0.5">
                <span>Format: <strong className="text-white">{proposedEdit.aspectRatio}</strong></span>
                <span>•</span>
                <span>Captions: <strong className="text-white">{proposedEdit.captions ? 'On' : 'Off'}</strong></span>
              </div>
            </div>

            {/* Approve / Reject Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => creatorFlowOperations.approveProposedEdit()}
                className="w-full py-2 px-3 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>Approve</span>
              </button>
              <button
                onClick={() => creatorFlowOperations.rejectProposedEdit()}
                className="w-full py-2 px-3 rounded-lg bg-[#141620] hover:bg-[#1f2230] text-[#a2a8ba] hover:text-white text-xs font-medium border border-[#242838] transition-colors flex items-center justify-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>Reject</span>
              </button>
            </div>
            <p className="text-[11px] text-[#6b7182] text-center leading-tight">
              State will not mutate until approved.
            </p>
          </div>
        )}

        {/* Active Saved Research Brief from Phase 6 */}
        {project.researchBrief && (
          <div className="p-3 rounded-xl bg-[#111422] border border-purple-800/40 space-y-1.5 animate-fade-in text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider font-semibold">
                Saved Research Brief
              </span>
              <span className="text-[10px] text-[#6d758a]">Phase 6 Active</span>
            </div>
            <p className="text-white font-medium truncate">
              {project.researchBrief.topic}
            </p>
            <button
              type="button"
              onClick={() => handleRunIntent('Find the strongest 30 seconds and make it a vertical reel')}
              className="text-[11px] text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 pt-0.5"
            >
              <span>Apply recommended cut</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Intent Input Form */}
        <form onSubmit={handleSubmit} className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wider text-[#737a8c]">
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
              placeholder="What outcome do you want?"
              className="w-full resize-none rounded-xl bg-[#0c0d13] border border-[#202330] px-3.5 py-2.5 text-xs text-white placeholder-[#555a69] focus:outline-none focus:border-[#424b64] focus:ring-1 focus:ring-[#424b64] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={!intentInput.trim() || isRunning}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              intentInput.trim() && !isRunning
                ? 'bg-white text-black hover:bg-neutral-200 shadow-sm'
                : 'bg-[#141620] text-[#555b6e] border border-[#212433] cursor-not-allowed'
            }`}
          >
            {isRunning ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
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
          <span className="block text-xs font-medium uppercase tracking-wider text-[#737a8c]">
            Suggested Actions
          </span>
          <div className="grid grid-cols-1 gap-1.5">
            {exampleIntents.map((intent, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleRunIntent(intent)}
                disabled={isRunning}
                className="group w-full text-left p-3 rounded-xl bg-[#0b0c12] hover:bg-[#141622] border border-[#1b1e2a] hover:border-[#2f3548] text-xs text-[#c6cbda] hover:text-white transition-all flex items-center justify-between"
              >
                <span className="pr-2 leading-relaxed">{intent}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#585e72] group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Agent Activity Trace */}
        <div className="space-y-2 pt-2 border-t border-[#1c1e28]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-[#737a8c] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#8a91a3]" />
              Recent Actions
            </span>
            <span className="text-xs font-mono text-[#585e70]">
              {agentActivity.length} logged
            </span>
          </div>

          <div className="space-y-2">
            {agentActivity.slice(0, 3).map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-xl bg-[#0c0d14] border border-[#1b1e2a] space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-900/50">
                    {act.tool}
                  </span>
                  <span className="text-[#5b6173] text-[11px]">{act.timestamp}</span>
                </div>
                <p className="text-xs text-[#d3d8e5] font-medium leading-snug">
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
