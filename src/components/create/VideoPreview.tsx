'use client';

import React, { useEffect, useRef } from 'react';
import { useCreatorFlowStore } from '@/store/creatorFlowStore';
import { creatorFlowOperations } from '@/domain/operations';
import { AspectRatio } from '@/types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Subtitles, 
  Smartphone, 
  Monitor, 
  Square, 
  Scissors, 
  Volume2,
  Layers,
  Sparkles
} from 'lucide-react';

export const VideoPreview: React.FC = () => {
  const currentTime = useCreatorFlowStore((s) => s.timeline.currentTime);
  const duration = useCreatorFlowStore((s) => s.timeline.duration);
  const isPlaying = useCreatorFlowStore((s) => s.timeline.isPlaying);
  const trimStart = useCreatorFlowStore((s) => s.timeline.trimStart);
  const trimEnd = useCreatorFlowStore((s) => s.timeline.trimEnd);
  const aspectRatio = useCreatorFlowStore((s) => s.aspectRatio);
  const captions = useCreatorFlowStore((s) => s.captions);
  const editPlan = useCreatorFlowStore((s) => s.editPlan);
  const project = useCreatorFlowStore((s) => s.project);
  const transcript = useCreatorFlowStore((s) => s.transcript);

  // Synchronous playback simulation loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        const store = useCreatorFlowStore.getState();
        let nextTime = store.timeline.currentTime + 0.25;

        // If beyond trimEnd, loop back to trimStart
        if (nextTime >= store.timeline.trimEnd) {
          nextTime = store.timeline.trimStart;
        }

        creatorFlowOperations.setCurrentTime(nextTime);
      }, 250);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Current active segment text for subtitles
  const activeSegment = transcript.find(
    (s) => currentTime >= s.start && currentTime < s.end
  ) || transcript[0];

  const currentDurationFormatted = formatTime(currentTime);
  const totalDurationFormatted = formatTime(duration);
  const trimDuration = Math.round(trimEnd - trimStart);
  const isTrimmed = trimStart > 0 || trimEnd < duration;

  // Aspect ratio styling
  const getAspectRatioClasses = (ratio: AspectRatio) => {
    switch (ratio) {
      case '9:16':
        return 'w-[260px] h-[460px] md:w-[280px] md:h-[500px]';
      case '1:1':
        return 'w-[360px] h-[360px] md:w-[420px] md:h-[420px]';
      case '16:9':
      default:
        return 'w-full max-w-[700px] aspect-video';
    }
  };

  const lastAIAction = useCreatorFlowStore((s) => s.lastAIAction);

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-4 bg-[#090a0d] relative overflow-hidden select-none">
      {/* AI Changed This Banner with instant Undo */}
      {lastAIAction && (
        <div className="w-full max-w-2xl mb-2 px-3.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-700/70 flex items-center justify-between gap-3 text-xs shadow-md animate-fade-in">
          <div className="flex items-center gap-2 text-emerald-300 min-w-0">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-bold text-emerald-200 shrink-0 text-xs">AI changed this</span>
            <span className="text-[#cce2d6] truncate text-[11px] font-medium">• {lastAIAction.description}</span>
          </div>

          <button
            onClick={() => creatorFlowOperations.undoAIAction()}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#10141f] hover:bg-white text-emerald-300 hover:text-black font-semibold text-xs border border-emerald-600/50 hover:border-white transition-all shrink-0 shadow-sm"
            title="Revert AI changes via WebMCP undo"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Undo</span>
          </button>
        </div>
      )}

      {/* Top Controls Toolbar: Aspect Ratio & Captions */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-3 shrink-0">
        {/* Selected Region & Cut Status */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#13151c] border border-[#222530] text-xs text-[#cfd4e2]">
            <Scissors className="w-3 h-3 text-[#9ca2b2]" />
            <span className="font-mono font-medium">
              {formatTime(trimStart)} → {formatTime(trimEnd)}
            </span>
            <span className="text-[10px] text-[#717787] font-mono">
              ({trimDuration}s)
            </span>
          </div>

          {isTrimmed && (
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
              Cut active
            </span>
          )}
        </div>

        {/* Aspect Ratio Buttons */}
        <div className="flex items-center gap-1 bg-[#12141a] p-0.5 rounded-lg border border-[#20232c]">
          <button
            onClick={() => creatorFlowOperations.changeAspectRatio('16:9')}
            title="16:9 Landscape"
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all ${
              aspectRatio === '16:9'
                ? 'bg-[#222632] text-white shadow-sm'
                : 'text-[#7e8594] hover:text-[#c4c9d5]'
            }`}
          >
            <Monitor className="w-3 h-3" />
            <span>16:9</span>
          </button>
          <button
            onClick={() => creatorFlowOperations.changeAspectRatio('9:16')}
            title="9:16 Vertical Reel"
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all ${
              aspectRatio === '9:16'
                ? 'bg-[#222632] text-white shadow-sm'
                : 'text-[#7e8594] hover:text-[#c4c9d5]'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>9:16</span>
          </button>
          <button
            onClick={() => creatorFlowOperations.changeAspectRatio('1:1')}
            title="1:1 Square"
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all ${
              aspectRatio === '1:1'
                ? 'bg-[#222632] text-white shadow-sm'
                : 'text-[#7e8594] hover:text-[#c4c9d5]'
            }`}
          >
            <Square className="w-3 h-3" />
            <span>1:1</span>
          </button>

          <div className="h-3.5 w-px bg-[#20232c] mx-0.5" />

          {/* Captions Toggle */}
          <button
            onClick={() => creatorFlowOperations.toggleCaptions()}
            title={captions.enabled ? 'Disable captions' : 'Enable captions'}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all ${
              captions.enabled
                ? 'bg-[#292f42] text-white border border-[#404760]'
                : 'text-[#7e8594] hover:text-[#c4c9d5]'
            }`}
          >
            <Subtitles className="w-3 h-3" />
            <span>CC</span>
          </button>
        </div>
      </div>

      {/* Video Preview Canvas / Mock Monitor */}
      <div className="flex-1 flex items-center justify-center w-full min-h-0">
        <div
          className={`relative rounded-xl border border-[#242735] bg-[#0f1117] overflow-hidden shadow-2xl flex flex-col transition-all duration-300 ${getAspectRatioClasses(
            aspectRatio
          )}`}
        >
          {/* Subtle Studio Lighting background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#171a24] via-[#0f1118] to-[#090a0e] opacity-90 pointer-events-none" />
          
          {/* Subtle Grid / Safe area overlay for 9:16 */}
          {aspectRatio === '9:16' && (
            <div className="absolute inset-x-4 inset-y-8 border border-dashed border-white/[0.06] rounded pointer-events-none z-10 flex flex-col justify-between p-2">
              <span className="text-[9px] text-white/20 font-mono">Mobile safe zone</span>
              <span className="text-[9px] text-white/20 font-mono text-right">Reel margins</span>
            </div>
          )}

          {/* Center Speaker Simulation & Graphics */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center">
            {/* Speaker Silhouette / Camera Feed Mock */}
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-[#1b1e2a] border border-[#2e3344] flex items-center justify-center shadow-inner relative overflow-hidden">
                {/* Simulated studio glow */}
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-cyan-500/10 blur-md" />
                <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full bg-purple-500/10 blur-md" />

                <div className="w-12 h-12 rounded-full bg-[#252a3a] flex items-center justify-center text-white/80 font-mono text-xs font-semibold">
                  HOST
                </div>
              </div>

              {/* Audio visualizer dots around speaker when playing */}
              {isPlaying && (
                <div className="absolute -bottom-2 inset-x-0 flex justify-center items-end gap-1 h-4">
                  <span className="w-1 bg-emerald-400 rounded-full audio-bar-1" />
                  <span className="w-1 bg-emerald-400 rounded-full audio-bar-2" />
                  <span className="w-1 bg-emerald-400 rounded-full audio-bar-3" />
                  <span className="w-1 bg-emerald-400 rounded-full audio-bar-4" />
                  <span className="w-1 bg-emerald-400 rounded-full audio-bar-5" />
                </div>
              )}
            </div>

            {/* Video Title Card Overlay */}
            <div className="space-y-1 max-w-sm">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/40 border border-white/10 text-[10px] font-mono text-[#a2a8b9]">
                <Layers className="w-2.5 h-2.5 text-emerald-400" />
                <span>WebMCP Agent-Native Source</span>
              </div>
              <h3 className="text-base font-medium text-white tracking-tight">
                {project.title}
              </h3>
            </div>
          </div>

          {/* Live Captions Overlay */}
          {captions.enabled && (
            <div className="relative z-20 px-6 pb-6 text-center">
              <div className="inline-block px-3.5 py-1.5 rounded-md bg-black/85 backdrop-blur-sm border border-white/10 text-white text-xs md:text-sm font-semibold tracking-wide shadow-lg animate-fade-in">
                {activeSegment ? activeSegment.text : captions.currentText}
              </div>
            </div>
          )}

          {/* Top Video HUD metadata */}
          <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-mono font-medium text-white/70 bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
                REC 4K
              </span>
            </div>
            <span className="text-[10px] font-mono text-white/60 bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
              {editPlan.name}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Video Controls: Play/Pause, Scrubber, Timecode */}
      <div className="w-full max-w-2xl mt-3 flex items-center justify-between gap-4 p-2.5 rounded-xl bg-[#12141c] border border-[#222532] shrink-0">
        <div className="flex items-center gap-2">
          {/* Play / Pause Button */}
          <button
            onClick={() => creatorFlowOperations.togglePlayback()}
            className="w-8 h-8 rounded-lg bg-white text-black hover:bg-neutral-200 transition-colors flex items-center justify-center font-medium shadow-sm"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          {/* Reset to Trim Start */}
          <button
            onClick={() => creatorFlowOperations.setCurrentTime(trimStart)}
            className="p-1.5 rounded-lg text-[#858c9e] hover:text-white hover:bg-[#1a1c25] transition-colors"
            title="Cue to cut start"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Current Timecode & Duration */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="text-white font-semibold">{currentDurationFormatted}</span>
          <span className="text-[#555a6a]">/</span>
          <span className="text-[#858c9e]">{totalDurationFormatted}</span>
        </div>

        {/* Selected Region Status Indicator */}
        <div className="text-right">
          <span className="text-[11px] text-[#787f92] font-mono block">
            Region: {formatTime(trimStart)} → {formatTime(trimEnd)}
          </span>
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
