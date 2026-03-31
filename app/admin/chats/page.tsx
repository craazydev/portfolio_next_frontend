'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, User, Search, Star, StarOff, Trash2,
  MessageSquare, Clock, Loader2, ChevronLeft,
} from 'lucide-react';

interface SessionMeta {
  _id: string; sessionId: string; title: string; messageCount: number;
  lastMessage: string; read: boolean; starred: boolean; createdAt: string; ip?: string;
}
interface Message { role: 'user' | 'assistant'; content: string; timestamp: string; }
interface SessionFull extends SessionMeta { messages: Message[]; }

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
function token() { return typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : ''; }
function relTime(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  if (diff < 60000)   return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000)return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function AdminChats() {
  const router   = useRouter();
  const [sessions,  setSessions]  = useState<SessionMeta[]>([]);
  const [active,    setActive]    = useState<SessionFull | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [chatLoad,  setChatLoad]  = useState(false);
  const [search,    setSearch]    = useState('');
  const [showList,  setShowList]  = useState(true); // mobile toggle
  const bottomRef = useRef<HTMLDivElement>(null);
  const headers   = { Authorization: `Bearer ${token()}` };

  useEffect(() => {
    if (!token()) { router.push('/admin'); return; }
    fetchSessions();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [active?.messages]);

  async function fetchSessions() {
    setLoading(true);
    try {
      const r = await fetch(`${API}/chats`, { headers });
      const d = await r.json();
      setSessions(d.data ?? []);
    } finally { setLoading(false); }
  }

  async function openSession(s: SessionMeta) {
    setChatLoad(true);
    setShowList(false);
    try {
      const r = await fetch(`${API}/chats/${s.sessionId}`, { headers });
      const d = await r.json();
      setActive(d.data);
      setSessions(prev => prev.map(x => x.sessionId === s.sessionId ? { ...x, read: true } : x));
    } finally { setChatLoad(false); }
  }

  async function toggleStar(s: SessionMeta, e: React.MouseEvent) {
    e.stopPropagation();
    await fetch(`${API}/chats/${s.sessionId}/star`, { method: 'PATCH', headers });
    setSessions(prev => prev.map(x => x.sessionId === s.sessionId ? { ...x, starred: !x.starred } : x));
    if (active?.sessionId === s.sessionId) setActive(a => a ? { ...a, starred: !a.starred } : a);
  }

  async function deleteSession(s: SessionMeta, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm('Delete this conversation?')) return;
    await fetch(`${API}/chats/${s.sessionId}`, { method: 'DELETE', headers });
    setSessions(prev => prev.filter(x => x.sessionId !== s.sessionId));
    if (active?.sessionId === s.sessionId) { setActive(null); setShowList(true); }
  }

  const filtered = sessions.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.sessionId.toLowerCase().includes(search.toLowerCase())
  );

  const unreadCount = sessions.filter(s => !s.read).length;

  return (
    <div className="flex h-screen bg-[#080810] overflow-hidden">

      {/* ── LEFT: Session List ─────────────────────────────── */}
      <div className={`${showList ? 'flex' : 'hidden md:flex'} flex-col w-full md:w-80 lg:w-96 border-r border-[#1a1a2e] shrink-0 bg-[#0a0a14]`}>

        {/* Header */}
        <div className="px-4 py-4 border-b border-[#1a1a2e]">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-light font-black text-lg">Conversations</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-mono">
                {unreadCount} unread
              </span>
            )}
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-[#080810] border border-[#1a1a2e] rounded-xl pl-9 pr-4 py-2 text-light text-sm placeholder:text-muted/50 focus:outline-none focus:border-cyan-400/30 transition-all" />
          </div>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 size={20} className="text-cyan-400 animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted">
              <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">{search ? 'No results' : 'No conversations yet'}</p>
            </div>
          ) : (
            filtered.map(s => (
              <motion.button key={s.sessionId} onClick={() => openSession(s)} layout
                className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors border-b border-[#1a1a2e]/50 group hover:bg-white/3 ${
                  active?.sessionId === s.sessionId ? 'bg-cyan-400/5 border-l-2 border-l-cyan-400' : ''
                }`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  s.read ? 'bg-[#1a1a2e]' : 'bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border border-cyan-400/20'
                }`}>
                  <User size={18} className={s.read ? 'text-muted' : 'text-cyan-400'} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className={`text-sm truncate ${s.read ? 'text-muted font-normal' : 'text-light font-semibold'}`}>
                      {s.title}
                    </p>
                    <span className="text-[10px] text-muted shrink-0 ml-2">{relTime(s.lastMessage)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted truncate font-mono">{s.sessionId.substring(0, 20)}...</p>
                    <div className="flex items-center gap-1 shrink-0 ml-1">
                      {!s.read && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                      <span className="text-[10px] text-muted">{s.messageCount} msgs</span>
                    </div>
                  </div>
                </div>

                {/* Hover actions */}
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => toggleStar(s, e)} className="p-1 rounded text-muted hover:text-yellow-400 transition-colors">
                    {s.starred ? <Star size={13} fill="currentColor" className="text-yellow-400" /> : <StarOff size={13} />}
                  </button>
                  <button onClick={(e) => deleteSession(s, e)} className="p-1 rounded text-muted hover:text-red-400 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </motion.button>
            ))
          )}
        </div>
      </div>

      {/* ── RIGHT: Conversation View ─────────────────────── */}
      <div className={`${!showList ? 'flex' : 'hidden md:flex'} flex-1 flex-col min-w-0`}>
        {!active ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted">
            <MessageSquare size={48} className="mb-4 opacity-20" />
            <p className="text-sm">Select a conversation to view</p>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[#1a1a2e] bg-[#0a0a14] shrink-0">
              <button onClick={() => setShowList(true)} className="md:hidden p-1.5 rounded-lg text-muted hover:text-light">
                <ChevronLeft size={18} />
              </button>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border border-cyan-400/20 flex items-center justify-center">
                <User size={17} className="text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-light text-sm font-semibold truncate">{active.title}</p>
                <p className="text-muted text-xs font-mono truncate">
                  {active.sessionId} {active.ip ? `· ${active.ip}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { const s = sessions.find(x => x.sessionId === active.sessionId); if (s) toggleStar(s, e); }}
                  className="p-2 rounded-lg glass border border-[#1a1a2e] text-muted hover:text-yellow-400 transition-colors">
                  {active.starred ? <Star size={14} fill="currentColor" className="text-yellow-400" /> : <StarOff size={14} />}
                </button>
                <span className="text-xs text-muted border border-[#1a1a2e] px-2 py-1 rounded-lg">
                  {active.messageCount} messages
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#080810]"
              style={{ backgroundImage: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,212,255,0.03) 0%, transparent 60%)" }}>

              {chatLoad ? (
                <div className="flex justify-center py-12"><Loader2 size={20} className="text-cyan-400 animate-spin" /></div>
              ) : (
                <>
                  {/* Date badge */}
                  <div className="text-center">
                    <span className="text-xs text-muted bg-[#0f0f1a] border border-[#1a1a2e] px-3 py-1 rounded-full">
                      {new Date(active.createdAt).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                  </div>

                  {active.messages.map((msg, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      className={`flex items-end gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mb-1 ${
                        msg.role === 'assistant'
                          ? 'bg-gradient-to-br from-cyan-400 to-purple-500'
                          : 'bg-[#1a1a2e] border border-[#2a2a3e]'
                      }`}>
                        {msg.role === 'assistant'
                          ? <Bot size={15} className="text-white" />
                          : <User size={15} className="text-muted" />
                        }
                      </div>

                      <div className={`flex flex-col gap-1 max-w-[70%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <p className={`text-[11px] font-medium ${msg.role === 'user' ? 'text-cyan-400/70' : 'text-purple-400/70'}`}>
                          {msg.role === 'user' ? 'Visitor' : 'Ash AI'}
                        </p>
                        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                          msg.role === 'user'
                            ? 'bg-cyan-400/10 border border-cyan-400/20 text-light rounded-br-sm'
                            : 'bg-[#0f0f1a] border border-[#1a1a2e] text-light rounded-bl-sm'
                        }`}>
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-muted">
                          {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={bottomRef} />
                </>
              )}
            </div>

            {/* Footer info bar */}
            <div className="px-5 py-2 border-t border-[#1a1a2e] bg-[#0a0a14] flex items-center gap-4 text-xs text-muted shrink-0">
              <span className="flex items-center gap-1.5"><Clock size={11} /> Started {relTime(active.createdAt)}</span>
              <span>{active.messageCount} messages exchanged</span>
              {active.ip && <span>IP: {active.ip}</span>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
