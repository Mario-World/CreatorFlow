'use client';

import React, { useState } from 'react';
import { useCreatorFlowStore } from '@/store/creatorFlowStore';
import { creatorFlowOperations } from '@/domain/operations';
import { PlatformId } from '@/types';
import { 
  BookOpen, 
  Check, 
  Copy, 
  ExternalLink, 
  ShieldCheck, 
  Film, 
  Sparkles,
  Layers,
  FileCheck
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
  const editPlan = useCreatorFlowStore((s) => s.editPlan);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const platformList: { id: PlatformId; label: string; icon: React.ReactNode }[] = [
    { id: 'youtube', label: 'YouTube', icon: <YoutubeIcon className="w-4 h-4 text-red-400" /> },
    { id: 'instagram', label: 'Instagram', icon: <InstagramIcon className="w-4 h-4 text-pink-400" /> },
    { id: 'linkedin', label: 'LinkedIn', icon: <LinkedinIcon className="w-4 h-4 text-blue-400" /> },
    { id: 'x', label: 'X (Twitter)', icon: <XIcon className="w-4 h-4 text-sky-400" /> },
    { id: 'medium', label: 'Medium', icon: <BookOpen className="w-4 h-4 text-emerald-400" /> },
  ];

  const currentData = publishing[currentPlatform];
  const trimDuration = Math.round(trimEnd - trimStart);

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

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-y-auto bg-[#090a0d] p-6">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Workspace Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#1c1f2a]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded">
                Prepared for publishing
              </span>
              <span className="text-xs text-[#6e7587] font-mono">
                Cut: {formatTime(trimStart)} → {formatTime(trimEnd)} ({trimDuration}s)
              </span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Publish Preparation
            </h1>
            <p className="text-xs text-[#8c92a4] mt-1 max-w-xl">
              Platform-optimized output generated from your active project cut. Review, customize, and export ready-to-publish assets.
            </p>
          </div>

          {/* Prototype Safety Notice */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#11141c] border border-[#232736] text-xs text-[#989fb0]">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="leading-snug">
              <strong className="text-white">Safety boundary:</strong> Ready for export. Never claims or triggers real publishing.
            </span>
          </div>
        </div>

        {/* Platform Selection Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {platformList.map((p) => {
            const isActive = currentPlatform === p.id;
            return (
              <button
                key={p.id}
                onClick={() => creatorFlowOperations.setCurrentPlatform(p.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
                  isActive
                    ? 'bg-[#181b26] text-white border-[#3d455c] shadow-sm'
                    : 'bg-[#0f1118] text-[#7d8496] border-[#1d202c] hover:bg-[#141620] hover:text-[#c4c9d8]'
                }`}
              >
                {p.icon}
                <span>{p.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Platform Details & Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form & Formats (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Format & Status Info */}
            <div className="p-4 rounded-xl bg-[#10121a] border border-[#1f2331] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#6e7587] block mb-0.5">
                  Target Format
                </span>
                <span className="text-sm font-semibold text-white">
                  {currentData.format}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#6e7587] block mb-0.5">
                  Pipeline Status
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/60">
                  <FileCheck className="w-3 h-3" />
                  {currentData.status}
                </span>
              </div>
            </div>

            {/* Title Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium uppercase tracking-wider text-[#82899b]">
                  Title
                </label>
                <button
                  onClick={() => copyToClipboard(currentData.title, 'title')}
                  className="flex items-center gap-1 text-[11px] text-[#8e95a7] hover:text-white transition-colors"
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
                className="w-full rounded-lg bg-[#12141d] border border-[#222635] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#414a64]"
              />
            </div>

            {/* Caption Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium uppercase tracking-wider text-[#82899b]">
                  Caption
                </label>
                <button
                  onClick={() => copyToClipboard(currentData.caption, 'caption')}
                  className="flex items-center gap-1 text-[11px] text-[#8e95a7] hover:text-white transition-colors"
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
                rows={5}
                value={currentData.caption}
                onChange={(e) => handleFieldChange('caption', e.target.value)}
                className="w-full resize-y rounded-lg bg-[#12141d] border border-[#222635] px-3.5 py-2.5 text-xs text-white leading-relaxed focus:outline-none focus:border-[#414a64]"
              />
            </div>

            {/* Description Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium uppercase tracking-wider text-[#82899b]">
                  Description
                </label>
                <button
                  onClick={() => copyToClipboard(currentData.description, 'description')}
                  className="flex items-center gap-1 text-[11px] text-[#8e95a7] hover:text-white transition-colors"
                >
                  {copiedKey === 'description' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Description</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                rows={4}
                value={currentData.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                className="w-full resize-y rounded-lg bg-[#12141d] border border-[#222635] px-3.5 py-2.5 text-xs text-[#c6cbda] font-mono leading-relaxed focus:outline-none focus:border-[#414a64]"
              />
            </div>

            {/* Hashtags */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-[#82899b]">
                Hashtags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {currentData.hashtags.map((tag, idx) => (
                  <span
                    key={idx}
                    onClick={() => copyToClipboard(tag, `tag_${idx}`)}
                    className="px-2.5 py-1 rounded-md bg-[#131620] border border-[#202534] text-xs font-mono text-[#9ea5b8] hover:text-white hover:border-[#353c52] transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Export Actions Bar */}
            <div className="pt-3 border-t border-[#1c1f2a] flex items-center justify-between">
              <span className="text-xs text-[#717789] font-mono">
                Package ready for export
              </span>
              <button
                onClick={() => {
                  const packageText = `TITLE:\n${currentData.title}\n\nCAPTION:\n${currentData.caption}\n\nDESCRIPTION:\n${currentData.description}\n\nHASHTAGS:\n${currentData.hashtags.join(' ')}`;
                  copyToClipboard(packageText, 'bundle');
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors shadow-sm"
              >
                {copiedKey === 'bundle' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied Entire Bundle!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Complete Bundle</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Platform Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#82899b] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#a2a8b9]" />
                Platform Preview
              </span>
              <span className="text-[11px] font-mono text-[#676d7f]">
                {currentData.name} simulation
              </span>
            </div>

            {/* Mock Platform Container */}
            <div className="rounded-xl border border-[#242838] bg-[#11131b] p-4 shadow-xl space-y-4">
              {/* Platform Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1c202d]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#1e2332] flex items-center justify-center">
                    {platformList.find((p) => p.id === currentPlatform)?.icon}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      Creator Account
                    </span>
                    <span className="text-[10px] text-[#6d7385] font-mono">
                      @creatorflow • Now
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#181b26] text-[#8e95a7] border border-[#25293a]">
                  Preview Mode
                </span>
              </div>

              {/* Text Preview */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white leading-snug">
                  {currentData.title}
                </h4>
                <p className="text-xs text-[#cfd4e2] whitespace-pre-line leading-relaxed">
                  {currentData.caption}
                </p>
                <div className="text-xs text-sky-400/90 font-mono">
                  {currentData.hashtags.join(' ')}
                </div>
              </div>

              {/* Mock Video Player Card in Preview */}
              <div className="relative rounded-lg bg-[#0a0b0f] border border-[#202330] overflow-hidden aspect-video flex flex-col items-center justify-center text-center p-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2">
                  <Film className="w-5 h-5 text-white/80" />
                </div>
                <span className="text-xs font-medium text-white/90">
                  {project.title}
                </span>
                <span className="text-[10px] text-white/50 font-mono mt-0.5">
                  Cut Duration: {trimDuration}s • Format: {currentData.format.split(' ')[0]}
                </span>
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white/80">
                  {formatTime(trimDuration)}
                </div>
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
