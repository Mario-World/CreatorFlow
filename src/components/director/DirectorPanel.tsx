'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCreatorFlowStore } from '@/store/creatorFlowStore';
import { creatorFlowOperations } from '@/domain/operations';
import { WebMCPActivityPanel } from '@/components/webmcp/WebMCPActivityPanel';
import { initWebMCP, executeWebMCPTool } from '@/lib/webmcp';
import { generateChatGptCompletion, ChatMessage } from '@/lib/openai';
import { 
  Bot, 
  Sparkles, 
  ArrowRight, 
  Activity, 
  Check, 
  X, 
  Send,
  User,
  Zap,
  MessageSquare,
  Flame,
  FileSearch,
  Share2,
  Film,
  RotateCcw
} from 'lucide-react';

export const DirectorPanel: React.FC = () => {
  const directorOpen = useCreatorFlowStore((s) => s.directorOpen);
  const agentActivity = useCreatorFlowStore((s) => s.agentActivity);
  const proposedEdit = useCreatorFlowStore((s) => s.proposedEdit);
  const project = useCreatorFlowStore((s) => s.project);
  const chatGPTAuth = useCreatorFlowStore((s) => s.chatGPTAuth);
  const loadHarnessEngineeringPack = useCreatorFlowStore((s) => s.loadHarnessEngineeringPack);
  const setCurrentArea = useCreatorFlowStore((s) => s.setCurrentArea);

  const [activeTab, setActiveTab] = useState<'chat' | 'trace'>('chat');
  const [intentInput, setIntentInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Live Chat Conversation History
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      role: 'assistant',
      content: `Hello! I am Director, connected live with **ChatGPT (${chatGPTAuth.model})**.

I am ready to help you process your original **2:07 vertical video** on **"How to Fine-tune a Model Without Code"**:
• Find the strongest 30 seconds (00:18 → 00:48) and prepare it as a short
• Prepare tailored post copy for **LinkedIn**
• Save the core idea as a **Research Brief**
• Full reversible **Undo/Redo** via WebMCP

What outcome should we execute?`,
      timestamp: 'Just now',
      toolsUsed: ['openai.gpt-4o', 'webmcp.ready'],
    },
  ]);

  useEffect(() => {
    initWebMCP();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isRunning]);

  if (!directorOpen) return null;

  const quickPrompts = [
    { label: 'Make this a strong short', icon: <Film className="w-3 h-3 text-emerald-400" /> },
    { label: 'Prepare this for LinkedIn.', icon: <Share2 className="w-3 h-3 text-sky-400" /> },
    { label: 'Undo that.', icon: <RotateCcw className="w-3 h-3 text-amber-400" /> },
    { label: 'Save the key idea from this content as a research brief.', icon: <FileSearch className="w-3 h-3 text-purple-400" /> },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || intentInput).trim();
    if (!text || isRunning) return;

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIntentInput('');
    setIsRunning(true);

    try {
      // 1. Run domain operation or WebMCP tool if matching
      const lower = text.toLowerCase();
      if (
        (lower.includes('strong') || lower.includes('strongest') || lower.includes('30s') || lower.includes('30 seconds') || lower.includes('short')) &&
        !lower.includes('linkedin')
      ) {
        await creatorFlowOperations.proposeStrongestShort();
      } else if (lower.includes('linkedin')) {
        await executeWebMCPTool('prepare_for_platform', { platform: 'linkedin' });
        useCreatorFlowStore.getState().setCurrentPlatform('linkedin');
      } else if (lower.includes('undo')) {
        await creatorFlowOperations.undoAIAction();
      } else if (lower.includes('research') || lower.includes('brief') || lower.includes('save') || lower.includes('key idea')) {
        await executeWebMCPTool('save_research_brief', {
          topic: 'How to Fine-tune a Model Without Code',
          audience: 'Non-technical founders, operators, product managers & creators',
          coreThesis: 'Fine-tuning custom AI models today requires zero code: curated domain datasets create defensible moats without writing Python or managing GPU clusters.',
          hooks: [
            '“You do not need a machine learning degree to fine-tune high-performance models.”',
            '“Proprietary data is your moat—no-code training tools handle the rest.”',
          ],
          keyBeats: [
            '00:00 - The Misconception: AI fine-tuning requires deep ML code',
            '00:18 - The Reality: Zero-code fine-tuning is accessible today',
            '00:48 - The Workflow: Curating datasets and automating training',
          ],
        });
      } else if (lower.includes('x') || lower.includes('twitter') || lower.includes('thread')) {
        await executeWebMCPTool('prepare_for_platform', { platform: 'x' });
        useCreatorFlowStore.getState().setCurrentPlatform('x');
      }

      // 2. Query ChatGPT live completion
      const aiResponse = await generateChatGptCompletion({
        prompt: text,
        conversationHistory: messages,
        apiKey: chatGPTAuth.apiKey,
        model: chatGPTAuth.model,
        topic: 'How to Fine-tune a Model Without Code',
      });

      const assistantMsg: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        role: 'assistant',
        content: aiResponse.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolsUsed: aiResponse.toolsInvoked,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Director intent failed:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleApplyAction = async (actionType: string) => {
    if (actionType === 'cut') {
      await creatorFlowOperations.proposeStrongestShort();
      setCurrentArea('workspace');
    } else if (actionType === 'publish') {
      setCurrentArea('publish');
    } else if (actionType === 'research') {
      setCurrentArea('workspace');
    }
  };

  return (
    <>
      {/* Mobile/Tablet Backdrop */}
      <div 
        onClick={() => useCreatorFlowStore.getState().toggleDirector()}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
      />

      <aside className="fixed right-0 top-14 bottom-0 z-50 w-full sm:w-96 lg:static lg:w-84 xl:w-96 border-l border-[#1c1f2b] bg-[#07080c] flex flex-col h-[calc(100vh-3.5rem)] lg:h-full shrink-0 select-none shadow-2xl lg:shadow-none">
        {/* Header */}
        <div className="p-3.5 border-b border-[#1a1d28] bg-[#0b0d13]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-white tracking-tight flex items-center gap-1.5">
                  <span>Director Copilot</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-900/60">
                    {chatGPTAuth.model}
                  </span>
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#11141e] text-[10px] text-emerald-400 font-mono border border-emerald-900/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
              <button
                type="button"
                onClick={() => useCreatorFlowStore.getState().toggleDirector()}
                className="p-1 rounded-lg hover:bg-[#1a1c28] text-[#8e95aa] hover:text-white lg:hidden"
                title="Close Director"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Subtabs */}
          <div className="flex items-center gap-1 bg-[#10131d] p-0.5 rounded-lg border border-[#1f2332]">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-1 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'chat'
                  ? 'bg-[#1e2333] text-white shadow-xs'
                  : 'text-[#7e8598] hover:text-[#c4cad8]'
              }`}
            >
              <MessageSquare className="w-3 h-3" />
              <span>Real-Time Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('trace')}
              className={`flex-1 py-1 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'trace'
                  ? 'bg-[#1e2333] text-white shadow-xs'
                  : 'text-[#7e8598] hover:text-[#c4cad8]'
              }`}
            >
              <Activity className="w-3 h-3" />
              <span>Actions & Logs ({agentActivity.length})</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
          {/* PROPOSED EDIT CARD (Visible across tabs when awaiting review) */}
          {proposedEdit && (
            <div className="p-3.5 rounded-xl bg-[#0d1217] border border-emerald-500/50 shadow-xl space-y-2.5 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-emerald-400 bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-800/60">
                  PROPOSED EDIT
                </span>
                <span className="text-[11px] font-mono text-[#788094]">
                  Awaiting Approval
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="text-[10px] uppercase font-mono text-[#828a9e]">Source</div>
                  <div className="text-sm font-bold text-white font-mono mt-0.5">
                    {proposedEdit.startFormatted} — {proposedEdit.endFormatted}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-[#828a9e]">Format</div>
                  <div className="font-semibold text-white mt-0.5">
                    {proposedEdit.aspectRatio} Vertical
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-[#828a9e]">Captions</div>
                  <div className="text-emerald-400 font-medium mt-0.5">
                    {proposedEdit.captions ? 'Recommended' : 'Off'}
                  </div>
                </div>
              </div>

              {/* Approve / Reject Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#1a231f]">
                <button
                  onClick={() => creatorFlowOperations.rejectProposedEdit()}
                  className="w-full py-2 px-3 rounded-lg bg-[#141620] hover:bg-[#1f2230] text-[#a2a8ba] hover:text-white text-xs font-medium border border-[#242838] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => creatorFlowOperations.approveProposedEdit()}
                  className="w-full py-2 px-3 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve Edit</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'chat' ? (
            <div className="space-y-3">
              {/* Quick Prompt Chips */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#63687b] block">
                  Quick Prompts (Demo Story)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {quickPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(p.label)}
                      disabled={isRunning}
                      className="px-2.5 py-1 rounded-lg bg-[#0e111a] hover:bg-[#151926] border border-[#1d2130] hover:border-[#31374d] text-[11px] text-[#b4bac9] hover:text-white flex items-center gap-1.5 transition-all text-left"
                    >
                      {p.icon}
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="space-y-2.5 pt-1">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-[10px] text-[#63697d] mb-1 font-mono">
                      {msg.role === 'user' ? (
                        <>
                          <span>You</span>
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                        </>
                      ) : (
                        <>
                          <Bot className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">ChatGPT</span>
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                        </>
                      )}
                    </div>

                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[95%] space-y-1.5 ${
                        msg.role === 'user'
                          ? 'bg-[#1b2234] text-white border border-[#2b354f] rounded-tr-sm'
                          : 'bg-[#0e1017] text-[#cfd5e4] border border-[#1b1e2a] rounded-tl-sm'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>

                      {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1 border-t border-[#1a1c26]">
                          {msg.toolsUsed.map((t, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.2 rounded bg-emerald-950/70 text-emerald-400 text-[9px] font-mono border border-emerald-900/40"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isRunning && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0e1017] border border-[#1c1f2b] text-xs text-[#8e95aa]">
                    <span className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin shrink-0" />
                    <span className="font-mono text-[11px]">ChatGPT is researching & reasoning...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          ) : (
            /* Tab 2: Activity Trace & Log */
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#7e8598]">
                <span>Logged State Mutations</span>
                <span className="font-mono">{agentActivity.length} items</span>
              </div>
              <div className="space-y-2">
                {agentActivity.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 rounded-xl bg-[#0c0d14] border border-[#1b1e2a] space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-900/50">
                        {act.tool}
                      </span>
                      <span className="text-[#5b6173] text-[10px]">{act.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#d3d8e5] font-medium leading-snug">
                      {act.action}
                    </p>
                    {act.details && (
                      <p className="text-[11px] text-[#787f92] leading-tight">
                        {act.details}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input Bar (in Chat tab) */}
        {activeTab === 'chat' && (
          <div className="p-3 border-t border-[#1a1d28] bg-[#090a10]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={intentInput}
                onChange={(e) => setIntentInput(e.target.value)}
                placeholder="Ask about Harness Engineering or request an edit cut..."
                disabled={isRunning}
                className="flex-1 px-3 py-2 rounded-xl bg-[#0e1018] border border-[#212534] text-xs text-white placeholder-[#505668] focus:outline-none focus:border-emerald-500 transition-all"
              />
              <button
                type="submit"
                disabled={!intentInput.trim() || isRunning}
                className={`p-2 rounded-xl transition-all ${
                  intentInput.trim() && !isRunning
                    ? 'bg-white text-black hover:bg-neutral-200 shadow-sm'
                    : 'bg-[#141622] text-[#4d5366] border border-[#212433] cursor-not-allowed'
                }`}
                title="Send to ChatGPT"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* WebMCP Activity Expandable Panel at bottom */}
        <WebMCPActivityPanel />
      </aside>
    </>
  );
};
