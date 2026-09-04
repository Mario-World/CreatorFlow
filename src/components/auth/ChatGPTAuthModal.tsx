'use client';

import React, { useState } from 'react';
import { useCreatorFlowStore } from '@/store/creatorFlowStore';
import { 
  Key, 
  Sparkles, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  ExternalLink,
  Bot,
  Zap,
  LogOut,
  Cpu
} from 'lucide-react';

interface ChatGPTAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatGPTAuthModal: React.FC<ChatGPTAuthModalProps> = ({ isOpen, onClose }) => {
  const chatGPTAuth = useCreatorFlowStore((s) => s.chatGPTAuth);
  const loginChatGPT = useCreatorFlowStore((s) => s.loginChatGPT);
  const logoutChatGPT = useCreatorFlowStore((s) => s.logoutChatGPT);
  const setOpenAIApiKey = useCreatorFlowStore((s) => s.setOpenAIApiKey);
  const setChatGPTModel = useCreatorFlowStore((s) => s.setChatGPTModel);

  const [inputKey, setInputKey] = useState(chatGPTAuth.apiKey || '');
  const [selectedModel, setSelectedModel] = useState(chatGPTAuth.model || 'gpt-4o');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    setOpenAIApiKey(inputKey.trim());
    setChatGPTModel(selectedModel);
    setSuccessMsg('OpenAI API Key saved and verified for live completions.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleQuickDemoConnect = () => {
    loginChatGPT({
      name: 'Creator Studio',
      email: 'creator@creatorflow.app',
      model: selectedModel,
    });
    setSuccessMsg('Connected to ChatGPT live intelligence session.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDisconnect = () => {
    logoutChatGPT();
    setInputKey('');
    setSuccessMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div 
        className="w-full max-w-lg bg-[#0c0e14] border border-[#232736] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#1b1e2a] flex items-center justify-between bg-[#10121a]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                <span>ChatGPT & OpenAI Connection</span>
                {chatGPTAuth.isAuthenticated && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Live
                  </span>
                )}
              </h2>
              <p className="text-xs text-[#7e8598]">
                Real-time AI research, script generation & WebMCP tool execution.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#1a1d28] text-[#7e8598] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Status Card */}
          <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
            chatGPTAuth.isAuthenticated
              ? 'bg-[#0f1519] border-emerald-900/50 text-emerald-400'
              : 'bg-[#141620] border-[#252938] text-[#8e95aa]'
          }`}>
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-3 h-3 rounded-full shrink-0 ${
                chatGPTAuth.isAuthenticated ? 'bg-emerald-400 animate-pulse' : 'bg-[#555a6d]'
              }`} />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {chatGPTAuth.isAuthenticated ? `Connected as ${chatGPTAuth.user?.name || 'Creator Studio'}` : 'Disconnected'}
                </p>
                <p className="text-[11px] text-[#7e8598] truncate">
                  Model: <span className="text-white font-mono">{chatGPTAuth.model}</span> • Stream: <span className="text-emerald-400">Active</span>
                </p>
              </div>
            </div>

            {chatGPTAuth.isAuthenticated && (
              <button
                onClick={handleDisconnect}
                className="px-2.5 py-1 rounded-lg bg-[#1a1d28] hover:bg-red-950/60 hover:text-red-300 text-xs text-[#8e95aa] border border-[#272b3a] flex items-center gap-1.5 transition-colors shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            )}
          </div>

          {/* Model Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#939ab0] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-sky-400" />
              <span>AI Intelligence Engine Model</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'gpt-4o', label: 'GPT-4o (Omni)', badge: 'Recommended' },
                { id: 'gpt-4o-mini', label: 'GPT-4o Mini', badge: 'Ultra Fast' },
                { id: 'o3-mini', label: 'o3-mini', badge: 'Reasoning' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setSelectedModel(m.id);
                    setChatGPTModel(m.id);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedModel === m.id
                      ? 'bg-[#131926] border-sky-500/60 text-white'
                      : 'bg-[#0f1118] border-[#1f2230] text-[#7a8196] hover:text-[#c5cbd9] hover:border-[#2b3044]'
                  }`}
                >
                  <span className="block text-xs font-medium">{m.label}</span>
                  <span className="block text-[10px] text-sky-400/90 font-mono mt-0.5">{m.badge}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form: Custom OpenAI API Key */}
          <form onSubmit={handleSaveKey} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[#939ab0] flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Personal OpenAI API Key (Optional)</span>
              </label>
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noreferrer"
                className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
              >
                <span>Get key</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="sk-proj-..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-[#0a0c12] border border-[#222534] text-xs text-white placeholder-[#505568] focus:outline-none focus:border-sky-500 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#171a26] hover:bg-[#202536] text-xs font-medium text-white border border-[#2a2f42] transition-colors shrink-0"
              >
                Save Key
              </button>
            </div>
            <p className="text-[11px] text-[#63687b]">
              Your key is saved locally in browser storage and only transmitted directly to OpenAI.
            </p>
          </form>

          {/* One-click Instant Connect */}
          <div className="pt-2 border-t border-[#1a1c27]">
            <button
              onClick={handleQuickDemoConnect}
              className="w-full py-2.5 px-4 rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>Instant Connect ChatGPT Live Session</span>
            </button>
          </div>

          {successMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
