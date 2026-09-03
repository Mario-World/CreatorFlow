'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCreatorFlowStore } from '@/store/creatorFlowStore';
import { creatorFlowOperations } from '@/domain/operations';
import { PlatformId } from '@/types';
import { 
  BookOpen, 
  Check, 
  Copy, 
  Film, 
  Sparkles,
  Layers, 
  Play, 
  Pause, 
  CheckCircle2, 
  Wand2, 
  Send, 
  Share2, 
  Image as ImageIcon,
  FileText,
  AlignLeft,
  Video,
  Monitor,
  Smartphone,
  Square,
  CheckSquare,
  SquareDashedBottom,
  FileSearch
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

type MediaMode = 'video_text' | 'video_only' | 'text_only' | 'article';

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
  const setCurrentArea = useCreatorFlowStore((s) => s.setCurrentArea);

  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [correctionApplied, setCorrectionApplied] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Platform selection toggles (which platforms to include in final polish & publish)
  const [selectedPlatforms, setSelectedPlatforms] = useState<Record<PlatformId, boolean>>({
    youtube: true,
    instagram: true,
    linkedin: true,
    x: true,
    medium: true,
  });

  // Media modes per platform (allows toggling video + text vs video only vs text only vs article)
  const [platformMediaModes, setPlatformMediaModes] = useState<Record<PlatformId, MediaMode>>({
    youtube: 'video_text', // Video + Thumbnail + Headline
    instagram: 'video_only', // Reels: Just Video
    x: 'text_only', // X: Text / Thread (or Video + Text)
    linkedin: 'text_only', // LinkedIn: Text Post (or Video + Text)
    medium: 'article', // Medium: Article story
  });

  const videoRef = useRef<HTMLVideoElement>(null);

  const platformList: { id: PlatformId; label: string; icon: React.ReactNode }[] = [
    { id: 'youtube', label: 'YouTube', icon: <YoutubeIcon className="w-4 h-4 text-red-400" /> },
    { id: 'instagram', label: 'Instagram', icon: <InstagramIcon className="w-4 h-4 text-pink-400" /> },
    { id: 'linkedin', label: 'LinkedIn', icon: <LinkedinIcon className="w-4 h-4 text-blue-400" /> },
    { id: 'x', label: 'X (Twitter)', icon: <XIcon className="w-4 h-4 text-sky-400" /> },
    { id: 'medium', label: 'Medium', icon: <BookOpen className="w-4 h-4 text-emerald-400" /> },
  ];

  const currentData = publishing[currentPlatform];
  const trimDuration = Math.round(trimEnd - trimStart);
  const currentMode = platformMediaModes[currentPlatform];

  // Sync video loop strictly to active cut from Workspace
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = trimStart;
  }, [trimStart, currentPlatform]);

  const handleVideoTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.currentTime >= trimEnd) {
      video.currentTime = trimStart;
      if (!isPlaying) video.pause();
    }
  };

  const toggleVideoPlayback = () => {
    const video = videoRef.current;
    if (!video) {
      setIsPlaying(!isPlaying);
      return;
    }

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      if (video.currentTime >= trimEnd || video.currentTime < trimStart) {
        video.currentTime = trimStart;
      }
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFieldChange = (field: 'title' | 'caption' | 'description', value: string) => {
    creatorFlowOperations.preparePlatformOutput(currentPlatform, {
      [field]: value,
    });
  };

  const togglePlatformSelection = (p: PlatformId) => {
    setSelectedPlatforms((prev) => ({
      ...prev,
      [p]: !prev[p],
    }));
  };

  const setMediaMode = (mode: MediaMode) => {
    setPlatformMediaModes((prev) => ({
      ...prev,
      [currentPlatform]: mode,
    }));
  };

  // Run AI Content Correction on active platform
  const handleRunContentCorrection = () => {
    setIsCorrecting(true);

    setTimeout(() => {
      let polishedTitle = currentData.title;
      let polishedCaption = currentData.caption;
      let polishedHashtags = [...currentData.hashtags];

      if (currentPlatform === 'linkedin') {
        polishedTitle = `The Shift from Human Interfaces to Agent-Native Tools`;
        polishedCaption = `Most websites were designed for human eyeballs.\n\nAI agents still have to click blindly through brittle DOMs.\n\nWebMCP changes everything by giving web apps deterministic, agent-operable tools.\n\nHere is how we built an agent-native workspace from scratch in 48 hours. 👇\n\nWhat tools should every SaaS expose to agents first?`;
        polishedHashtags = ['#WebMCP', '#ArtificialIntelligence', '#SoftwareEngineering', '#ProductDesign', '#FutureOfWeb'];
      } else if (currentPlatform === 'instagram') {
        polishedTitle = `Stop Scraping Websites. Start Using WebMCP. 🚀`;
        polishedCaption = `Why are agents still guessing where buttons are?\n\nWebMCP exposes real browser tools straight to external AI agents.\n\n🎬 30s breakdown from our latest build.\n\nSave this for your next AI hackathon! ⚡`;
        polishedHashtags = ['#techcreator', '#webmcp', '#coding', '#ai', '#developerlife', '#buildinpublic'];
      } else if (currentPlatform === 'youtube') {
        polishedTitle = `Building Agent-Native Apps with WebMCP (Full 30s Cut)`;
        polishedCaption = `Watch how CreatorFlow turns manual video editing workflows into structured agent-operable tools with document.modelContext.registerTool.\n\nTimestamps:\n00:00 - The Problem with Human UIs\n00:18 - WebMCP Architecture\n00:48 - Live Agent Execution`;
      } else if (currentPlatform === 'x') {
        polishedTitle = `WebMCP: The End of DOM Scraping for AI`;
        polishedCaption = `Most websites fail AI agents because they force them to guess buttons.\n\nWebMCP gives websites structured tools.\n\nHere is a 30s vertical short cut live with agent operations:`;
        polishedHashtags = ['#WebMCP', '#AI', '#buildinpublic'];
      }

      creatorFlowOperations.preparePlatformOutput(currentPlatform, {
        title: polishedTitle,
        caption: polishedCaption,
        hashtags: polishedHashtags,
      });

      setIsCorrecting(false);
      setCorrectionApplied(true);
      setTimeout(() => setCorrectionApplied(false), 3000);
    }, 450);
  };

  const selectedCount = Object.values(selectedPlatforms).filter(Boolean).length;

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-y-auto bg-black p-6 select-none">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Workspace Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#1c1f2a]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                Publishing Hub
              </span>
              <span className="text-xs text-[#6e7587] font-mono">
                {selectedCount} platform{selectedCount === 1 ? '' : 's'} enabled for publishing
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-normal text-white tracking-tight">
              Publish
            </h1>
            <p className="text-sm text-[#8c92a4] mt-1 max-w-xl">
              Select which platforms to publish to, toggle video vs text mode, run AI content correction, and export your package.
            </p>
          </div>

          {/* Quick Actions Header */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentArea('workspace')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#141620] hover:bg-[#1f2230] border border-[#272b3c] text-xs font-medium text-[#c6cdda] hover:text-white transition-colors"
            >
              <Film className="w-3.5 h-3.5 text-emerald-400" />
              <span>Edit in Workspace</span>
            </button>

            <button
              onClick={() => setIsPublishModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-semibold shadow-md transition-all"
            >
              <Send className="w-3.5 h-3.5 fill-current" />
              <span>Format & Publish ({selectedCount})</span>
            </button>
          </div>
        </div>

        {/* Platform Selection & Enablement Row */}
        <div className="p-3.5 rounded-2xl bg-[#090a10] border border-[#1e2230] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white uppercase tracking-wider text-[11px]">
              Active Channels:
            </span>
            <span className="text-xs text-[#6f7689]">
              (Check/uncheck to choose which platforms receive this release)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {platformList.map((p) => {
              const isChecked = selectedPlatforms[p.id];
              return (
                <button
                  key={p.id}
                  onClick={() => togglePlatformSelection(p.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    isChecked
                      ? 'bg-[#151926] text-white border border-[#2b354e]'
                      : 'bg-[#0c0d13] text-[#5b6173] border border-[#181a24] opacity-60'
                  }`}
                >
                  <span className={`w-3 h-3 rounded flex items-center justify-center text-[10px] ${
                    isChecked ? 'bg-emerald-500 text-black font-bold' : 'border border-[#444a5e]'
                  }`}>
                    {isChecked && '✓'}
                  </span>
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Platform Detail Tabs & Mode Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Platform Tab Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {platformList.map((p) => {
              const isActive = currentPlatform === p.id;
              const isChecked = selectedPlatforms[p.id];
              return (
                <button
                  key={p.id}
                  onClick={() => creatorFlowOperations.setCurrentPlatform(p.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#181b26] text-white border-[#3d455c] shadow-sm'
                      : 'bg-[#0f1118] text-[#7d8496] border-[#1d202c] hover:bg-[#141620] hover:text-[#c4c9d8]'
                  }`}
                >
                  {p.icon}
                  <span>{p.label}</span>
                  {isChecked && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Media Mode Toggle (Video + Text vs Video Only vs Text Only vs Article) */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0d0e14] border border-[#202434] self-start sm:self-auto">
            <span className="text-[11px] font-mono text-[#6e7587] px-2">Format Mode:</span>

            {/* Video + Text Option */}
            <button
              onClick={() => setMediaMode('video_text')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                currentMode === 'video_text'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-[#7e8594] hover:text-white'
              }`}
              title="Publish Video with text caption and headline"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video + Text</span>
            </button>

            {/* Video Only Option (Reels / Shorts) */}
            {(currentPlatform === 'instagram' || currentPlatform === 'youtube') && (
              <button
                onClick={() => setMediaMode('video_only')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  currentMode === 'video_only'
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-[#7e8594] hover:text-white'
                }`}
                title="Publish Reel / Short video only"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Reel Only</span>
              </button>
            )}

            {/* Text Only Option (X / LinkedIn) */}
            {(currentPlatform === 'x' || currentPlatform === 'linkedin') && (
              <button
                onClick={() => setMediaMode('text_only')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  currentMode === 'text_only'
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-[#7e8594] hover:text-white'
                }`}
                title="Publish text / thread breakdown without video"
              >
                <AlignLeft className="w-3.5 h-3.5" />
                <span>Text Only</span>
              </button>
            )}

            {/* Article Option (Medium / LinkedIn) */}
            {(currentPlatform === 'medium' || currentPlatform === 'linkedin' || currentPlatform === 'x') && (
              <button
                onClick={() => setMediaMode('article')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  currentMode === 'article'
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-[#7e8594] hover:text-white'
                }`}
                title="Publish as full long-form article or deep thread"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Article / Thread</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Grid: Left Dynamic Preview | Right Content Correction & Platform Metadata */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (5 cols): Dynamic Preview (Video or Text Feed Preview) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Case 1: Video + Text OR Video Only Mode */}
            {(currentMode === 'video_text' || currentMode === 'video_only') ? (
              <div className="p-4 rounded-2xl bg-[#090a10] border border-[#202434] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">
                      {currentMode === 'video_only' ? 'Reel Video Clip' : 'Edited Video Cut'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-[#151722] text-[#8c92a4] border border-[#25293a]">
                      {aspectRatio}
                    </span>
                    <span className="text-emerald-400">
                      {trimDuration}s
                    </span>
                  </div>
                </div>

                {/* Video Player Canvas (Framed to Workspace Aspect Ratio) */}
                <div className="relative rounded-xl bg-black border border-[#1f2230] overflow-hidden aspect-video flex items-center justify-center">
                  {isLocalVideo && localVideoUrl ? (
                    <video
                      ref={videoRef}
                      src={localVideoUrl}
                      onTimeUpdate={handleVideoTimeUpdate}
                      className="w-full h-full object-contain"
                      playsInline
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
                      <div className="w-14 h-14 rounded-full bg-[#181a24] border border-[#2c3144] flex items-center justify-center font-mono text-xs text-white">
                        HOST
                      </div>
                      <span className="text-xs text-[#a0a7ba] font-mono">
                        {project.title}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400">
                        Cut: {formatTime(trimStart)} → {formatTime(trimEnd)}
                      </span>
                    </div>
                  )}

                  {/* Subtitle preview if enabled */}
                  {captions.enabled && (
                    <div className="absolute inset-x-3 bottom-3 z-10 text-center pointer-events-none">
                      <span className="inline-block px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-white text-xs font-semibold border border-white/10">
                        {captions.currentText}
                      </span>
                    </div>
                  )}

                  {/* Play/Pause Overlay Button */}
                  <button
                    onClick={toggleVideoPlayback}
                    className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all opacity-80 hover:opacity-100 z-20"
                    title={isPlaying ? 'Pause' : 'Play Cut'}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                  </button>
                </div>

                {/* YouTube Thumbnail Preview Card */}
                {currentPlatform === 'youtube' && (
                  <div className="p-3 rounded-xl bg-[#0f1118] border border-[#1b1e2a] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#8c92a2] flex items-center gap-1.5 font-medium">
                        <ImageIcon className="w-3.5 h-3.5 text-red-400" />
                        <span>YouTube Thumbnail Preview</span>
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">1280 x 720</span>
                    </div>

                    <div className="relative rounded-lg bg-[#141622] border border-[#252a3b] p-4 flex flex-col justify-between aspect-video overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono bg-red-600 text-white px-1.5 py-0.5 rounded font-bold">
                          HD
                        </span>
                        <span className="text-[10px] font-mono bg-black/70 text-white px-1.5 py-0.5 rounded">
                          {formatTime(trimDuration)}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-white tracking-tight leading-tight line-clamp-2">
                        {currentData.title}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Case 2: Text Only / Article Feed Card Preview */
              <div className="p-4 rounded-2xl bg-[#090a10] border border-[#202434] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlignLeft className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">
                      {currentMode === 'article' ? 'Article / Thread Preview' : 'Text Post Feed Preview'}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400">
                    No video attached
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#0e1017] border border-[#1e2230] space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white text-black font-bold flex items-center justify-center text-xs">
                      CF
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white block">CreatorFlow Studio</span>
                      <span className="text-[10px] text-[#6e7587] font-mono">@creatorflow • Just now</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#d3d8e5] leading-relaxed whitespace-pre-line">
                    {currentData.caption}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentData.hashtags.map((tag, idx) => (
                      <span key={idx} className="text-xs font-mono text-sky-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-[#717789] text-center">
                  Published as high-signal text breakdown without forcing video upload.
                </p>
              </div>
            )}
          </div>

          {/* Right Column (7 cols): Content Correction & Export Form */}
          <div className="lg:col-span-7 space-y-5">
            {/* AI Content Correction Banner & Action */}
            <div className="p-4 rounded-2xl bg-[#090b12] border border-[#20273c] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-[#38bdf8]" />
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">
                      AI Content Correction & Polish
                    </span>
                  </div>
                  <p className="text-xs text-[#8c92a4]">
                    Optimizes grammar, hook retention, and platform formatting for {platformList.find(p => p.id === currentPlatform)?.label}.
                  </p>
                </div>

                <button
                  onClick={handleRunContentCorrection}
                  disabled={isCorrecting}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#182032] hover:bg-[#202c46] border border-[#2b395a] text-xs font-medium text-sky-300 hover:text-white transition-all shrink-0 shadow-sm"
                >
                  {isCorrecting ? (
                    <span className="w-3.5 h-3.5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  )}
                  <span>{isCorrecting ? 'Correcting...' : 'Run Content Correction'}</span>
                </button>
              </div>

              {correctionApplied && (
                <div className="p-2 rounded-lg bg-emerald-950/70 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Content corrected! Headline, copy, and hashtags calibrated for {platformList.find(p => p.id === currentPlatform)?.label}.</span>
                </div>
              )}
            </div>

            {/* Title Field (Hidden for video_only reels if not needed) */}
            {currentMode !== 'video_only' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium uppercase tracking-wider text-[#82899b]">
                    {currentPlatform === 'youtube' ? 'Headline / Video Title' : 'Post Title'}
                  </label>
                  <button
                    onClick={() => copyToClipboard(currentData.title, 'title')}
                    className="flex items-center gap-1 text-xs text-[#8e95a7] hover:text-white transition-colors"
                  >
                    {copiedKey === 'title' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Title</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="text"
                  value={currentData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full rounded-xl bg-[#0d0e14] border border-[#202330] px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#414a64]"
                />
              </div>
            )}

            {/* Caption / Content Explanation Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium uppercase tracking-wider text-[#82899b]">
                  {currentMode === 'article' ? 'Article Body / Story Content' : 'Caption / Content Explanation'}
                </label>
                <button
                  onClick={() => copyToClipboard(currentData.caption, 'caption')}
                  className="flex items-center gap-1 text-xs text-[#8e95a7] hover:text-white transition-colors"
                >
                  {copiedKey === 'caption' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Caption</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                rows={currentMode === 'article' ? 8 : 5}
                value={currentData.caption}
                onChange={(e) => handleFieldChange('caption', e.target.value)}
                className="w-full resize-y rounded-xl bg-[#0d0e14] border border-[#202330] px-4 py-3 text-xs text-white leading-relaxed focus:outline-none focus:border-[#414a64]"
              />
            </div>

            {/* Hashtags Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium uppercase tracking-wider text-[#82899b]">
                  Hashtags & Distribution Tags
                </label>
                <button
                  onClick={() => copyToClipboard(currentData.hashtags.join(' '), 'tags')}
                  className="flex items-center gap-1 text-xs text-[#8e95a7] hover:text-white transition-colors"
                >
                  {copiedKey === 'tags' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Tags</span>
                    </>
                  )}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#0d0e14] border border-[#202330]">
                {currentData.hashtags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono px-2 py-0.5 rounded-md bg-[#161824] text-sky-300 border border-[#23283a]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Format & Publish Action Button */}
            <div className="pt-3 border-t border-[#1c1f2b] flex items-center justify-between">
              <span className="text-xs font-mono text-[#6e7587]">
                Mode: {currentMode === 'video_only' ? 'Video Only' : currentMode === 'text_only' ? 'Text Only' : currentMode === 'article' ? 'Article' : 'Video + Text'} • {selectedPlatforms[currentPlatform] ? 'Active for export' : 'Unchecked (skipped)'}
              </span>

              <button
                onClick={() => setIsPublishModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-semibold shadow-lg transition-all"
              >
                <Send className="w-3.5 h-3.5 fill-current" />
                <span>Format & Publish ({selectedCount} Selected)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Format & Publish Multi-Platform Confirmation Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
          <div className="w-full max-w-lg rounded-2xl bg-[#0c0e15] border border-[#222738] p-6 space-y-4 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="text-base font-semibold text-white tracking-tight">
                Publish Package Ready!
              </h3>
            </div>

            <p className="text-xs text-[#9ea4b6] leading-relaxed">
              Your customized video cut and AI-polished copy have been calibrated for <strong>{selectedCount} selected channels</strong>.
            </p>

            {/* Selected Platforms Checklist with specific mode */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-[#787f90] uppercase tracking-wider block">
                Channel Distribution Plan:
              </span>
              <div className="space-y-1.5">
                {platformList
                  .filter((p) => selectedPlatforms[p.id])
                  .map((p) => {
                    const mode = platformMediaModes[p.id];
                    return (
                      <div
                        key={p.id}
                        className="p-2.5 rounded-xl bg-[#11131c] border border-[#1f2332] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          {p.icon}
                          <span className="font-semibold text-white">{p.label}</span>
                        </div>
                        <span className="text-xs font-mono text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-900/50">
                          {mode === 'video_only' ? 'Reel Video Only' : mode === 'text_only' ? 'Text Post' : mode === 'article' ? 'Article Story' : 'Video + Copy'}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  const activePlatformNames = platformList
                    .filter((p) => selectedPlatforms[p.id])
                    .map((p) => p.label)
                    .join(', ');
                  const fullBundle = `=== CREATORFLOW MULTI-PLATFORM PUBLISH BUNDLE ===\nChannels: ${activePlatformNames}\nVideo Cut: ${formatTime(trimStart)} - ${formatTime(trimEnd)} (${trimDuration}s, ${aspectRatio})\n\n[TITLE]\n${currentData.title}\n\n[COPY]\n${currentData.caption}\n\n[HASHTAGS]\n${currentData.hashtags.join(' ')}`;
                  navigator.clipboard.writeText(fullBundle);
                  copyToClipboard(fullBundle, 'bundle');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-md"
              >
                {copiedKey === 'bundle' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Copied Full Publishing Package!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Full Multi-Channel Package</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="w-full py-2 px-3 rounded-xl bg-[#151722] hover:bg-[#1d202e] text-[#9ca3b6] text-xs font-medium border border-[#232736] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
