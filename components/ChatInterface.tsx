import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Zap, Activity, Database, Terminal, Sparkles, Cpu, Wifi, ShieldCheck, Play, Radio } from 'lucide-react';
import { Message } from '../types';
import { sendMessageToZynt, initChat } from '../services/geminiService';

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: 'Zynt Core v1.0 inicializado. \nConexão segura estabelecida. \n\nEstou pronta para analisar suas métricas, revisar contingência ou escalar campanhas.',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [systemLogs, setSystemLogs] = useState<string[]>([
    "> SYSTEM_INIT...", 
    "> MODULE_TIKTOK_API: LOADED",
    "> PROXY_CHAIN: ESTABLISHED"
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initChat();
    // Simulate live logs
    const interval = setInterval(() => {
      const logs = [
        "> PING_CHECK: 12ms",
        "> SYNC_DATALAYER...",
        "> CHECKING_POLICY_UPDATES...",
        "> MEMORY_OPTIMIZATION: OK",
        "> SCANNING_USER_AGENT...",
        "> ENCRYPTION_KEY: ROTATING"
      ];
      const randomLog = logs[Math.floor(Math.random() * logs.length)];
      setSystemLogs(prev => [...prev.slice(-8), randomLog]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [systemLogs]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setSystemLogs(prev => [...prev, `> INPUT_RECEIVED: ${text.substring(0, 15)}...`, "> PROCESSING_NEURAL_REQUEST..."]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToZynt(userMsg.content);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setSystemLogs(prev => [...prev, "> RESPONSE_GENERATED", "> OUTPUT_RENDERED"]);
    } catch (error) {
        console.error(error);
        setSystemLogs(prev => [...prev, "> ERROR: CONNECTION_LOST"]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "Escalar CBO ou ABO?",
    "Analisar ROI atual",
    "Blindagem de Pixel",
    "Evitar Ban no TikTok"
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#080808] border border-[#1F1F1F] rounded-xl overflow-hidden relative shadow-2xl">
      
      {/* GLOBAL FX */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-10" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(18, 18, 18, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
             backgroundSize: '100% 2px, 3px 100%'
           }}>
      </div>

      {/* LEFT: MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col relative z-10 border-r border-[#1F1F1F]">
        
        {/* HEADER */}
        <div className="h-14 border-b border-[#1F1F1F] bg-[#0c0c0c]/90 backdrop-blur-md flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#A1E432] rounded-full animate-pulse shadow-[0_0_10px_#A1E432]"></div>
            <h3 className="font-bold text-white tracking-widest font-mono text-sm">ZYNT<span className="text-[#A1E432]">_OS</span> v2.4.0</h3>
          </div>
          <div className="flex items-center gap-4 text-[#8A8A8A] text-xs font-mono">
             <span className="flex items-center gap-1"><Wifi className="w-3 h-3" /> SECURE_LINK</span>
             <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> ENCRYPTED</span>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-[#1F1F1F] scrollbar-track-transparent bg-[#080808]">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}>
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border 
                 ${msg.role === 'user' ? 'bg-[#121212] border-[#333]' : 'bg-[#1A2414] border-[#A1E432]/30 shadow-[0_0_15px_rgba(161,228,50,0.1)]'}`}>
                 {msg.role === 'user' ? <User className="w-5 h-5 text-gray-400" /> : <Bot className="w-5 h-5 text-[#A1E432]" />}
              </div>

              {/* Message Content */}
              <div className={`max-w-[80%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] text-[#444] font-mono mb-1 uppercase tracking-widest">
                  {msg.role === 'user' ? 'Media_Buyer::Admin' : 'Zynt_Core::AI'}
                </span>
                <div className={`
                  p-4 rounded-lg text-sm relative overflow-hidden group
                  ${msg.role === 'user' 
                    ? 'bg-[#121212] border border-[#1F1F1F] text-gray-200' 
                    : 'bg-[#0c0c0c] border border-[#A1E432]/20 text-[#E0E0E0] shadow-[0_4px_20px_-5px_rgba(0,0,0,0.5)]'
                  }
                `}>
                  {/* Decorative corner for AI */}
                  {msg.role === 'model' && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#A1E432] opacity-50"></div>
                  )}
                  <div className="whitespace-pre-wrap font-sans leading-relaxed relative z-10">
                    {msg.content}
                  </div>
                  {/* Hover Glitch Effect */}
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4">
               <div className="w-10 h-10 rounded-lg bg-[#1A2414] border border-[#A1E432]/30 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#A1E432]" />
               </div>
               <div className="bg-[#0c0c0c] border border-[#1F1F1F] p-4 rounded-lg flex items-center gap-3">
                 <Loader2 className="w-4 h-4 text-[#A1E432] animate-spin" />
                 <span className="text-xs text-[#A1E432] font-mono animate-pulse">GENERATING_RESPONSE...</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className="p-4 bg-[#0c0c0c] border-t border-[#1F1F1F]">
          {messages.length < 3 && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-none">
              {suggestions.map((s, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(s)}
                  className="px-3 py-1 bg-[#121212] border border-[#1F1F1F] hover:border-[#A1E432] hover:text-[#A1E432] rounded text-xs text-[#8A8A8A] transition-all font-mono"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-2 bg-[#080808] border border-[#333] rounded-lg p-2 focus-within:border-[#A1E432] focus-within:shadow-[0_0_15px_rgba(161,228,50,0.1)] transition-all">
            <span className="text-[#A1E432] font-mono pl-2 text-sm select-none">root@zynt:~$</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-transparent text-white focus:outline-none font-mono text-sm py-1"
              autoComplete="off"
              disabled={isLoading}
              autoFocus
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="p-2 bg-[#1A2414] hover:bg-[#A1E432] text-[#A1E432] hover:text-black rounded transition-colors disabled:opacity-50"
            >
              {isLoading ? <Radio className="w-4 h-4 animate-pulse" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: SYSTEM PANEL (DIAGNOSTICS) */}
      <div className="hidden lg:flex w-72 flex-col bg-[#050505] border-l border-[#1F1F1F] relative z-20">
        
        {/* PANEL HEADER */}
        <div className="h-14 border-b border-[#1F1F1F] flex items-center justify-center">
           <h4 className="text-[#8A8A8A] font-mono text-xs tracking-[0.2em] uppercase">System_Diagnostics</h4>
        </div>

        {/* MODULES */}
        <div className="p-4 space-y-6">
          
          {/* Status Monitor */}
          <div className="space-y-3">
             <div className="flex justify-between text-xs text-[#8A8A8A] font-mono">
               <span>CPU_LOAD</span>
               <span className="text-[#A1E432]">34%</span>
             </div>
             <div className="h-1 bg-[#1F1F1F] rounded-full overflow-hidden">
                <div className="h-full bg-[#A1E432] w-[34%] animate-pulse"></div>
             </div>
             
             <div className="flex justify-between text-xs text-[#8A8A8A] font-mono">
               <span>MEMORY_ALLOC</span>
               <span className="text-[#A1E432]">62%</span>
             </div>
             <div className="h-1 bg-[#1F1F1F] rounded-full overflow-hidden">
                <div className="h-full bg-[#A1E432] w-[62%]"></div>
             </div>
          </div>

          {/* Active Modules */}
          <div className="bg-[#0c0c0c] border border-[#1F1F1F] rounded-lg p-3">
             <h5 className="text-[10px] text-[#444] font-bold uppercase mb-3 flex items-center gap-2">
               <Cpu className="w-3 h-3" /> Active Modules
             </h5>
             <div className="space-y-2">
                {['TikTok_API_v2', 'Gemini_1.5_Flash', 'Pattern_Recognition', 'User_Agent_Filter'].map((mod, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#A1E432]"></div>
                     {mod}
                  </div>
                ))}
             </div>
          </div>

          {/* Live Logs */}
          <div className="flex-1 flex flex-col">
            <h5 className="text-[10px] text-[#444] font-bold uppercase mb-2 flex items-center gap-2">
               <Terminal className="w-3 h-3" /> Live Logs
            </h5>
            <div className="flex-1 h-48 bg-[#080808] border border-[#1F1F1F] rounded-lg p-2 font-mono text-[10px] text-[#A1E432]/70 overflow-hidden relative">
               <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[#080808] to-transparent pointer-events-none"></div>
               <div className="h-full overflow-y-auto scrollbar-none space-y-1 pb-4">
                  {systemLogs.map((log, i) => (
                    <p key={i} className="opacity-80 hover:opacity-100 transition-opacity">{log}</p>
                  ))}
                  <div ref={logsEndRef}></div>
               </div>
               <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#080808] to-transparent pointer-events-none"></div>
            </div>
          </div>

        </div>

        {/* FOOTER DECORATION */}
        <div className="mt-auto p-4 border-t border-[#1F1F1F]">
           <div className="flex justify-between items-center text-[10px] text-[#444] font-mono">
              <span>UPTIME: 42h 12m</span>
              <Activity className="w-3 h-3 text-[#A1E432]" />
           </div>
        </div>

      </div>
    </div>
  );
};
