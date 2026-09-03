'use client';

import React from 'react';
import { useCreatorFlowStore } from '@/store/creatorFlowStore';
import { creatorFlowOperations } from '@/domain/operations';
import { 
  FileSearch, 
  Sparkles, 
  ArrowRight, 
  Lightbulb, 
  Users, 
  Target, 
  CheckCircle2,
  Bookmark,
  Layers
} from 'lucide-react';

export const ResearchWorkspace: React.FC = () => {
  const project = useCreatorFlowStore((s) => s.project);
  const transcript = useCreatorFlowStore((s) => s.transcript);
  const setCurrentArea = useCreatorFlowStore((s) => s.setCurrentArea);

  const researchInsights = [
    {
      id: 'ins_1',
      title: 'The Human vs. Agent Interface Paradox',
      hook: 'Most websites were designed for humans; agents guess how interfaces work.',
      timeRange: { start: 0, end: 18 },
      segmentCues: ['00:00', '00:08'],
      takeaway: 'Great for opening hooks across TikTok, Reels, and X threads.',
      actionLabel: 'Cut Opening Hook (00:00 → 00:18)',
    },
    {
      id: 'ins_2',
      title: 'WebMCP Paradigm Shift: Structured Tools',
      hook: 'WebMCP changes that by giving websites structured tools.',
      timeRange: { start: 18, end: 48 },
      segmentCues: ['00:18', '00:31'],
      takeaway: 'The highest-signal educational segment. Best for LinkedIn & YouTube clips.',
      actionLabel: 'Cut Core Thesis (00:18 → 00:48)',
    },
    {
      id: 'ins_3',
      title: 'Autonomous Creator Workflows & Scaling',
      hook: 'Imagine telling your editor what you want instead of searching footage.',
      timeRange: { start: 62, end: 92 },
      segmentCues: ['01:02', '01:18'],
      takeaway: 'Direct call to action and vision for creator productivity tooling.',
      actionLabel: 'Cut Vision Outro (01:02 → 01:32)',
    },
  ];

  const audienceAngles = [
    {
      audience: 'AI Engineers & Devs',
      focus: 'Architecture of structured tools, eliminating brittle Selenium/Puppeteer DOM scraping.',
      suggestedPlatform: 'X (Twitter) & GitHub / Medium',
    },
    {
      audience: 'Product Leaders & Founders',
      focus: 'Transition from human-only SaaS interfaces to agent-operable workspaces.',
      suggestedPlatform: 'LinkedIn Thought Leadership',
    },
    {
      audience: 'Content Creators & Editors',
      focus: 'Eliminating repetitive timeline scrubbing and generating multi-platform clips via intent.',
      suggestedPlatform: 'YouTube & Instagram Reels',
    },
  ];

  const handleApplyCutFromResearch = (start: number, end: number, name: string) => {
    creatorFlowOperations.applyEdit({
      name: `Research Cut: ${name}`,
      start,
      end,
      description: `Targeted clip generated from Research insight [${formatTime(start)} - ${formatTime(end)}]`,
    });
    setCurrentArea('create');
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-y-auto bg-[#090a0d] p-6">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        {/* Workspace Header */}
        <div className="pb-5 border-b border-[#1c1f2a] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded">
                Source Intelligence
              </span>
              <span className="text-xs text-[#6e7587] font-mono">
                {project.title} • {project.durationFormatted}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Content Research & Insights
            </h1>
            <p className="text-xs text-[#8c92a4] mt-1 max-w-2xl">
              Automated extraction of thesis statements, high-impact timestamps, and multi-audience packaging angles.
            </p>
          </div>

          <button
            onClick={() => setCurrentArea('create')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors shadow-sm self-start md:self-auto"
          >
            <span>Jump to Create Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Section 1: Core Narrative Hooks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              High-Signal Moments & Hooks
            </h3>
            <span className="text-[11px] font-mono text-[#6c7283]">
              3 extracted key segments
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {researchInsights.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-[#222534] bg-[#11131b] p-4 flex flex-col justify-between hover:border-[#333a4f] transition-all space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-emerald-400 bg-emerald-950/70 px-1.5 py-0.5 rounded border border-emerald-900/50">
                      {formatTime(item.timeRange.start)} → {formatTime(item.timeRange.end)}
                    </span>
                    <span className="text-[#595f71]">
                      {Math.round(item.timeRange.end - item.timeRange.start)}s clip
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-white leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-xs text-[#c2c7d4] italic bg-[#0b0c10] p-2 rounded-lg border border-[#1b1e2a]">
                    &ldquo;{item.hook}&rdquo;
                  </p>

                  <p className="text-[11px] text-[#7d8496] leading-relaxed">
                    {item.takeaway}
                  </p>
                </div>

                <button
                  onClick={() =>
                    handleApplyCutFromResearch(
                      item.timeRange.start,
                      item.timeRange.end,
                      item.title
                    )
                  }
                  className="w-full py-2 px-3 rounded-lg bg-[#191c27] hover:bg-white text-[#c9cfde] hover:text-black text-xs font-semibold border border-[#272c3d] hover:border-white transition-all flex items-center justify-center gap-1.5"
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Target Audience Angles */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-sky-400" />
            Audience Angles & Positioning
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {audienceAngles.map((angle, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[#1e222e] bg-[#0f1118] p-4 space-y-2.5"
              >
                <div className="flex items-center gap-2">
                  <Target className="w-3.5 h-3.5 text-[#868d9e]" />
                  <h4 className="text-xs font-semibold text-white">
                    {angle.audience}
                  </h4>
                </div>

                <p className="text-xs text-[#9aa1b3] leading-relaxed">
                  {angle.focus}
                </p>

                <div className="pt-2 border-t border-[#1a1d28] text-[11px] font-mono text-[#6c7385]">
                  Best Fit: <span className="text-[#cfd4e2]">{angle.suggestedPlatform}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
