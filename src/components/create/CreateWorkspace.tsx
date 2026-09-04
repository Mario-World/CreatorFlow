'use client';

import React from 'react';
import { useCreatorFlowStore } from '@/store/creatorFlowStore';
import { creatorFlowOperations } from '@/domain/operations';
import { AspectRatio } from '@/types';
import { VideoPreview } from './VideoPreview';
import { Timeline } from './Timeline';
import { TranscriptPanel } from './TranscriptPanel';
import { DirectorPanel } from '@/components/director/DirectorPanel';
import { Subtitles, Share2, Undo2 } from 'lucide-react';

export const CreateWorkspace: React.FC = () => {
  const aspectRatio = useCreatorFlowStore((s) => s.aspectRatio);
  const captions = useCreatorFlowStore((s) => s.captions);
  const canUndo = useCreatorFlowStore((s) => s.history.past.length > 0);
  const setCurrentArea = useCreatorFlowStore((s) => s.setCurrentArea);

  return (
    <div className="flex-1 flex h-[calc(100vh-3.5rem)] overflow-hidden bg-[#070709] select-none">
      {/* Main Column: Vertical Single Column Stack */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 space-y-4">
          {/* 1. Video Preview */}
          <div className="rounded-xl border border-[#1a1d28] bg-black overflow-hidden flex flex-col items-center">
            <VideoPreview />
          </div>

          {/* 2. Timeline — visibly reflects trimStart / trimEnd / aspect ratio changes */}
          <div className="rounded-xl border border-[#1a1d28] bg-[#0c0d12] overflow-hidden">
            <Timeline />
          </div>

          {/* 3. Transcript — clicking a segment calls selectTranscriptSegment */}
          <TranscriptPanel className="w-full max-h-56 overflow-hidden" />

          {/* 4. Edit Operations — compact inline control row */}
          <div className="p-3 rounded-xl border border-[#1a1d28] bg-[#0c0d12] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#71788a] uppercase tracking-wider">
                Aspect:
              </span>
              {(['16:9', '9:16', '1:1'] as AspectRatio[]).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => creatorFlowOperations.changeAspectRatio(ratio)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-medium border transition-all ${
                    aspectRatio === ratio
                      ? 'bg-[#1a2030] border-sky-500/60 text-white'
                      : 'bg-[#10121a] border-[#202434] text-[#71788a] hover:text-white'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => creatorFlowOperations.toggleCaptions()}
                className={`px-3 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                  captions.enabled
                    ? 'bg-emerald-950/70 border-emerald-800/60 text-emerald-400'
                    : 'bg-[#10121a] border-[#202434] text-[#71788a] hover:text-white'
                }`}
              >
                <Subtitles className="w-3.5 h-3.5" />
                <span>Captions: {captions.enabled ? 'On' : 'Off'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  creatorFlowOperations.preparePlatformOutput('linkedin');
                  setCurrentArea('publish');
                }}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-[#141824] hover:bg-[#1d2234] border border-[#28314a] text-sky-400 hover:text-sky-300 flex items-center gap-1.5 transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Prepare for Platform</span>
              </button>
            </div>
          </div>

          {/* 5. Undo — single persistent bar pinned at the bottom of this stack */}
          <div className="sticky bottom-0 pt-1 pb-2 bg-[#070709]">
            <button
              type="button"
              onClick={() => creatorFlowOperations.undo()}
              disabled={!canUndo}
              className={`w-full py-2.5 px-4 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                canUndo
                  ? 'bg-[#12141e] hover:bg-[#1c2030] border-[#252a3c] text-white cursor-pointer shadow-sm'
                  : 'bg-[#0a0b0f] border-[#181a24] text-[#444a5a] cursor-not-allowed'
              }`}
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Undo Last Action</span>
            </button>
          </div>
        </div>
      </main>

      {/* Right-side collapsible Director Panel with docked WebMCPActivityPanel */}
      <DirectorPanel />
    </div>
  );
};
