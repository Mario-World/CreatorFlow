'use client';

import React, { useEffect, useRef } from 'react';
import { useCreatorFlowStore } from '@/store/creatorFlowStore';
import { creatorFlowOperations } from '@/domain/operations';
import { WorkspaceArea } from '@/types';
import { CreatorFlowLogo } from '@/components/brand/CreatorFlowLogo';
import { 
  Undo2, 
  Redo2, 
  Bot, 
  Video, 
  Film, 
  Share2,
  Upload,
  RotateCcw,
  Layout,
  ArrowRight,
  FileSearch
} from 'lucide-react';

export const TopNav: React.FC = () => {
  const currentArea = useCreatorFlowStore((s) => s.currentArea);
  const setCurrentArea = useCreatorFlowStore((s) => s.setCurrentArea);
  const directorOpen = useCreatorFlowStore((s) => s.directorOpen);
  const toggleDirector = useCreatorFlowStore((s) => s.toggleDirector);
  const project = useCreatorFlowStore((s) => s.project);
  const isLocalVideo = useCreatorFlowStore((s) => s.isLocalVideo);
  const uploadLocalVideo = useCreatorFlowStore((s) => s.uploadLocalVideo);
  const resetToSampleVideo = useCreatorFlowStore((s) => s.resetToSampleVideo);
  const canUndo = useCreatorFlowStore((s) => s.canUndo());
  const canRedo = useCreatorFlowStore((s) => s.canRedo());

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcuts for Undo (Ctrl+Z) and Redo (Ctrl+Y or Ctrl+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (useCreatorFlowStore.getState().currentArea !== 'workspace') return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          creatorFlowOperations.redo();
        } else {
          e.preventDefault();
          creatorFlowOperations.undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        creatorFlowOperations.redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'video/mp4' && !file.name.toLowerCase().endsWith('.mp4')) {
        alert('CreatorFlow only accepts MP4 video files (.mp4). Please upload a valid MP4 video.');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      uploadLocalVideo(file);
      setCurrentArea('workspace');
    }
  };

  // Primary Navigation: Overview | Workspace | Publish | Research (deliberately after publish)
  const navItems: { id: WorkspaceArea; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Layout className="w-4 h-4" /> },
    { id: 'workspace', label: 'Workspace', icon: <Film className="w-4 h-4" /> },
    { id: 'publish', label: 'Publish', icon: <Share2 className="w-4 h-4" /> },
    { id: 'research', label: 'Research', icon: <FileSearch className="w-4 h-4" /> },
  ];

  return (
    <header className="h-14 border-b border-[#1c1f2b] bg-black px-4 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Hidden native file input strictly for MP4 video uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="video/mp4,.mp4"
        className="hidden"
      />

      {/* Left: Brand Logo & Workspace Controls */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* CreatorFlow Brand Logo */}
        <div 
          onClick={() => setCurrentArea('overview')}
          className="cursor-pointer group shrink-0"
          title="CreatorFlow Overview"
        >
          <div className="hidden sm:block">
            <CreatorFlowLogo size="md" />
          </div>
          <div className="block sm:hidden">
            <CreatorFlowLogo size="sm" />
          </div>
        </div>

        {/* In Workspace: Show active video badge, upload video, and labeled Undo/Redo */}
        {currentArea === 'workspace' && (
          <>
            {/* Loaded Video Badge - hidden on tablet/mobile to prevent clutter */}
            <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#0f1118] border border-[#222634] text-xs">
              <Video className="w-3.5 h-3.5 text-[#969cb0]" />
              <span className="text-[#e2e5eb] font-medium truncate max-w-[140px]">
                {project.title}
              </span>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#171922] text-[#969cb0]">
                {project.durationFormatted}
              </span>

              {isLocalVideo ? (
                <button
                  onClick={() => resetToSampleVideo()}
                  className="text-[10px] text-sky-400 hover:text-sky-300 ml-1 flex items-center gap-1 font-medium"
                  title="Reset to default footage"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Reset</span>
                </button>
              ) : (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 px-1 py-0.5 rounded">
                  1080p
                </span>
              )}
            </div>

            {/* Upload Local Video Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#12141c] hover:bg-[#1a1d28] border border-[#252938] text-xs font-medium text-[#c4cad8] hover:text-white transition-all"
              title="Upload your MP4 video (.mp4)"
            >
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              <span>Upload Video</span>
            </button>

            {/* Labeled Undo & Redo Controls (Responsive icon on mobile, labeled on desktop) */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => creatorFlowOperations.undo()}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  canUndo
                    ? 'text-[#d3d8e5] hover:text-white bg-[#141620] hover:bg-[#1f2230] border border-[#272b3c]'
                    : 'text-[#474c5c] bg-[#0c0d12] border border-[#181a24] cursor-not-allowed'
                }`}
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Undo</span>
              </button>
              <button
                onClick={() => creatorFlowOperations.redo()}
                disabled={!canRedo}
                title="Redo (Ctrl+Y)"
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  canRedo
                    ? 'text-[#d3d8e5] hover:text-white bg-[#141620] hover:bg-[#1f2230] border border-[#272b3c]'
                    : 'text-[#474c5c] bg-[#0c0d12] border border-[#181a24] cursor-not-allowed'
                }`}
              >
                <Redo2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Redo</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Center: Primary Area Navigation (Responsive icon-only on small mobile, labeled on sm+) */}
      <nav className="flex items-center bg-[#0d0e14] p-0.5 rounded-lg border border-[#20232f] mx-1">
        {navItems.map((item) => {
          const isActive = currentArea === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentArea(item.id)}
              title={item.label}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#1e2230] text-white shadow-sm'
                  : 'text-[#7e8596] hover:text-[#c4cad8] hover:bg-[#13151d]'
              }`}
            >
              {item.icon}
              <span className="hidden md:inline">{item.label}</span>
              {item.id === 'workspace' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Right: Workspace Director Toggle in Chat Corner */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={() => toggleDirector()}
          className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
            directorOpen
              ? 'bg-white text-black border-white shadow-sm'
              : 'bg-[#12141c] text-[#c9ceda] border-[#252936] hover:bg-[#1a1c27]'
          }`}
          title="Toggle Director Agent"
        >
          <Bot className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Director</span>
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
