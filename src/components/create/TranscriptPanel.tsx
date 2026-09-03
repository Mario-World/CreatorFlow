'use client';

import React from 'react';
import { useCreatorFlowStore } from '@/store/creatorFlowStore';
import { creatorFlowOperations } from '@/domain/operations';
import { FileText, Play, Scissors, Clock } from 'lucide-react';

export const TranscriptPanel: React.FC = () => {
  const transcript = useCreatorFlowStore((s) => s.transcript);
  const selectedSegmentId = useCreatorFlowStore((s) => s.selectedSegment);
  const currentTime = useCreatorFlowStore((s) => s.timeline.currentTime);
  const trimStart = useCreatorFlowStore((s) => s.timeline.trimStart);
  const trimEnd = useCreatorFlowStore((s) => s.timeline.trimEnd);

  const handleSegmentClick = (segmentId: string) => {
    creatorFlowOperations.selectTranscriptSegment(segmentId);
  };

  const handleTrimToSegment = (e: React.MouseEvent, start: number, end: number, text: string) => {
    e.stopPropagation();
    creatorFlowOperations.applyEdit({
      name: `Clip: "${text.slice(0, 24)}..."`,
      start,
      end,
      description: `Segment trim from ${formatTime(start)} to ${formatTime(end)}`,
    });
  };

  return (
    <aside className="w-80 lg:w-92 border-r border-[#1f222b] bg-[#0d0e13] flex flex-col h-full shrink-0 select-none">
      {/* Header */}
      <div className="p-3.5 border-b border-[#1f222b] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#8b91a0]" />
          <h2 className="text-xs font-semibold text-white tracking-wide uppercase">
            Transcript
          </h2>
          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#181a22] text-[#8b91a0]">
            {transcript.length} cues
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[#6c7282] font-mono">
          <Clock className="w-3 h-3" />
          <span>01:32</span>
        </div>
      </div>

      {/* Segments List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {transcript.map((seg) => {
          const isSelected = selectedSegmentId === seg.id;
          const isPlayheadInside = currentTime >= seg.start && currentTime < seg.end;
          const isInTrimRange = seg.start >= trimStart && seg.end <= trimEnd;

          return (
            <div
              key={seg.id}
              onClick={() => handleSegmentClick(seg.id)}
              className={`group relative p-3 rounded-lg border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#1a1d27] border-[#3e4458] shadow-sm text-white'
                  : isInTrimRange
                  ? 'bg-[#12141a] border-[#222633] text-[#cfd4e0] hover:border-[#2f3546] hover:bg-[#161822]'
                  : 'bg-[#0f1015] border-[#1a1c24] text-[#808696] hover:border-[#262936]'
              }`}
            >
              {/* Top segment bar with timestamp and controls */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-mono font-medium px-1.5 py-0.5 rounded ${
                      isSelected
                        ? 'bg-[#292f42] text-white'
                        : isPlayheadInside
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                        : 'bg-[#181a22] text-[#858c9c]'
                    }`}
                  >
                    {seg.startFormatted}
                  </span>
                  <span className="text-[10px] text-[#555a68] font-mono">
                    → {seg.endFormatted}
                  </span>
                </div>

                {/* Quick actions visible on hover / active */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      creatorFlowOperations.setCurrentTime(seg.start);
                    }}
                    title="Play from here"
                    className="p-1 rounded bg-[#202430] hover:bg-[#2b3040] text-[#a0a6b6] hover:text-white"
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                  </button>
                  <button
                    onClick={(e) => handleTrimToSegment(e, seg.start, seg.end, seg.text)}
                    title="Trim timeline to this segment"
                    className="p-1 rounded bg-[#202430] hover:bg-[#2b3040] text-[#a0a6b6] hover:text-white"
                  >
                    <Scissors className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>

              {/* Segment verbatim text */}
              <p
                className={`text-xs leading-relaxed ${
                  isSelected ? 'text-white font-medium' : 'text-[#c2c7d4]'
                }`}
              >
                &ldquo;{seg.text}&rdquo;
              </p>

              {/* Active segment indicators */}
              <div className="mt-2 flex items-center justify-between text-[10px]">
                {isPlayheadInside ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Now playing
                  </span>
                ) : isSelected ? (
                  <span className="text-[#969cb0] font-mono">Selected segment</span>
                ) : (
                  <span />
                )}

                {isInTrimRange && (
                  <span className="text-[#646a7c] font-mono">In cut plan</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
