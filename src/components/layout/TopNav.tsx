'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCreatorFlowStore } from '@/store/creatorFlowStore';
import { creatorFlowOperations } from '@/domain/operations';
import { WorkspaceArea } from '@/types';
import { CreatorFlowLogo } from '@/components/brand/CreatorFlowLogo';
import { ChatGPTAuthModal } from '@/components/auth/ChatGPTAuthModal';
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
  FileSearch,
  Sparkles,
  Clock,
  Users
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
  const canUndo = useCreatorFlowStore((s) => s.history.past.length > 0);
  const canRedo = useCreatorFlowStore((s) => s.history.future.length > 0);
  const chatGPTAuth = useCreatorFlowStore((s) => s.chatGPTAuth);
  const collaboration = useCreatorFlowStore((s) => s.collaboration);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live session collaboration timer
  useEffect(() => {
    const timer = setInterval(() => {
      useCreatorFlowStore.getState().incrementSessionTimer();
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
      const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(file.name);
      if (!isVideo) {
        alert('Please select a valid video file (MP4, WebM, MOV, MKV).');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      uploadLocalVideo(file);
      setCurrentArea('workspace');
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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

      {/* Right: Live Session Presence, ChatGPT Auth & Director Toggle */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Real-Time Live Session Clock */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0e1018] border border-[#212534] text-xs font-mono text-[#9ca3b8]" title="Live session duration & active topic">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <Clock className="w-3 h-3 text-[#7b8398]" />
          <span>{formatTimer(collaboration.sessionElapsedSeconds)}</span>
          <span className="text-[#41485c]">•</span>
          <span className="text-emerald-400/90 text-[11px] font-sans font-medium max-w-[120px] truncate">
            {collaboration.activeTopic}
          </span>
        </div>

        {/* Live Collaborators Presence Stack */}
        <div className="hidden lg:flex items-center -space-x-1.5 pl-1" title="Active Real-Time Collaborators">
          {collaboration.collaborators.map((c) => (
            <div
              key={c.id}
              className="relative group cursor-pointer"
              title={`${c.name} (${c.role})`}
            >
              <div 
                className="w-6 h-6 rounded-full border-2 border-black flex items-center justify-center text-[10px] font-bold text-white shadow-sm overflow-hidden"
                style={{ backgroundColor: c.color }}
              >
                {c.isAi ? (
                  <Sparkles className="w-3 h-3" />
                ) : (
                  c.name.charAt(0)
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-emerald-400 border border-black" />
            </div>
          ))}
        </div>

        {/* ChatGPT Authentication & Model Status Badge */}
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
            chatGPTAuth.isAuthenticated
              ? 'bg-[#0f171d] hover:bg-[#15212a] border-emerald-800/50 text-[#c9d3e3]'
              : 'bg-[#141620] hover:bg-[#1c1f2e] border-[#292e40] text-[#8c94a8]'
          }`}
          title="ChatGPT Authentication & Model Settings"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${
            chatGPTAuth.isAuthenticated ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
          }`} />
          <span className="hidden md:inline font-semibold">ChatGPT</span>
          <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-black/40 text-emerald-400 border border-emerald-900/40">
            {chatGPTAuth.model}
          </span>
        </button>

        {/* Director Toggle */}
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

      {/* ChatGPT Authentication Modal */}
      <ChatGPTAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
};
