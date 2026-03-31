'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, X, Send, Bot, User, Minimize2,
  RotateCcw, Sparkles,
} from 'lucide-react';

interface Message { role: 'user' | 'assistant'; content: string; ts: number; }

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Unique session ID per browser
function getSessionId() {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('chat_session_id');
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem('chat_session_id', id);
  }
  return id;
}

const SUGGESTIONS = [
  'What can you build?',
  'Tell me about your projects',
  'How can I hire you?',
  'What tech do you use?',
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="w-2 h-2 rounded-full bg-cyan-400"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
      ))}
    </div>
  );
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatWidget() {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [unread,   setUnread]   = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // Restore chat history from server
  useEffect(() => {
    const sessionId = getSessionId();
    fetch(`${API}/chat/session/${sessionId}`)
      .then(r => r.json())
      .then(d => {
        if (d.messages?.length) {
          setMessages(d.messages.map((m: {role: string; content: string; timestamp: string}) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
            ts: new Date(m.timestamp).getTime(),
          })));
        }
      })
      .catch(() => {});
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setUnread(0);
    }
  }, [open]);

  const sendMessage = useCallback(async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;

    const userMsg: Message = { role: 'user', content, ts: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/chat`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: content, sessionId: getSessionId() }),
      });
      const data = await res.json();
      const botMsg: Message = {
        role:    'assistant',
        content: data.success ? data.reply : "Sorry, I'm having trouble right now. Please try again!",
        ts: Date.now(),
      };
      setMessages(prev => [...prev, botMsg]);
      if (!open) setUnread(u => u + 1);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Oops! I'm offline right now. Please contact Ashutosh directly through the contact page.",
        ts: Date.now(),
      }]);
    } finally {
      setLoading(false);
    }
  }, [loading, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => {
    localStorage.removeItem('chat_session_id');
    setMessages([]);
    setUnread(0);
  };

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.85, y: 20  }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-4 md:right-6 z-50 w-[calc(100vw-32px)] max-w-sm h-[520px] flex flex-col glass rounded-2xl border border-cyan-400/20 overflow-hidden"
            style={{ boxShadow: '0 0 40px rgba(0,212,255,0.15), 0 25px 50px rgba(0,0,0,0.5)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-cyan-400/10 to-purple-500/10 border-b border-[#1a1a2e] shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                    <Bot size={18} className="text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#080810]" />
                </div>
                <div>
                  <p className="text-light text-sm font-bold leading-none">Ash AI</p>
                  <p className="text-green-400 text-xs mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full" /> Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={clearChat} title="New conversation"
                  className="p-1.5 rounded-lg text-muted hover:text-light hover:bg-white/5 transition-colors">
                  <RotateCcw size={14} />
                </button>
                <button onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-muted hover:text-light hover:bg-white/5 transition-colors">
                  <Minimize2 size={14} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
              {/* Welcome message */}
              {messages.length === 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot size={13} className="text-white" />
                    </div>
                    <div className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                      <p className="text-light text-sm leading-relaxed">
                        👋 Hi! I'm <span className="text-cyan-400 font-semibold">Ash AI</span>, Ashutosh's assistant.<br />
                        I can answer questions about his skills, projects, and how to work with him!
                      </p>
                    </div>
                  </div>

                  {/* Quick suggestion chips */}
                  <div className="flex flex-wrap gap-2 mt-4 ml-9">
                    {SUGGESTIONS.map(s => (
                      <button key={s} onClick={() => sendMessage(s)}
                        className="text-xs px-3 py-1.5 rounded-full border border-cyan-400/20 text-cyan-400 hover:bg-cyan-400/10 transition-colors">
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Message list */}
              {messages.map((msg, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mb-1 ${
                    msg.role === 'assistant'
                      ? 'bg-gradient-to-br from-cyan-400 to-purple-500'
                      : 'bg-[#1a1a2e] border border-[#2a2a3e]'
                  }`}>
                    {msg.role === 'assistant'
                      ? <Bot size={12} className="text-white" />
                      : <User size={12} className="text-muted" />
                    }
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-cyan-400 to-cyan-500 text-white font-medium rounded-br-sm'
                        : 'bg-[#0f0f1a] border border-[#1a1a2e] text-light rounded-bl-sm'
                    }`}>
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-muted px-1">{formatTime(msg.ts)}</span>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-end gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shrink-0">
                    <Bot size={12} className="text-white" />
                  </div>
                  <div className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-2xl rounded-bl-sm">
                    <TypingDots />
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit}
              className="flex items-center gap-2 p-3 border-t border-[#1a1a2e] bg-[#080810] shrink-0">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={loading}
                className="flex-1 bg-[#0f0f1a] border border-[#1a1a2e] rounded-xl px-4 py-2.5 text-light text-sm placeholder:text-muted/50 focus:outline-none focus:border-cyan-400/40 transition-all disabled:opacity-50"
              />
              <button type="submit" disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-white disabled:opacity-40 hover:scale-105 transition-all shrink-0">
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bubble Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-4 md:right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-white"
        style={{ boxShadow: '0 0 30px rgba(0,212,255,0.4), 0 8px 25px rgba(0,0,0,0.4)' }}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle size={22} />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Pulse ring */}
        {!open && (
          <motion.div
            className="absolute inset-0 rounded-2xl bg-cyan-400/30"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        {/* Unread badge */}
        {unread > 0 && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </motion.button>
    </>
  );
}
