'use client';

import React from 'react';
import { TranscriptPanel } from './TranscriptPanel';
import { VideoPreview } from './VideoPreview';
import { Timeline } from './Timeline';
import { DirectorPanel } from '@/components/director/DirectorPanel';

export const CreateWorkspace: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden bg-[#090a0d]">
      {/* Top 3-column split: Transcript (Left), Video Preview (Center), Director (Right) */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left: Transcript */}
        <TranscriptPanel />

        {/* Center: Video preview */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <VideoPreview />
        </main>

        {/* Right: Director */}
        <DirectorPanel />
      </div>

      {/* Bottom: Timeline */}
      <Timeline />
    </div>
  );
};
