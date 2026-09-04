'use client';

import React, { useEffect } from 'react';
import { useCreatorFlowStore } from '@/store/creatorFlowStore';
import { TopNav } from '@/components/layout/TopNav';
import { LandingPage } from '@/components/landing/LandingPage';
import { ContentWorkspace } from '@/components/content/ContentWorkspace';
import { CreateWorkspace } from '@/components/create/CreateWorkspace';
import { PublishWorkspace } from '@/components/publish/PublishWorkspace';
import { initWebMCP } from '@/lib/webmcp';

export default function Home() {
  const currentArea = useCreatorFlowStore((s) => s.currentArea);

  useEffect(() => {
    initWebMCP();
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#070709] text-[#f3f4f6]">
      {/* Persistent Top Navigation Bar across the entire application */}
      <TopNav />

      {/* Main Area View Switcher */}
      <div className="flex-1 min-h-0 relative overflow-hidden">
        {currentArea === 'overview' && <LandingPage />}
        {currentArea === 'content' && <ContentWorkspace />}
        {currentArea === 'workspace' && <CreateWorkspace />}
        {currentArea === 'publish' && <PublishWorkspace />}
      </div>
    </div>
  );
}
