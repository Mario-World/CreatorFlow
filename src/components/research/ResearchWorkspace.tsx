'use client';

import React, { useState } from 'react';
import { useCreatorFlowStore } from '@/store/creatorFlowStore';
import { creatorFlowOperations } from '@/domain/operations';
import { ResearchBrief } from '@/types';
import { 
  FileSearch, 
  Sparkles, 
  ArrowRight, 
  Target, 
  CheckCircle2, 
  Copy, 
  Check, 
  Bookmark, 
  BookmarkCheck,
  Film,
  Share2,
  Users,
  Lightbulb,
  Zap,
  RotateCcw
} from 'lucide-react';

import { HARNESS_ENGINEERING_BRIEF } from '@/lib/openai';

export const ResearchWorkspace: React.FC = () => {
  const project = useCreatorFlowStore((s) => s.project);
  const transcript = useCreatorFlowStore((s) => s.transcript);
  const setCurrentArea = useCreatorFlowStore((s) => s.setCurrentArea);
  const saveResearchBrief = useCreatorFlowStore((s) => s.saveResearchBrief);
  const loadHarnessEngineeringPack = useCreatorFlowStore((s) => s.loadHarnessEngineeringPack);

  // Phase 6 step 1: Research Input
  const [topicInput, setTopicInput] = useState('Harness Engineering: Fast & Resilient Software Systems');
  const [audienceInput, setAudienceInput] = useState('Software Engineers, Tech Creators & Engineering Leaders');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Active synthesized brief (Defaulted to comprehensive Harness Engineering research)
  const [currentBrief, setCurrentBrief] = useState<ResearchBrief>(
    project.researchBrief || HARNESS_ENGINEERING_BRIEF
  );

  const promptSuggestions = [
    'Harness Engineering for Software & AI Systems',
    'Why 90% of Teams Debug in Production',
    'Automated Eval Harnesses for LLM Agents',
    'Shift from Flaky Tests to Deterministic Fixtures',
  ];

  // Generate research brief from input
  const handleGenerateBrief = (customPrompt?: string) => {
    const promptToUse = customPrompt || topicInput || 'Harness Engineering: Fast & Resilient Software Systems';
    setIsGenerating(true);
    setSaveSuccess(false);

    setTimeout(() => {
      if (promptToUse.toLowerCase().includes('harness')) {
        setCurrentBrief({
          ...HARNESS_ENGINEERING_BRIEF,
          savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
        loadHarnessEngineeringPack();
      } else {
        const generated: ResearchBrief = {
          id: `brief_${Date.now()}`,
          topic: promptToUse,
          audience: audienceInput || 'General Audience',
          coreThesis: `In "${promptToUse}", the critical insight lies in replacing manual friction with automated, reproducible verification loops. High-velocity creators and engineers leverage deterministic tools to eliminate production regressions and scale content distribution 10x faster.`,
          hooks: [
            `“Stop debugging in production. Here is how modern architecture changes everything.”`,
            `“If your verification workflow takes 2 hours, you have a tooling bottleneck, not a talent bottleneck.”`,
            `“Why high-velocity teams build deterministic harnesses before writing a single feature.”`,
          ],
          keyBeats: [
            '00:00 - High-contrast hook exposing the bottleneck of manual verification.',
            '00:15 - Demonstration of automated discovery and 9:16 reframing.',
            '00:45 - Live verification proof with zero production regressions.',
            '01:10 - Multi-platform export calibrated for algorithm distribution.',
          ],
          recommendedCut: {
            name: `Curated Cut: ${promptToUse.slice(0, 30)}`,
            start: 15,
            end: 45,
          },
          savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setCurrentBrief(generated);
      }
      setIsGenerating(false);
    }, 400);
  };

  // Phase 6 step 3: Save to Project
  const handleSaveToProject = () => {
    const briefToSave = {
      ...currentBrief,
      savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    saveResearchBrief(briefToSave);
    setCurrentBrief(briefToSave);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-y-auto bg-black p-6 select-none">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#1c1f2a]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                Research & Intelligence
              </span>
              <span className="text-xs text-[#6e7587] font-mono">
                Post-Publishing Insights & Brief Generation
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-normal text-white tracking-tight">
              Content Research & Intelligence
            </h1>
            <p className="text-sm text-[#8c92a4] mt-1 max-w-xl">
              Synthesize footage into actionable briefs, extract viral thesis hooks, and save directly to your project context.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentArea('workspace')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141620] hover:bg-[#1f2230] border border-[#272b3c] text-xs font-medium text-[#c6cdda] hover:text-white transition-colors"
            >
              <Film className="w-3.5 h-3.5 text-emerald-400" />
              <span>Back to Workspace</span>
            </button>
            <button
              onClick={() => setCurrentArea('publish')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141620] hover:bg-[#1f2230] border border-[#272b3c] text-xs font-medium text-[#c6cdda] hover:text-white transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Back to Publish</span>
            </button>
          </div>
        </div>

        {/* Phase 6 Flow: Research Input -> Research Brief -> Save to Project */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (5 cols): STEP 1 — Research Input */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-[#0a0b12] border border-[#1f2436] space-y-4">
              <div className="flex items-center gap-2 text-white">
                <span className="w-6 h-6 rounded-lg bg-[#181d2e] border border-[#2b354e] flex items-center justify-center font-mono text-xs font-bold text-sky-400">
                  1
                </span>
                <h3 className="text-sm font-semibold tracking-tight uppercase tracking-wider text-xs">
                  Research Input
                </h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-[#8d94a6] block mb-1">
                    Research Topic / Thesis Query
                  </label>
                  <textarea
                    rows={3}
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    placeholder="e.g. Extract high-impact thesis points and viral cold opens for technical founders..."
                    className="w-full rounded-xl bg-[#0f111a] border border-[#22273a] px-3.5 py-2.5 text-xs text-white placeholder-[#5a6072] focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#8d94a6] block mb-1">
                    Target Audience Persona
                  </label>
                  <input
                    type="text"
                    value={audienceInput}
                    onChange={(e) => setAudienceInput(e.target.value)}
                    placeholder="e.g. Content Creators, AI Developers, Founders"
                    className="w-full rounded-xl bg-[#0f111a] border border-[#22273a] px-3.5 py-2 text-xs text-white placeholder-[#5a6072] focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>

                {/* Prompt Suggestions */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-mono text-[#6e7587] block">
                    Suggested Angles:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {promptSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setTopicInput(suggestion);
                          handleGenerateBrief(suggestion);
                        }}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-[#121520] hover:bg-[#1a1f30] text-[#8e96aa] hover:text-white border border-[#202638] transition-colors text-left"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <div className="pt-2">
                  <button
                    onClick={() => handleGenerateBrief()}
                    disabled={isGenerating}
                    className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    {isGenerating ? (
                      <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-black fill-current" />
                    )}
                    <span>{isGenerating ? 'Synthesizing Brief...' : 'Generate Research Brief'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): STEP 2 & 3 — Research Brief -> Save to Project */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-2xl bg-[#0a0b12] border border-[#1f2436] space-y-5">
              {/* Step 2 Header & Step 3 Save Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1c2132]">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#181d2e] border border-[#2b354e] flex items-center justify-center font-mono text-xs font-bold text-emerald-400">
                    2
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-white tracking-tight uppercase tracking-wider text-xs">
                      Research Brief
                    </h3>
                    <span className="text-[11px] font-mono text-[#6e7587]">
                      {currentBrief.savedAt ? `Saved to project at ${currentBrief.savedAt}` : 'Synthesized & ready to save'}
                    </span>
                  </div>
                </div>

                {/* STEP 3: Save to Project Button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveToProject}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-md ${
                      saveSuccess
                        ? 'bg-emerald-500 text-black'
                        : 'bg-emerald-400 hover:bg-emerald-300 text-black'
                    }`}
                  >
                    {saveSuccess ? (
                      <>
                        <BookmarkCheck className="w-4 h-4" />
                        <span>Saved to Project!</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-4 h-4" />
                        <span>3. Save to Project</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Brief Content Sections */}
              <div className="space-y-4 text-xs">
                {/* Topic & Audience Persona */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#0f111a] border border-[#1e2334] space-y-1">
                    <span className="text-[10px] uppercase font-mono text-[#6e7587] block">
                      Topic Focus
                    </span>
                    <span className="font-semibold text-white block truncate">
                      {currentBrief.topic}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0f111a] border border-[#1e2334] space-y-1">
                    <span className="text-[10px] uppercase font-mono text-[#6e7587] block">
                      Target Audience
                    </span>
                    <span className="font-semibold text-white block truncate">
                      {currentBrief.audience}
                    </span>
                  </div>
                </div>

                {/* Core Thesis */}
                <div className="p-4 rounded-xl bg-[#0f111a] border border-[#1e2334] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono text-sky-400 font-semibold tracking-wider">
                      Core Thesis Argument
                    </span>
                    <button
                      onClick={() => copyToClipboard(currentBrief.coreThesis, 'thesis')}
                      className="text-[11px] text-[#787f92] hover:text-white flex items-center gap-1"
                    >
                      {copiedKey === 'thesis' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'thesis' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-[#d5dbe8] leading-relaxed">
                    {currentBrief.coreThesis}
                  </p>
                </div>

                {/* High-Impact Hooks */}
                <div className="p-4 rounded-xl bg-[#0f111a] border border-[#1e2334] space-y-2">
                  <span className="text-[10px] uppercase font-mono text-emerald-400 font-semibold tracking-wider block">
                    High-Retention Hook Options
                  </span>
                  <div className="space-y-1.5">
                    {currentBrief.hooks.map((hook, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-[#141724] border border-[#23283c] flex items-start justify-between gap-2 text-xs text-[#c6ccdc]"
                      >
                        <span className="leading-snug">{hook}</span>
                        <button
                          onClick={() => copyToClipboard(hook, `hook_${idx}`)}
                          className="text-[#787f92] hover:text-white shrink-0 mt-0.5"
                        >
                          {copiedKey === `hook_${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Narrative Beats */}
                <div className="p-4 rounded-xl bg-[#0f111a] border border-[#1e2334] space-y-2">
                  <span className="text-[10px] uppercase font-mono text-purple-400 font-semibold tracking-wider block">
                    Sequential Narrative Beats
                  </span>
                  <div className="space-y-1.5">
                    {currentBrief.keyBeats.map((beat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#b8bfd2]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{beat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Cut Action */}
                {currentBrief.recommendedCut && (
                  <div className="p-3.5 rounded-xl bg-[#111624] border border-[#222d4a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-[#8c96b0] block">
                        Recommended Timeline Cut & Platform Pack
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {currentBrief.recommendedCut.name} ({currentBrief.recommendedCut.start}s → {currentBrief.recommendedCut.end}s)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          handleSaveToProject();
                          loadHarnessEngineeringPack();
                          setCurrentArea('publish');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#191f30] hover:bg-[#252d45] text-white text-xs font-medium border border-[#303b5a] flex items-center gap-1.5 transition-all"
                      >
                        <Share2 className="w-3 h-3 text-sky-400" />
                        <span>Shape for All Platforms</span>
                      </button>

                      <button
                        onClick={() => {
                          handleSaveToProject();
                          creatorFlowOperations.applyEdit({
                            name: currentBrief.recommendedCut!.name,
                            start: currentBrief.recommendedCut!.start,
                            end: currentBrief.recommendedCut!.end,
                          });
                          creatorFlowOperations.changeAspectRatio('9:16');
                          creatorFlowOperations.toggleCaptions(true);
                          setCurrentArea('workspace');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <Film className="w-3 h-3 text-black" />
                        <span>Apply to Workspace</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
