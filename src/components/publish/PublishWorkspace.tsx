'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCreatorFlowStore } from '@/store/creatorFlowStore';
import { creatorFlowOperations } from '@/domain/operations';
import { PlatformId } from '@/types';
import { 
  Check, 
  Copy, 
  Film, 
  Play, 
  Pause, 
  Share2, 
  BookOpen
} from 'lucide-react';

// Platform Brand SVGs
const YoutubeIcon = ({ className = "w-4 h-4 text-red-400" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const InstagramIcon = ({ className = "w-4 h-4 text-pink-400" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4 text-blue-400" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const XIcon = ({ className = "w-4 h-4 text-sky-400" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export const PublishWorkspace: React.FC = () => {
  const currentPlatform = useCreatorFlowStore((s) => s.currentPlatform);
  const publishing = useCreatorFlowStore((s) => s.publishing);
  const project = useCreatorFlowStore((s) => s.project);
  const trimStart = useCreatorFlowStore((s) => s.timeline.trimStart);
  const trimEnd = useCreatorFlowStore((s) => s.timeline.trimEnd);
  const aspectRatio = useCreatorFlowStore((s) => s.aspectRatio);
  const captions = useCreatorFlowStore((s) => s.captions);
  const localVideoUrl = useCreatorFlowStore((s) => s.localVideoUrl);
  const isLocalVideo = useCreatorFlowStore((s) => s.isLocalVideo);
  const preparePlatformOutput = useCreatorFlowStore((s) => s.preparePlatformOutput);

  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const platformList: { id: PlatformId; label: string; icon: React.ReactNode }[] = [
    { id: 'youtube', label: 'YouTube', icon: <YoutubeIcon className="w-4 h-4" /> },
    { id: 'instagram', label: 'Instagram', icon: <InstagramIcon className="w-4 h-4" /> },
    { id: 'linkedin', label: 'LinkedIn', icon: <LinkedinIcon className="w-4 h-4" /> },
    { id: 'x', label: 'X', icon: <XIcon className="w-4 h-4" /> },
    { id: 'medium', label: 'Medium', icon: <BookOpen className="w-4 h-4 text-emerald-400" /> },
  ];

  const currentData = publishing[currentPlatform];
  const trimDuration = Math.round(trimEnd - trimStart);

  // Sync video loop strictly to active cut from Workspace
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = trimStart;

    const handleTimeUpdate = () => {
      if (video.currentTime >= trimEnd) {
        video.currentTime = trimStart;
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [trimStart, trimEnd]);

  const toggleVideoPlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleFieldChange = (field: 'title' | 'caption', value: string) => {
    preparePlatformOutput(currentPlatform, { [field]: value });
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-y-auto bg-[#070709] p-6 text-[#e2e5eb] select-none">
      <div className="max-w-4xl mx-auto w-full space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1a1d28]">
          <div className="space-y-0.5">
            <h1 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#8a91a2]" />
              <span>Publish & Export</span>
            </h1>
            <p className="text-xs text-[#787f91]">
              Platform-ready content shaped from your workspace cut.
            </p>
          </div>
        </div>

        {/* Platform Tabs (YouTube / Instagram / LinkedIn / X / Medium) */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0c0d12] border border-[#1a1d28] overflow-x-auto">
          {platformList.map((p) => {
            const isActive = currentPlatform === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => creatorFlowOperations.setCurrentPlatform(p.id)}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#181d2a] border border-[#2c354c] text-white shadow-xs'
                    : 'text-[#71788a] hover:text-[#c4cad8] hover:bg-[#11131c]'
                }`}
              >
                {p.icon}
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Grid: Preview Card + Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: One Preview Card (Aspect Ratio + Duration) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="p-4 rounded-xl bg-[#0b0c11] border border-[#1a1d28] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[#71788a] uppercase tracking-wider text-[10px]">
                  Cut Preview
                </span>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-[#141722] text-[#8e96aa] border border-[#222738]">
                    {aspectRatio}
                  </span>
                  <span className="text-emerald-400">
                    {trimDuration}s
                  </span>
                </div>
              </div>

              {/* Video / Visual Box */}
              <div 
                onClick={toggleVideoPlayback}
                className="relative rounded-lg overflow-hidden bg-black border border-[#1d202e] flex items-center justify-center aspect-video cursor-pointer group"
              >
                {isLocalVideo && localVideoUrl ? (
                  <video
                    ref={videoRef}
                    src={localVideoUrl}
                    playsInline
                    muted
                    loop
                    className="w-full h-full object-contain pointer-events-none"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#0d0e14] text-[#6b7182] p-4 text-center space-y-2">
                    <Film className="w-8 h-8 text-[#42485a]" />
                    <span className="text-xs font-medium text-[#8e95aa]">{project.title}</span>
                  </div>
                )}

                {/* Subtitle / Caption Overlay */}
                {captions.enabled && (
                  <div className="absolute bottom-3 left-3 right-3 text-center pointer-events-none">
                    <span className="inline-block px-2.5 py-1 rounded bg-black/80 text-white text-[11px] font-medium tracking-tight">
                      {captions.currentText || currentData.title}
                    </span>
                  </div>
                )}

                {/* Play / Pause indicator overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-9 h-9 rounded-full bg-white/90 text-black flex items-center justify-center shadow-lg">
                    {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
                  </div>
                </div>
              </div>

              {/* Metadata strip */}
              <div className="flex items-center justify-between text-[11px] text-[#71788a] font-mono pt-1">
                <span>Cut: {formatTime(trimStart)} → {formatTime(trimEnd)}</span>
                <span>Captions: {captions.enabled ? 'On' : 'Off'}</span>
              </div>
            </div>
          </div>

          {/* Right: Title, Caption & Copy Button */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-xl bg-[#0b0c11] border border-[#1a1d28] space-y-4">
              {/* Title Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium uppercase tracking-wider text-[#7e8598]">
                    Title
                  </label>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(currentData.title, 'title')}
                    className="flex items-center gap-1 text-[11px] text-[#71788a] hover:text-white transition-colors"
                  >
                    {copiedKey === 'title' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Title</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="text"
                  value={currentData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full rounded-lg bg-[#0e1017] border border-[#1f2332] px-3.5 py-2 text-xs text-white placeholder-[#505668] focus:outline-none focus:border-sky-500 font-medium"
                />
              </div>

              {/* Caption Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium uppercase tracking-wider text-[#7e8598]">
                    Caption
                  </label>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(currentData.caption, 'caption')}
                    className="flex items-center gap-1 text-[11px] text-[#71788a] hover:text-white transition-colors"
                  >
                    {copiedKey === 'caption' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Caption</span>
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  rows={8}
                  value={currentData.caption}
                  onChange={(e) => handleFieldChange('caption', e.target.value)}
                  className="w-full resize-none rounded-lg bg-[#0e1017] border border-[#1f2332] p-3.5 text-xs text-white placeholder-[#505668] focus:outline-none focus:border-sky-500 leading-relaxed font-sans"
                />
              </div>

              {/* Primary Copy Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const fullCopy = currentData.title 
                      ? `${currentData.title}\n\n${currentData.caption}`
                      : currentData.caption;
                    copyToClipboard(fullCopy, 'all');
                  }}
                  className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  {copiedKey === 'all' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy All ({platformList.find(p => p.id === currentPlatform)?.label})</span>
                    </>
                  )}
                </button>
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
