'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useCreatorFlowStore } from '@/store/creatorFlowStore';
import { creatorFlowOperations } from '@/domain/operations';
import { Scissors, RotateCcw, Clock, ChevronsLeftRight } from 'lucide-react';

export const Timeline: React.FC = () => {
  const currentTime = useCreatorFlowStore((s) => s.timeline.currentTime);
  const duration = useCreatorFlowStore((s) => s.timeline.duration);
  const trimStart = useCreatorFlowStore((s) => s.timeline.trimStart);
  const trimEnd = useCreatorFlowStore((s) => s.timeline.trimEnd);
  const transcript = useCreatorFlowStore((s) => s.transcript);
  const editPlan = useCreatorFlowStore((s) => s.editPlan);

  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<'playhead' | 'start' | 'end' | null>(null);

  // Dynamic time ticks along timeline adapting to duration
  const numTicks = 6;
  const tickSeconds = Array.from({ length: numTicks + 1 }, (_, i) => 
    Math.min(duration, Math.round(i * (duration / numTicks)))
  );

  // Helper to convert mouse clientX to seconds
  const getSecondsFromMouse = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return 0;
      const rect = trackRef.current.getBoundingClientRect();
      const clickX = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const fraction = clickX / rect.width;
      return fraction * duration;
    },
    [duration]
  );

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only seek if not clicking handles directly
    const targetSec = Math.round(getSecondsFromMouse(e.clientX));
    creatorFlowOperations.setCurrentTime(targetSec);
  };

  const handleMouseDown = (type: 'playhead' | 'start' | 'end', e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(type);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const sec = Math.round(getSecondsFromMouse(e.clientX));

      if (isDragging === 'playhead') {
        creatorFlowOperations.setCurrentTime(sec);
      } else if (isDragging === 'start') {
        const newStart = Math.min(sec, trimEnd - 2);
        creatorFlowOperations.selectTimelineRange(Math.max(0, newStart), trimEnd);
      } else if (isDragging === 'end') {
        const newEnd = Math.max(sec, trimStart + 2);
        creatorFlowOperations.selectTimelineRange(trimStart, Math.min(duration, newEnd));
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !e.touches[0]) return;
      const sec = Math.round(getSecondsFromMouse(e.touches[0].clientX));

      if (isDragging === 'playhead') {
        creatorFlowOperations.setCurrentTime(sec);
      } else if (isDragging === 'start') {
        const newStart = Math.min(sec, trimEnd - 2);
        creatorFlowOperations.selectTimelineRange(Math.max(0, newStart), trimEnd);
      } else if (isDragging === 'end') {
        const newEnd = Math.max(sec, trimStart + 2);
        creatorFlowOperations.selectTimelineRange(trimStart, Math.min(duration, newEnd));
      }
    };

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(null);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, trimStart, trimEnd, duration, getSecondsFromMouse]);

  // Calculations for UI positioning
  const leftPercent = (trimStart / duration) * 100;
  const widthPercent = ((trimEnd - trimStart) / duration) * 100;
  const playheadPercent = (currentTime / duration) * 100;
  const isTrimmed = trimStart > 0 || trimEnd < duration;

  return (
    <div className="h-28 border-t border-[#1c1f2b] bg-black px-3 sm:px-6 py-2 sm:py-3 flex flex-col justify-between shrink-0 select-none z-10">
      {/* Timeline Header Row: Active Cut details & Quick reset */}
      <div className="flex items-center justify-between text-xs mb-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white tracking-wide uppercase text-[11px] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#8b91a0]" />
            Timeline
          </span>
          <span className="text-[#626879]">•</span>
          <span className="text-[#a4abbd] text-[11px] font-medium truncate max-w-sm">
            {editPlan.name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Visual state summary */}
          <div className="font-mono text-[11px] text-[#8e95a7] flex items-center gap-1.5">
            <span>Trim:</span>
            <span className="text-white font-medium">
              {formatTime(trimStart)} → {formatTime(trimEnd)}
            </span>
            <span className="text-[#555b6c]">({Math.round(trimEnd - trimStart)}s)</span>
          </div>

          {isTrimmed && (
            <button
              onClick={() => creatorFlowOperations.selectTimelineRange(0, duration)}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-[#a0a6b6] bg-[#171922] hover:bg-[#202430] hover:text-white border border-[#252836] transition-colors"
              title="Reset to full 01:32 timeline"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Reset Full</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Timeline Canvas Track */}
      <div className="relative py-2">
        {/* Time ruler ticks */}
        <div className="relative h-3 w-full mb-1 flex justify-between pointer-events-none text-[9px] font-mono text-[#585e70]">
          {tickSeconds.map((sec) => (
            <div
              key={sec}
              className="absolute transform -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${(sec / duration) * 100}%` }}
            >
              <div className="w-px h-1.5 bg-[#2a2e3d]" />
              <span>{formatTime(sec)}</span>
            </div>
          ))}
        </div>

        {/* Timeline Bar Track */}
        <div
          ref={trackRef}
          onClick={handleTrackClick}
          className="relative h-10 w-full rounded-lg bg-[#14161f] border border-[#232734] overflow-hidden cursor-pointer"
        >
          {/* Transcript segment boundary lines */}
          {transcript.map((seg) => (
            <div
              key={seg.id}
              className="absolute top-0 bottom-0 w-px bg-white/[0.04] pointer-events-none"
              style={{ left: `${(seg.start / duration) * 100}%` }}
              title={`${seg.startFormatted}: ${seg.text}`}
            />
          ))}

          {/* Initial Full vs Trimmed Visualization:
              Left Trimmed (Muted)
          */}
          {trimStart > 0 && (
            <div
              className="absolute top-0 bottom-0 left-0 bg-[#0c0d12]/80 backdrop-grayscale pointer-events-none border-r border-[#2d3142]"
              style={{ width: `${leftPercent}%` }}
            >
              <div className="w-full h-full opacity-20 bg-[repeating-linear-gradient(45deg,#000,#000_5px,#333_5px,#333_10px)]" />
            </div>
          )}

          {/* Active Edit Region: [───────|██████████████|─────────────────────] */}
          <div
            className={`absolute top-0 bottom-0 transition-none ${
              isTrimmed
                ? 'bg-gradient-to-r from-emerald-500/20 via-emerald-500/30 to-emerald-500/20 border-y border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                : 'bg-[#1b1f2b] border-y border-[#343a4e]'
            }`}
            style={{
              left: `${leftPercent}%`,
              width: `${widthPercent}%`,
            }}
          >
            {/* Audio Waveform / Segment texture representation */}
            <div className="w-full h-full flex items-center justify-around px-2 opacity-50 pointer-events-none">
              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-0.5 rounded-full ${isTrimmed ? 'bg-emerald-400' : 'bg-[#50576e]'}`}
                  style={{
                    height: `${25 + Math.sin(i * 0.8) * 45 + ((i % 3) * 15)}%`,
                  }}
                />
              ))}
            </div>

            {/* Left Trim Handle */}
            <div
              onMouseDown={(e) => handleMouseDown('start', e)}
              className="absolute left-0 top-0 bottom-0 w-2.5 bg-emerald-500 hover:bg-emerald-400 cursor-ew-resize flex items-center justify-center transition-colors z-20 group"
              title={`Trim Start: ${formatTime(trimStart)} (Drag to adjust)`}
            >
              <div className="w-0.5 h-4 bg-black/60 rounded-full" />
            </div>

            {/* Right Trim Handle */}
            <div
              onMouseDown={(e) => handleMouseDown('end', e)}
              className="absolute right-0 top-0 bottom-0 w-2.5 bg-emerald-500 hover:bg-emerald-400 cursor-ew-resize flex items-center justify-center transition-colors z-20 group"
              title={`Trim End: ${formatTime(trimEnd)} (Drag to adjust)`}
            >
              <div className="w-0.5 h-4 bg-black/60 rounded-full" />
            </div>
          </div>

          {/* Right Trimmed (Muted) */}
          {trimEnd < duration && (
            <div
              className="absolute top-0 bottom-0 right-0 bg-[#0c0d12]/80 backdrop-grayscale pointer-events-none border-l border-[#2d3142]"
              style={{ width: `${100 - ((trimEnd / duration) * 100)}%` }}
            >
              <div className="w-full h-full opacity-20 bg-[repeating-linear-gradient(45deg,#000,#000_5px,#333_5px,#333_10px)]" />
            </div>
          )}

          {/* Playhead Needle Scrubber */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none z-30"
            style={{ left: `${playheadPercent}%` }}
          >
            <div className="relative -ml-[1px] w-[2px] h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]">
              {/* Top needle head */}
              <div
                onMouseDown={(e) => handleMouseDown('playhead', e)}
                className="absolute -top-1 -translate-x-[4px] w-2.5 h-3 bg-white rounded-t-sm pointer-events-auto cursor-grab active:cursor-grabbing flex items-center justify-center shadow"
              >
                <div className="w-0.5 h-1.5 bg-black" />
              </div>
            </div>
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
