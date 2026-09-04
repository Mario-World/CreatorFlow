'use client';

import React from 'react';
import { useCreatorFlowStore } from '@/store/creatorFlowStore';
import { WorkspaceArea } from '@/types';
import { CreatorFlowLogo } from '@/components/brand/CreatorFlowLogo';
import { Bot } from 'lucide-react';

export const TopNav: React.FC = () => {
  const currentArea = useCreatorFlowStore((s) => s.currentArea);
  const setCurrentArea = useCreatorFlowStore((s) => s.setCurrentArea);
  const directorOpen = useCreatorFlowStore((s) => s.directorOpen);
  const toggleDirector = useCreatorFlowStore((s) => s.toggleDirector);

  const navTabs: { id: WorkspaceArea; label: string }[] = [
    { id: 'content', label: 'Content' },
    { id: 'workspace', label: 'Workspace' },
    { id: 'publish', label: 'Publish' },
  ];

  return (
    <header className="h-16 border-b border-[#1c1f2b] bg-[#070709] px-5 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Left: Brand Logo (CreatorFlow Landing Page) */}
      <button 
        type="button"
        onClick={() => setCurrentArea('overview')}
        className={`cursor-pointer group shrink-0 flex items-center gap-3 px-3 py-1.5 rounded-xl border transition-all ${
          currentArea === 'overview'
            ? 'bg-[#141824] border-[#2b354f] text-white shadow-sm'
            : 'border-transparent hover:bg-[#11131c] hover:border-[#1e2230]'
        }`}
        title="CreatorFlow Landing Page"
      >
        <CreatorFlowLogo size="md" />
        {currentArea === 'overview' && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-[#1e273d] text-[#60a5fa] border border-[#2b4478] hidden sm:inline-block">
            Overview
          </span>
        )}
      </button>

      {/* Center: Just 3 Tabs (Content / Workspace / Publish) */}
      <nav className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0e1017] border border-[#1b1e2a]">
        {navTabs.map((tab) => {
          const isActive = currentArea === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCurrentArea(tab.id)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#181d2a] text-white border border-[#2b3348]'
                  : 'text-[#8b92a5] hover:text-[#e2e6f0] hover:bg-[#12141c]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Right: Director Toggle */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => toggleDirector()}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-medium border transition-all ${
            directorOpen
              ? 'bg-white text-black border-white'
              : 'bg-[#12141c] text-[#c9ceda] border-[#252936] hover:bg-[#1a1c27]'
          }`}
          title="Toggle Director Panel"
        >
          <Bot className="w-4 h-4" />
          <span>Director</span>
          <span
            className={`w-2 h-2 rounded-full ${
              directorOpen ? 'bg-black' : 'bg-emerald-400'
            }`}
          />
        </button>
      </div>
    </header>
  );
};
