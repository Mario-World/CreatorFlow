'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCreatorFlowStore } from '@/store/creatorFlowStore';
import { creatorFlowOperations } from '@/domain/operations';
import { AspectRatio } from '@/types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Subtitles, 
  Smartphone, 
  Monitor, 
  Square, 
  Scissors, 
  Volume2, 
  VolumeX,
  Layers, 
  Sparkles,
  Upload,
  FastForward,
  Rewind,
  FileVideo
} from 'lucide-react';

export const VideoPreview: React.FC = () => {
  const currentTime = useCreatorFlowStore((s) => s.timeline.currentTime);
  const duration = useCreatorFlowStore((s) => s.timeline.duration);
  const isPlaying = useCreatorFlowStore((s) => s.timeline.isPlaying);
  const trimStart = useCreatorFlowStore((s) => s.timeline.trimStart);
  const trimEnd = useCreatorFlowStore((s) => s.timeline.trimEnd);
  const volume = useCreatorFlowStore((s) => s.timeline.volume);
  const isMuted = useCreatorFlowStore((s) => s.timeline.isMuted);
  const playbackRate = useCreatorFlowStore((s) => s.timeline.playbackRate);
  const aspectRatio = useCreatorFlowStore((s) => s.aspectRatio);
  const captions = useCreatorFlowStore((s) => s.captions);
  const editPlan = useCreatorFlowStore((s) => s.editPlan);
  const project = useCreatorFlowStore((s) => s.project);
  const transcript = useCreatorFlowStore((s) => s.transcript);
  const lastAIAction = useCreatorFlowStore((s) => s.lastAIAction);
  const localVideoUrl = useCreatorFlowStore((s) => s.localVideoUrl);
  const isLocalVideo = useCreatorFlowStore((s) => s.isLocalVideo);
  const uploadLocalVideo = useCreatorFlowStore((s) => s.uploadLocalVideo);
  const setVolume = useCreatorFlowStore((s) => s.setVolume);
  const toggleMute = useCreatorFlowStore((s) => s.toggleMute);
  const setPlaybackRate = useCreatorFlowStore((s) => s.setPlaybackRate);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync real HTML5 video element with store state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Math.abs(video.currentTime - currentTime) > 0.4) {
      video.currentTime = currentTime;
    }
  }, [currentTime]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = isMuted ? 0 : volume;
    video.muted = isMuted;
    video.playbackRate = playbackRate;
  }, [volume, isMuted, playbackRate]);

  // Synchronous playback simulation loop for sample demo (when not using real local video)
  useEffect(() => {
    if (isLocalVideo) return;

    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        const store = useCreatorFlowStore.getState();
        let nextTime = store.timeline.currentTime + 0.25;

        // If beyond trimEnd, loop back to trimStart
        if (nextTime >= store.timeline.trimEnd) {
          nextTime = store.timeline.trimStart;
        }

        creatorFlowOperations.setCurrentTime(nextTime);
      }, 250);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isLocalVideo]);

  // Current active segment text for subtitles
  const activeSegment = transcript.find(
    (s) => currentTime >= s.start && currentTime < s.end
  ) || transcript[0];

  const currentDurationFormatted = formatTime(currentTime);
  const totalDurationFormatted = formatTime(duration);
  const trimDuration = Math.round(trimEnd - trimStart);
  const isTrimmed = trimStart > 0 || trimEnd < duration;

  // Aspect ratio styling
  const getAspectRatioClasses = (ratio: AspectRatio) => {
    switch (ratio) {
      case '9:16':
        return 'w-[280px] h-[490px] md:w-[300px] md:h-[530px]';
      case '1:1':
        return 'w-[380px] h-[380px] md:w-[440px] md:h-[440px]';
      case '16:9':
      default:
        return 'w-full max-w-[720px] aspect-video';
    }
  };

  const handleVideoTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    if (time >= trimEnd) {
      videoRef.current.currentTime = trimStart;
      creatorFlowOperations.setCurrentTime(trimStart);
      return;
    }
    creatorFlowOperations.setCurrentTime(time);
  };

  const handleStepFrame = (delta: number) => {
    const next = Math.max(0, Math.min(duration, currentTime + delta));
    creatorFlowOperations.setCurrentTime(next);
  };

  const cyclePlaybackRate = () => {
    const rates = [1, 1.5, 2];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    setPlaybackRate(rates[nextIdx]);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-4 bg-black relative overflow-hidden select-none">
      {/* Hidden native file input strictly for MP4 video uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) {
            if (f.type !== 'video/mp4' && !f.name.toLowerCase().endsWith('.mp4')) {
              alert('CreatorFlow only accepts MP4 video files (.mp4). Please upload a valid MP4 video.');
              if (fileInputRef.current) fileInputRef.current.value = '';
              return;
            }
            uploadLocalVideo(f);
          }
        }}
        accept="video/mp4,.mp4"
        className="hidden"
      />

      {/* AI Changed This Banner with instant Undo */}
      {lastAIAction && (
        <div className="w-full max-w-2xl mb-2 px-4 py-2 rounded-xl bg-[#0f1713] border border-emerald-500/40 flex items-center justify-between gap-3 text-sm shadow-xl animate-fade-in">
          <div className="flex items-center gap-2 text-emerald-300 min-w-0">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold text-emerald-200 shrink-0">AI changed this:</span>
            <span className="text-[#d2e7dc] truncate text-xs font-normal">{lastAIAction.description}</span>
          </div>

          <button
            onClick={() => creatorFlowOperations.undoAIAction()}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-all shrink-0 shadow-md"
            title="Revert AI changes via WebMCP undo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>
        </div>
      )}

      {/* Top Controls Toolbar: Aspect Ratio & Captions */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-3 shrink-0">
        {/* Selected Region & Cut Status */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d0e14] border border-[#202330] text-xs text-[#cfd4e2]">
            <Scissors className="w-3.5 h-3.5 text-[#9ca2b2]" />
            <span className="font-mono font-medium text-sm">
              {formatTime(trimStart)} → {formatTime(trimEnd)}
            </span>
            <span className="text-xs text-[#717787] font-mono">
              ({trimDuration}s)
            </span>
          </div>

          {isTrimmed && (
            <span className="text-xs font-mono px-2 py-1 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
              Cut active
            </span>
          )}
        </div>

        {/* Aspect Ratio & Format Controls */}
        <div className="flex items-center gap-1 bg-[#0d0e14] p-1 rounded-lg border border-[#202330]">
          <button
            onClick={() => creatorFlowOperations.changeAspectRatio('16:9')}
            title="16:9 Landscape"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              aspectRatio === '16:9'
                ? 'bg-[#1e2230] text-white shadow-sm'
                : 'text-[#7e8594] hover:text-[#c4c9d5]'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>16:9</span>
          </button>
          <button
            onClick={() => creatorFlowOperations.changeAspectRatio('9:16')}
            title="9:16 Vertical Reel"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              aspectRatio === '9:16'
                ? 'bg-[#1e2230] text-white shadow-sm'
                : 'text-[#7e8594] hover:text-[#c4c9d5]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>9:16</span>
          </button>
          <button
            onClick={() => creatorFlowOperations.changeAspectRatio('1:1')}
            title="1:1 Square"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              aspectRatio === '1:1'
                ? 'bg-[#1e2230] text-white shadow-sm'
                : 'text-[#7e8594] hover:text-[#c4c9d5]'
            }`}
          >
            <Square className="w-3.5 h-3.5" />
            <span>1:1</span>
          </button>

          {/* Captions Toggle */}
          <button
            onClick={() => creatorFlowOperations.toggleCaptions()}
            title={captions.enabled ? 'Disable captions' : 'Enable captions'}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              captions.enabled
                ? 'bg-[#292f42] text-white border border-[#404760]'
                : 'text-[#7e8594] hover:text-[#c4c9d5]'
            }`}
          >
            <Subtitles className="w-3.5 h-3.5" />
            <span>CC</span>
          </button>
        </div>
      </div>

      {/* Video Preview Canvas / Mock Monitor */}
      <div className="flex-1 flex items-center justify-center w-full min-h-0">
        <div
          className={`relative rounded-2xl border border-[#202433] bg-[#090a10] overflow-hidden shadow-2xl flex flex-col transition-all duration-300 ${getAspectRatioClasses(
            aspectRatio
          )}`}
        >
          {/* Real Local Video Element (when local video is uploaded) */}
          {isLocalVideo && localVideoUrl ? (
            <video
              ref={videoRef}
              src={localVideoUrl}
              onTimeUpdate={handleVideoTimeUpdate}
              onEnded={() => creatorFlowOperations.togglePlayback()}
              className="w-full h-full object-contain bg-black"
              playsInline
            />
          ) : (
            /* Cardboard Studio Mockup (when using sample demo) */
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center">
              {/* Speaker Silhouette / Camera Feed */}
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-[#141622] border border-[#2b3044] flex items-center justify-center shadow-inner relative overflow-hidden">
                  <div className="w-14 h-14 rounded-full bg-[#202538] flex items-center justify-center text-white/90 font-mono text-sm font-bold">
                    HOST
                  </div>
                </div>

                {/* Animated Audio Equalizer */}
                {isPlaying && (
                  <div className="absolute -bottom-2 inset-x-0 flex justify-center items-end gap-1 h-5">
                    <span className="w-1 bg-emerald-400 rounded-full audio-bar-1" />
                    <span className="w-1 bg-emerald-400 rounded-full audio-bar-2" />
                    <span className="w-1 bg-emerald-400 rounded-full audio-bar-3" />
                    <span className="w-1 bg-emerald-400 rounded-full audio-bar-4" />
                    <span className="w-1 bg-emerald-400 rounded-full audio-bar-5" />
                  </div>
                )}
              </div>

              {/* Title & Upload Trigger Card */}
              <div className="space-y-2 max-w-sm">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-black/50 border border-white/10 text-xs font-mono text-[#a2a8b9]">
                  <Layers className="w-3 h-3 text-emerald-400" />
                  <span>Agent-Operable Workspace</span>
                </div>
                <h3 className="text-lg font-medium text-white tracking-tight">
                  {project.title}
                </h3>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-medium pt-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Or upload your own MP4 video (.mp4)</span>
                </button>
              </div>
            </div>
          )}

          {/* Live Captions Overlay */}
          {captions.enabled && (
            <div className="absolute inset-x-4 bottom-6 z-20 text-center pointer-events-none">
              <div className="inline-block px-4 py-2 rounded-lg bg-black/85 backdrop-blur-md border border-white/15 text-white text-sm md:text-base font-semibold tracking-wide shadow-2xl">
                {activeSegment ? activeSegment.text : captions.currentText}
              </div>
            </div>
          )}

          {/* Top Video HUD metadata */}
          <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-mono font-medium text-white/80 bg-black/50 px-2 py-0.5 rounded border border-white/10">
                {isLocalVideo ? 'LOCAL VIDEO' : 'REC 4K'}
              </span>
            </div>
            <span className="text-xs font-mono text-white/70 bg-black/50 px-2 py-0.5 rounded border border-white/10">
              {editPlan.name}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Video Controls: Play/Pause, Step Frames, Volume, Speed, Timecode */}
      <div className="w-full max-w-2xl mt-3 flex items-center justify-between gap-4 p-3 rounded-2xl bg-[#0d0e14] border border-[#202330] shrink-0">
        {/* Playback buttons */}
        <div className="flex items-center gap-2">
          {/* Cue to start */}
          <button
            onClick={() => creatorFlowOperations.setCurrentTime(trimStart)}
            className="p-2 rounded-lg text-[#858c9e] hover:text-white hover:bg-[#1a1c25] transition-colors"
            title="Cue to cut start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Step Back 1s */}
          <button
            onClick={() => handleStepFrame(-1)}
            className="p-2 rounded-lg text-[#858c9e] hover:text-white hover:bg-[#1a1c25] transition-colors"
            title="Step -1s"
          >
            <Rewind className="w-4 h-4" />
          </button>

          {/* Play / Pause Button */}
          <button
            onClick={() => creatorFlowOperations.togglePlayback()}
            className="w-10 h-10 rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors flex items-center justify-center font-medium shadow-md"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          {/* Step Forward 1s */}
          <button
            onClick={() => handleStepFrame(1)}
            className="p-2 rounded-lg text-[#858c9e] hover:text-white hover:bg-[#1a1c25] transition-colors"
            title="Step +1s"
          >
            <FastForward className="w-4 h-4" />
          </button>
        </div>

        {/* Current Timecode & Duration */}
        <div className="flex items-center gap-2 font-mono text-sm">
          <span className="text-white font-bold">{currentDurationFormatted}</span>
          <span className="text-[#555a6a]">/</span>
          <span className="text-[#8e95aa]">{totalDurationFormatted}</span>
        </div>

        {/* Audio Controls: Mute, Volume, Playback Speed */}
        <div className="flex items-center gap-3">
          {/* Volume Control */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleMute()}
              className="p-1.5 rounded-lg text-[#858c9e] hover:text-white hover:bg-[#1a1c25] transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-white" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 h-1.5 bg-[#202433] rounded-lg appearance-none cursor-pointer accent-white"
              title="Volume"
            />
          </div>

          {/* Playback Rate */}
          <button
            onClick={cyclePlaybackRate}
            className="px-2 py-1 rounded bg-[#171922] hover:bg-[#202432] text-xs font-mono font-medium text-white border border-[#292d3e] transition-colors"
            title="Playback Speed"
          >
            {playbackRate}x
          </button>
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
