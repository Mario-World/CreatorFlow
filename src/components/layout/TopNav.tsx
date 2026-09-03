'use client';

import React, { useEffect } from 'react';
import { useCreatorFlowStore } from '@/store/creatorFlowStore';
import { creatorFlowOperations } from '@/domain/operations';
import { WorkspaceArea } from '@/types';
import { 
  Undo2, 
  Redo2, 
  Bot, 
  Video, 
  Sparkles, 
  CheckCircle2, 
  FileSearch, 
  Film, 
  Share2 
} from 'lucide-react';

export const TopNav: React.FC = () => {
  const currentArea = useCreatorFlowStore((s) => s.currentArea);
  const setCurrentArea = useCreatorFlowStore((s) => s.setCurrentArea);
  const directorOpen = useCreatorFlowStore((s) => s.directorOpen);
  const toggleDirector = useCreatorFlowStore((s) => s.toggleDirector);
  const project = useCreatorFlowStore((s) => s.project);
  const canUndo = useCreatorFlowStore((s) => s.canUndo());
  const canRedo = useCreatorFlowStore((s) => s.canRedo());
  const agentActivity = useCreatorFlowStore((s) => s.agentActivity);

  const lastActivity = agentActivity[0];

  // Global keyboard shortcuts for Undo (Ctrl+Z) and Redo (Ctrl+Y or Ctrl+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          creatorFlowOperations.redo();
        } else {
          e.preventDefault();
          creatorFlowOperations.undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        creatorFlowOperations.redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems: { id: WorkspaceArea; label: string; icon: React.ReactNode }[] = [
    { id: 'research', label: 'Research', icon: <FileSearch className="w-3.5 h-3.5" /> },
    { id: 'create', label: 'Create', icon: <Film className="w-3.5 h-3.5" /> },
    { id: 'publish', label: 'Publish', icon: <Share2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="h-14 border-b border-[#1f222b] bg-[#0c0d11] px-4 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Left: Branding & Project info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-white text-black font-semibold flex items-center justify-center text-xs tracking-wider shadow-sm">
            CF
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white tracking-tight leading-none">
              CreatorFlow
            </span>
            <span className="text-[10px] text-[#717684] font-mono leading-tight mt-0.5">
              agent-native
            </span>
          </div>
        </div>

        <div className="h-4 w-px bg-[#1f222b] hidden sm:block" />

        {/* Loaded Demo Project Badge */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-[#13151b] border border-[#21242e] text-xs">
          <Video className="w-3 h-3 text-[#9ba1b0]" />
          <span className="text-[#e2e5eb] font-medium truncate max-w-[160px]">
            {project.title}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1c1f28] text-[#9ba1b0]">
            {project.durationFormatted}
          </span>
        </div>

        {/* Undo / Redo controls */}
        <div className="flex items-center gap-1 border-l border-[#1f222b] pl-3">
          <button
            onClick={() => creatorFlowOperations.undo()}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className={`p-1.5 rounded transition-colors ${
              canUndo
                ? 'text-[#c0c5d0] hover:text-white hover:bg-[#1a1c24]'
                : 'text-[#444855] cursor-not-allowed'
            }`}
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => creatorFlowOperations.redo()}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className={`p-1.5 rounded transition-colors ${
              canRedo
                ? 'text-[#c0c5d0] hover:text-white hover:bg-[#1a1c24]'
                : 'text-[#444855] cursor-not-allowed'
            }`}
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center: Primary Area Navigation (Research | Create | Publish) */}
      <nav className="flex items-center bg-[#13151b] p-0.5 rounded-lg border border-[#20232c]">
        {navItems.map((item) => {
          const isActive = currentArea === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentArea(item.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#222632] text-white shadow-sm'
                  : 'text-[#858b99] hover:text-[#c4c9d5] hover:bg-[#181a21]'
              }`}
            >
              {item.icon}
              {item.label}
              {item.id === 'create' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 ml-0.5" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Right: Director Toggle & Agent status */}
      <div className="flex items-center gap-3">
        {lastActivity && (
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-[#787f90] max-w-[200px] truncate">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">{lastActivity.action}</span>
          </div>
        )}

        <button
          onClick={() => toggleDirector()}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
            directorOpen
              ? 'bg-white text-black border-white shadow-sm'
              : 'bg-[#151720] text-[#c9ceda] border-[#252936] hover:bg-[#1d202b]'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Director</span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              directorOpen ? 'bg-black' : 'bg-emerald-400 animate-pulse'
            }`}
          />
        </button>
      </div>
    </header>
  );
};
