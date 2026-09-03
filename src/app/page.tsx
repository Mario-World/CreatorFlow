'use client';

import React, { useEffect } from 'react';
import { useCreatorFlowStore } from '@/store/creatorFlowStore';
import { TopNav } from '@/components/layout/TopNav';
import { CreateWorkspace } from '@/components/create/CreateWorkspace';
import { PublishWorkspace } from '@/components/publish/PublishWorkspace';
import { ResearchWorkspace } from '@/components/research/ResearchWorkspace';
import { LandingPage } from '@/components/landing/LandingPage';
import { initWebMCP } from '@/lib/webmcp';

export default function Home() {
  const currentArea = useCreatorFlowStore((s) => s.currentArea);

  useEffect(() => {
    initWebMCP();
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-black text-[#f3f4f6]">
      {/* Persistent Top Navigation Bar across the entire application */}
      <TopNav />

      {/* Main Workspace View Switcher: Navigates cleanly within navbar */}
      <div className="flex-1 min-h-0 relative overflow-hidden">
        {currentArea === 'overview' && <LandingPage />}
        {currentArea === 'workspace' && <CreateWorkspace />}
        {currentArea === 'publish' && <PublishWorkspace />}
        {currentArea === 'research' && <ResearchWorkspace />}
      </div>
    </div>
  );
}
