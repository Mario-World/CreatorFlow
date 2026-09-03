'use client';

import React, { useEffect } from 'react';
import { useCreatorFlowStore } from '@/store/creatorFlowStore';
import { TopNav } from '@/components/layout/TopNav';
import { CreateWorkspace } from '@/components/create/CreateWorkspace';
import { PublishWorkspace } from '@/components/publish/PublishWorkspace';
import { ResearchWorkspace } from '@/components/research/ResearchWorkspace';
import { initWebMCP } from '@/lib/webmcp';

export default function Home() {
  const currentArea = useCreatorFlowStore((s) => s.currentArea);

  useEffect(() => {
    initWebMCP();
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#090a0d] text-[#ededed]">
      {/* Top Navigation */}
      <TopNav />

      {/* Main Workspace Area Switcher */}
      <div className="flex-1 min-h-0 relative">
        {currentArea === 'create' && <CreateWorkspace />}
        {currentArea === 'publish' && <PublishWorkspace />}
        {currentArea === 'research' && <ResearchWorkspace />}
      </div>
    </div>
  );
}
