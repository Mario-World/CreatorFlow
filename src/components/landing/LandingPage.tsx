'use client';

import React from 'react';
import { useCreatorFlowStore } from '@/store/creatorFlowStore';
import { 
  Play, 
  Share2, 
  Volume2, 
  CheckCircle2, 
  ChevronRight,
  Upload,
  Scissors,
  Send
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const setCurrentArea = useCreatorFlowStore((s) => s.setCurrentArea);
  const project = useCreatorFlowStore((s) => s.project);

  return (
    <div className="h-full overflow-y-auto bg-black text-[#f3f4f7] selection:bg-[#2b7fff] selection:text-white">
      <div className="max-w-7xl mx-auto w-full px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Minimalist Value Proposition & Simple Workflow */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#11131c] border border-[#222738] text-xs font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Agent-Native Content Workspace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-[1.1]">
                Your content. <br />
                <span className="cardboard-underline font-normal text-white">Your workflow.</span>
              </h1>

              <p className="text-base text-[#9da3b4] font-normal leading-relaxed max-w-md">
                Less busywork. An intelligent workspace that lets creators research, edit, and publish video content with agent-operable tools.
              </p>
            </div>

            {/* Simple 3-Step Workflow Process */}
            <div className="space-y-4 pt-1">
              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-lg bg-[#141622] border border-[#252a3b] flex items-center justify-center text-xs font-mono font-semibold text-white shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-sky-400" />
                    <span>Upload</span>
                  </h4>
                  <p className="text-xs text-[#8c92a4] mt-0.5">
                    Ingest your MP4 footage with automatic transcript cue parsing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-lg bg-[#141622] border border-[#252a3b] flex items-center justify-center text-xs font-mono font-semibold text-white shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Agent Edit</span>
                  </h4>
                  <p className="text-xs text-[#8c92a4] mt-0.5">
                    Agent finds the strongest 30s hook and reframes to 9:16 vertical shorts.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-lg bg-[#141622] border border-[#252a3b] flex items-center justify-center text-xs font-mono font-semibold text-white shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-purple-400" />
                    <span>Publish</span>
                  </h4>
                  <p className="text-xs text-[#8c92a4] mt-0.5">
                    One-click multi-platform package with AI content correction.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Trigger */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setCurrentArea('workspace')}
                className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-lg"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Open Workspace</span>
              </button>
              <button
                onClick={() => setCurrentArea('publish')}
                className="px-4 py-2.5 rounded-xl bg-[#12141c] hover:bg-[#181b26] text-white font-medium text-sm border border-[#232736] transition-all flex items-center gap-2"
              >
                <Share2 className="w-4 h-4 text-[#8c92a2]" />
                <span>View Publish</span>
              </button>
            </div>
          </div>

          {/* Right Column: Clean Cardboard Window Mockup */}
          <div className="lg:col-span-7">
            <div className="cardboard-window rounded-2xl bg-[#090a0f] border border-[#20232e] overflow-hidden">
              {/* Chrome Mock Window Header Bar */}
              <div className="px-4 py-2.5 bg-[#0e1017] border-b border-[#1c1f2b] flex items-center justify-between select-none">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  </div>
                  <span className="text-[11px] text-[#6e7486] font-mono ml-2">
                    CreatorFlow Studio
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171a24] text-emerald-400 border border-emerald-800/40">
                  9:16 Vertical Reel
                </span>
              </div>

              {/* Inside App Workspace */}
              <div className="p-4 bg-[#08090d] space-y-4">
                {/* Mock Video Canvas */}
                <div className="relative rounded-xl bg-[#0f1118] border border-[#232736] overflow-hidden aspect-video flex flex-col justify-between p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-400 bg-black/60 px-1.5 py-0.5 rounded border border-white/10">
                      9:16 VERTICAL
                    </span>
                    <span className="text-[10px] font-mono text-white/70 bg-black/60 px-1.5 py-0.5 rounded border border-white/10">
                      ACTIVE CUT (30s)
                    </span>
                  </div>

                  {/* Speaker visualizer */}
                  <div className="flex flex-col items-center justify-center space-y-2 py-4">
                    <div className="w-12 h-12 rounded-full bg-[#1e2332] border border-[#31384e] flex items-center justify-center text-white text-xs font-mono font-semibold shadow-inner">
                      HOST
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1 h-3 bg-emerald-400 rounded-full audio-bar-1" />
                      <span className="w-1 h-4 bg-emerald-400 rounded-full audio-bar-2" />
                      <span className="w-1 h-2 bg-emerald-400 rounded-full audio-bar-3" />
                      <span className="w-1 h-5 bg-emerald-400 rounded-full audio-bar-4" />
                    </div>
                  </div>

                  {/* Timecode bar */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/80 bg-black/70 px-2 py-1 rounded backdrop-blur-sm border border-white/10">
                    <span>0:18 / 0:48</span>
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-3 h-3 text-white/70" />
                      <span>1x</span>
                    </div>
                  </div>
                </div>

                {/* Simple Summary Card */}
                <div className="p-3.5 rounded-xl bg-[#0e1017] border border-[#1d202b] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-white">
                      Curated Short Summary
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400">
                      Ready to Publish
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#c9cfde]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>30-second core highlight (00:18 → 00:48)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Reframed to 9:16 vertical short with subtitles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>AI-polished copy ready for YouTube, IG, LinkedIn & X</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#1a1c26] flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#787e90]">
                      {project.title}
                    </span>
                    <button
                      onClick={() => setCurrentArea('workspace')}
                      className="px-3 py-1 rounded-md bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all flex items-center gap-1 shadow-sm"
                    >
                      <span>Open in Workspace</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
