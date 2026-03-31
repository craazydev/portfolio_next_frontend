'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Loader2, X, Save, BookOpen, Eye, EyeOff, Info } from 'lucide-react';

interface KnowledgeEntry {
  _id: string; title: string; content: string;
  category: string; active: boolean; order: number;
}

const CATS = ['about', 'skills', 'projects', 'services', 'pricing', 'contact', 'faq', 'general'];
const CAT_COLORS: Record<string, string> = {
  about: '#00d4ff', skills: '#a855f7', projects: '#f59e0b',
  services: '#10b981', pricing: '#ef4444', contact: '#6366f1',
  faq: '#ec4899', general: '#6b7280',
};

const EMPTY = { title: '', content: '', category: 'general', active: true, order: 0 };
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
function token() { return typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : ''; }

export default function AdminKnowledge() {
  const router = useRouter();
  const [entries,  setEntries]  = useState<KnowledgeEntry[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState<'add' | 'edit' | null>(null);
  const [editing,  setEditing]  = useState<KnowledgeEntry | null>(null);
  const [form,     setForm]     = useState(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter,   setFilter]   = useState('all');

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` };

  useEffect(() => {
    if (!token()) { router.push('/admin'); return; }
    fetch(`${API}/knowledge/all`, { headers }).then(r => r.json())
      .then(d => setEntries(d.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  function openAdd()  { setForm(EMPTY); setEditing(null); setModal('add'); }
  function openEdit(e: KnowledgeEntry) {
    setEditing(e);
    setForm({ title: e.title, content: e.content, category: e.category, active: e.active, order: e.order });
    setModal('edit');
  }

  async function handleSave() {
    if (!form.title || !form.content) return;
    setSaving(true);
    try {
      if (modal === 'add') {
        const r = await fetch(`${API}/knowledge`, { method: 'POST', headers, body: JSON.stringify(form) });
        const d = await r.json();
        if (d.success) setEntries(p => [...p, d.data]);
      } else if (editing) {
        const r = await fetch(`${API}/knowledge/${editing._id}`, { method: 'PUT', headers, body: JSON.stringify(form) });
        const d = await r.json();
        if (d.success) setEntries(p => p.map(x => x._id === editing._id ? d.data : x));
      }
      setModal(null);
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this knowledge entry? The AI will no longer use this information.')) return;
    setDeleting(id);
    await fetch(`${API}/knowledge/${id}`, { method: 'DELETE', headers });
    setEntries(p => p.filter(x => x._id !== id));
    setDeleting(null);
  }

  async function toggleActive(e: KnowledgeEntry) {
    const r = await fetch(`${API}/knowledge/${e._id}`, { method: 'PUT', headers, body: JSON.stringify({ active: !e.active }) });
    const d = await r.json();
    if (d.success) setEntries(p => p.map(x => x._id === e._id ? d.data : x));
  }

  const filtered = filter === 'all' ? entries : entries.filter(e => e.category === filter);
  const inputCls = "w-full bg-[#0a0a14] border border-[#1a1a2e] rounded-xl px-4 py-3 text-light text-sm focus:outline-none focus:border-cyan-400/40 transition-all";

  return (
    <div className="min-h-screen bg-[#080810] p-6 md:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-light">Knowledge Base</h1>
            <p className="text-muted text-sm mt-1">This is what the AI chatbot knows about you.</p>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold text-sm hover:scale-105 transition-transform">
            <Plus size={16} /> Add Entry
          </button>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 glass rounded-xl border border-cyan-400/15 p-4 mb-6">
          <Info size={16} className="text-cyan-400 mt-0.5 shrink-0" />
          <p className="text-muted text-xs leading-relaxed">
            Every active entry here is injected into the AI's system prompt when a visitor chats.
            Keep entries concise and factual. The AI uses this to answer questions about you accurately.
            Inactive entries are ignored by the AI but kept for reference.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', ...CATS].map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono capitalize transition-all ${
                filter === c
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold'
                  : 'glass border border-[#1a1a2e] text-muted hover:text-light'
              }`}>
              {c}
              {c !== 'all' && (
                <span className="ml-1 text-[10px] opacity-60">
                  ({entries.filter(e => e.category === c).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Entries */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={24} className="text-cyan-400 animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted">
            <BookOpen size={40} className="mx-auto mb-3 opacity-20" />
            <p>No entries yet. <button onClick={openAdd} className="text-cyan-400 hover:underline">Add one →</button></p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((e) => (
              <motion.div key={e._id} layout
                className={`glass rounded-xl border p-5 transition-all group ${
                  e.active ? 'border-[#1a1a2e] hover:border-cyan-400/15' : 'border-[#1a1a2e] opacity-50'
                }`}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono capitalize"
                      style={{ background: `${CAT_COLORS[e.category]}15`, border: `1px solid ${CAT_COLORS[e.category]}30`, color: CAT_COLORS[e.category] }}>
                      {e.category}
                    </span>
                    {!e.active && <span className="text-[10px] text-muted border border-[#1a1a2e] px-2 py-0.5 rounded-full">Inactive</span>}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => toggleActive(e)} className="p-1.5 rounded-lg text-muted hover:text-cyan-400 transition-colors" title={e.active ? 'Deactivate' : 'Activate'}>
                      {e.active ? <Eye size={13} /> : <EyeOff size={13} />}
                    </button>
                    <button onClick={() => openEdit(e)} className="p-1.5 rounded-lg text-muted hover:text-light transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(e._id)} disabled={deleting === e._id}
                      className="p-1.5 rounded-lg text-muted hover:text-red-400 transition-colors disabled:opacity-50">
                      {deleting === e._id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                    </button>
                  </div>
                </div>
                <h3 className="text-light font-semibold text-sm mb-2">{e.title}</h3>
                <p className="text-muted text-xs leading-relaxed line-clamp-3">{e.content}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="w-full max-w-2xl glass rounded-2xl border border-[#1a1a2e] my-8">
              <div className="flex items-center justify-between p-6 border-b border-[#1a1a2e]">
                <h2 className="text-light font-bold">{modal === 'add' ? 'Add Knowledge Entry' : 'Edit Entry'}</h2>
                <button onClick={() => setModal(null)} className="text-muted hover:text-light transition-colors"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <label className="block text-muted text-xs mb-2">Title *</label>
                    <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className={inputCls} placeholder="e.g. Pricing Information" />
                  </div>
                  <div>
                    <label className="block text-muted text-xs mb-2">Category</label>
                    <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                      className={inputCls}>
                      {CATS.map(c => <option key={c} value={c} className="bg-[#0a0a14] capitalize">{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-muted text-xs mb-2">Order (lower = higher priority)</label>
                    <input type="number" value={form.order} onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))} className={inputCls} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-muted text-xs mb-2">Content * (this is what the AI reads)</label>
                    <textarea value={form.content} rows={7} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                      placeholder="Write factual information the AI should know and use when answering questions..."
                      className={`${inputCls} resize-y`} />
                    <p className="text-muted text-xs mt-1">{form.content.length} characters</p>
                  </div>
                  <div className="col-span-2 flex items-center gap-3">
                    <div onClick={() => setForm(p => ({ ...p, active: !p.active }))}
                      className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${form.active ? 'bg-cyan-400' : 'bg-[#1a1a2e]'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.active ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                    <label className="text-muted text-sm cursor-pointer" onClick={() => setForm(p => ({ ...p, active: !p.active }))}>
                      {form.active ? 'Active — AI will use this' : 'Inactive — AI will ignore this'}
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 p-6 border-t border-[#1a1a2e]">
                <button onClick={() => setModal(null)} className="px-5 py-2.5 rounded-xl glass border border-[#1a1a2e] text-muted text-sm hover:text-light transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving || !form.title || !form.content}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold text-sm disabled:opacity-60 hover:scale-[1.02] transition-all">
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  {saving ? 'Saving...' : 'Save Entry'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
