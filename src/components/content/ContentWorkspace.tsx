'use client';

import React, { useRef, useState } from 'react';
import { useCreatorFlowStore } from '@/store/creatorFlowStore';
import { 
  Upload, 
  Video, 
  Film, 
  Check, 
  ArrowRight, 
  RotateCcw, 
  FileText, 
  Sparkles, 
  Trash2, 
  Paperclip, 
  CheckCircle2, 
  X,
  Play
} from 'lucide-react';

export const ContentWorkspace: React.FC = () => {
  const project = useCreatorFlowStore((s) => s.project);
  const isLocalVideo = useCreatorFlowStore((s) => s.isLocalVideo);
  const localVideoUrl = useCreatorFlowStore((s) => s.localVideoUrl);
  const uploadLocalVideo = useCreatorFlowStore((s) => s.uploadLocalVideo);
  const applyContentText = useCreatorFlowStore((s) => s.applyContentText);
  const resetToSampleVideo = useCreatorFlowStore((s) => s.resetToSampleVideo);
  const setCurrentArea = useCreatorFlowStore((s) => s.setCurrentArea);
  const collaboration = useCreatorFlowStore((s) => s.collaboration);

  // Content Text State (Title and Script/Copy)
  const [title, setTitle] = useState(
    project.title || 'How to Fine-tune a Model Without Code'
  );
  
  const [text, setText] = useState(
    project.scriptText ||
      `Most people think fine-tuning an AI model requires deep machine learning code.
They assume you need a cluster of GPUs and months of Python scripts.
Here is the truth: you can fine-tune custom AI models today with zero code.
Without any technical knowledge in AI engineering, you take your domain knowledge, curate your dataset, and train a specialized model in minutes.`
  );

  // Video Attachment State
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(localVideoUrl || null);
  const [isDemoPreloaded, setIsDemoPreloaded] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file) return;
    setAttachedFile(file);
    setIsDemoPreloaded(false);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    if (!title || title === 'Sample Project' || title === 'Sample Creator Video') {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleProceedToWorkspace = async () => {
    setIsProcessing(true);
    try {
      if (attachedFile) {
        await uploadLocalVideo(attachedFile, { title, text });
      } else {
        applyContentText({ title, text });
      }
      setCurrentArea('workspace');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveAttachment = () => {
    setAttachedFile(null);
    setPreviewUrl(null);
    setIsDemoPreloaded(false);
    resetToSampleVideo();
  };

  const lines = text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const presetFineTuning = () => {
    setTitle('How to Fine-tune a Model Without Code');
    setText(
      `Most people think fine-tuning an AI model requires deep machine learning code.
They assume you need a cluster of GPUs and months of Python scripts.
Here is the truth: you can fine-tune custom AI models today with zero code.
Without any technical knowledge in AI engineering, you take your domain knowledge, curate your dataset, and train a specialized model in minutes.`
    );
    setIsDemoPreloaded(true);
  };

  const presetViralHook = () => {
    setTitle('The 30-Second Creator Workflow Revolution');
    setText(
      `Here is why traditional video editing workflows are broken.
Creators spend four hours trimming clips that AI agents reframe in seconds.
Focus on high-leverage storytelling and let agent tools handle platform exports.`
    );
  };

  const clearText = () => {
    setTitle('');
    setText('');
  };

  const hasVideo = Boolean(attachedFile || isLocalVideo || previewUrl || isDemoPreloaded);

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#070709] p-4 sm:p-6 lg:p-8 select-none">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="space-y-1.5 border-b border-[#1b1e2a] pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111420] border border-[#23293e] text-xs font-mono text-sky-400">
            <Paperclip className="w-3.5 h-3.5" />
            <span>Content Studio & Media Attachment</span>
          </div>
          <h1 className="text-2xl font-medium text-white tracking-tight">
            Create Content & Attach Video
          </h1>
          <p className="text-sm text-[#8c94a7] leading-relaxed max-w-2xl">
            Write your script, talking points, or platform copy on the left, then attach your video file on the right to edit and publish seamlessly in ClipFlow.
          </p>
        </div>

        {/* Hidden Native File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="video/mp4,.mp4,video/*,.mov,.webm,.mkv"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFileSelect(f);
          }}
          className="hidden"
        />

        {/* Studio 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Write Text & Script */}
          <div className="lg:col-span-7 space-y-4 bg-[#0b0c11] border border-[#1b1e2a] rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-[#171a25] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" />
                <h2 className="text-base font-medium text-white">
                  1. Write Content & Script
                </h2>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#131622] text-[#8e96ac] border border-[#212638]">
                {lines.length} {lines.length === 1 ? 'cue' : 'cues'} ready
              </span>
            </div>

            {/* Title / Topic Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#8f96a8] uppercase tracking-wider block">
                Post Title / Topic
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Harness Engineering: Why Production Testing is Dead"
                className="w-full px-4 py-2.5 rounded-xl bg-[#11131c] border border-[#232738] focus:border-sky-500 focus:outline-none text-white text-sm font-medium transition-all"
              />
            </div>

            {/* Script / Body Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[#8f96a8] uppercase tracking-wider block">
                  Script, Talking Points, or Post Text
                </label>
                <span className="text-[11px] text-[#6b7285] font-mono">
                  Each line becomes a synced transcript cue
                </span>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
                placeholder="Write your script, talking points, hook, or caption text here...&#10;&#10;Line 1: Hook and opening idea&#10;Line 2: Core problem and challenge&#10;Line 3: Key solution and takeaway&#10;Line 4: Call to action"
                className="w-full p-4 rounded-xl bg-[#11131c] border border-[#232738] focus:border-sky-500 focus:outline-none text-white text-sm leading-relaxed transition-all font-sans resize-none"
              />
            </div>

            {/* Quick Presets / Helper Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-[#71788c] font-medium mr-1">
                Templates:
              </span>
              <button
                type="button"
                onClick={presetFineTuning}
                className="text-xs font-medium px-2.5 py-1 rounded-lg bg-[#141724] hover:bg-[#1c2234] text-sky-400 border border-[#242c44] transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3" />
                <span>Fine-Tune Without Code</span>
              </button>
              <button
                type="button"
                onClick={presetViralHook}
                className="text-xs font-medium px-2.5 py-1 rounded-lg bg-[#141724] hover:bg-[#1c2234] text-purple-400 border border-[#242c44] transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3" />
                <span>30s Viral Hook</span>
              </button>
              <button
                type="button"
                onClick={clearText}
                className="text-xs font-medium px-2.5 py-1 rounded-lg bg-[#141620] hover:bg-[#1d202d] text-[#8e94a8] border border-[#222636] transition-all flex items-center gap-1.5 ml-auto"
                title="Clear text"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Right Column: Attach Video Media */}
          <div className="lg:col-span-5 space-y-4 bg-[#0b0c11] border border-[#1b1e2a] rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#171a25] pb-3">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-base font-medium text-white">
                    2. Attach Video
                  </h2>
                </div>
                <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                  hasVideo
                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                    : 'bg-[#181a24] text-[#8e95aa] border-[#292e40]'
                }`}>
                  {hasVideo ? '✓ Video Attached' : 'No Video Attached'}
                </span>
              </div>

              {/* Video Attachment Details / Dropzone */}
              {hasVideo ? (
                <div className="space-y-3">
                  {/* Video Attachment Card */}
                  <div className="p-4 rounded-xl bg-[#0f121b] border border-[#21273a] space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[#171c2c] border border-[#2e3752] flex items-center justify-center text-sky-400 shrink-0">
                          <Video className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-medium text-white truncate">
                            {attachedFile 
                              ? attachedFile.name 
                              : (isDemoPreloaded ? 'fine_tune_model_without_code_2min07s.mp4' : project.title)}
                          </h4>
                          <p className="text-xs text-[#828a9e] mt-0.5 font-mono">
                            {attachedFile 
                              ? `${(attachedFile.size / (1024 * 1024)).toFixed(1)} MB • Local Video`
                              : (isDemoPreloaded 
                                  ? 'Duration: 02:07 • 9:16 Vertical • Original 2:07 Source Video' 
                                  : `Duration: ${project.durationFormatted} • Attached`)}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 shrink-0">
                        {isDemoPreloaded && !attachedFile ? 'Demo Ready' : 'Ready'}
                      </span>
                    </div>

                    {/* Interactive Video Preview Player */}
                    {previewUrl && (
                      <div className="relative rounded-lg overflow-hidden border border-[#23293c] bg-black aspect-video flex items-center justify-center">
                        <video
                          src={previewUrl}
                          controls
                          className="w-full h-full object-contain"
                          playsInline
                        />
                      </div>
                    )}

                    {/* Change / Reset Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 py-2 px-3 rounded-lg bg-[#171b28] hover:bg-[#202538] text-white text-xs font-medium border border-[#293148] transition-all flex items-center justify-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5 text-sky-400" />
                        <span>Change / Upload Another</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveAttachment}
                        className="py-2 px-3 rounded-lg bg-[#141620] hover:bg-[#1d202d] text-[#8e95aa] hover:text-white text-xs font-medium border border-[#232738] transition-all"
                        title="Remove attachment"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty Dropzone to Attach */
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isDragOver
                      ? 'border-emerald-500 bg-[#0f1622]'
                      : 'border-[#262b3d] hover:border-[#3d4562] bg-[#0e1017] hover:bg-[#121520]'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#151928] border border-[#262f48] flex items-center justify-center text-[#8e96aa] mb-3">
                    <Upload className="w-5 h-5 text-sky-400" />
                  </div>
                  <p className="text-sm font-medium text-white mb-1">
                    {isProcessing ? 'Reading video file...' : 'Drop your video file here'}
                  </p>
                  <p className="text-xs text-[#828a9e]">
                    or <span className="text-sky-400 underline underline-offset-2">browse MP4/MOV from computer</span>
                  </p>
                  <span className="text-[11px] text-[#636b80] font-mono mt-3">
                    Supported: MP4, MOV, WEBM, MKV
                  </span>
                </div>
              )}

              {/* Sample Project Fallback */}
              {!isLocalVideo && !attachedFile && (
                <button
                  type="button"
                  onClick={() => {
                    resetToSampleVideo();
                    setAttachedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#12141f] hover:bg-[#191c2c] text-[#a1a7ba] hover:text-white border border-[#212638] text-xs font-medium transition-all flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#7a8196]" />
                  <span>Attach Default Sample Video (01:32)</span>
                </button>
              )}
            </div>

            {/* Launch Status / Ready Pill */}
            <div className="pt-4 border-t border-[#171a25] space-y-3">
              <div className="flex items-center justify-between text-xs text-[#8e95a8]">
                <span>Status:</span>
                <span className="font-medium text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ready to edit in Workspace</span>
                </span>
              </div>

              <button
                type="button"
                onClick={handleProceedToWorkspace}
                disabled={isProcessing}
                className="w-full py-3.5 px-5 rounded-xl bg-white hover:bg-neutral-200 text-black font-medium text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isProcessing ? 'Processing Video...' : 'Open in Workspace'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
