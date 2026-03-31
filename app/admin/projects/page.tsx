'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Plus, Pencil, Trash2, ExternalLink,
  Github, Star, Eye, EyeOff, Loader2, X, Save,
} from 'lucide-react';
import FileUpload from '@/components/admin/FileUpload';

interface Project {
  _id: string; title: string; slug: string; description: string;
  longDesc?: string; thumbnail?: string; thumbnailId?: string; tech: string[];
  category: string; liveUrl?: string; githubUrl?: string;
  featured: boolean; published: boolean; order: number;
}

const EMPTY: Omit<Project, '_id' | 'slug'> = {
  title: '', description: '', longDesc: '', thumbnail: '', thumbnailId: '', tech: [],
  category: 'fullstack', liveUrl: '', githubUrl: '',
  featured: false, published: true, order: 0,
};
const CATS = ['fullstack', 'frontend', 'backend', 'mobile', 'tool'];
const API  = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function token() {
  return typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';
}

export default function AdminProjects() {
  const router   = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState<'add' | 'edit' | null>(null);
  const [editing,  setEditing]  = useState<Project | null>(null);
  const [form,     setForm]     = useState<Omit<Project, '_id' | 'slug'>>(EMPTY);
  const [techInput,setTechInput]= useState('');
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` };

  useEffect(() => {
    if (!token()) { router.push('/admin'); return; }
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    try {
      const r = await fetch(`${API}/projects`, { headers });
      const d = await r.json();
      setProjects(d.data ?? []);
    } finally { setLoading(false); }
  }

  function openAdd() {
    setForm(EMPTY); setTechInput(''); setEditing(null); setModal('add');
  }

  function openEdit(p: Project) {
    setEditing(p);
    setForm({ title: p.title, description: p.description, longDesc: p.longDesc ?? '',
      thumbnail: p.thumbnail ?? '', thumbnailId: p.thumbnailId ?? '', tech: [...p.tech], category: p.category,
      liveUrl: p.liveUrl ?? '', githubUrl: p.githubUrl ?? '',
      featured: p.featured, published: p.published, order: p.order });
    setTechInput('');
    setModal('edit');
  }

  function addTech() {
    const t = techInput.trim();
    if (t && !form.tech.includes(t)) setForm(p => ({ ...p, tech: [...p.tech, t] }));
    setTechInput('');
  }

  async function handleSave() {
    if (!form.title || !form.description) return;
    setSaving(true);
    try {
      if (modal === 'add') {
        const r = await fetch(`${API}/projects`, { method: 'POST', headers, body: JSON.stringify(form) });
        const d = await r.json();
        if (d.success) setProjects(p => [d.data, ...p]);
      } else if (editing) {
        const r = await fetch(`${API}/projects/${editing._id}`, { method: 'PUT', headers, body: JSON.stringify(form) });
        const d = await r.json();
        if (d.success) setProjects(p => p.map(x => x._id === editing._id ? d.data : x));
      }
      setModal(null);
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this project?')) return;
    setDeleting(id);
    try {
      await fetch(`${API}/projects/${id}`, { method: 'DELETE', headers });
      setProjects(p => p.filter(x => x._id !== id));
    } finally { setDeleting(null); }
  }

  async function togglePublished(p: Project) {
    const r = await fetch(`${API}/projects/${p._id}`, {
      method: 'PUT', headers, body: JSON.stringify({ published: !p.published }),
    });
    const d = await r.json();
    if (d.success) setProjects(prev => prev.map(x => x._id === p._id ? d.data : x));
  }

  return (
    <div className="min-h-screen bg-[#080810] p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-light">Projects</h1>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold text-sm hover:scale-105 transition-transform">
            <Plus size={16} /> Add Project
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={24} className="text-cyan-400 animate-spin" /></div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-muted">No projects yet. <button onClick={openAdd} className="text-cyan-400 hover:underline">Add one →</button></div>
        ) : (
          <div className="space-y-3">
            {projects.map((p) => (
              <motion.div key={p._id} layout
                className="glass rounded-xl border border-[#1a1a2e] p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-cyan-400/10 transition-all">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-light font-semibold text-sm truncate">{p.title}</h3>
                    {p.featured  && <Star  size={12} className="text-yellow-400 shrink-0" fill="currentColor" />}
                    {!p.published && <span className="text-xs text-muted border border-[#1a1a2e] px-2 py-0.5 rounded-full">Draft</span>}
                  </div>
                  <p className="text-muted text-xs line-clamp-1 mb-2">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="tech-tag capitalize">{p.category}</span>
                    {p.tech.slice(0, 4).map(t => <span key={t} className="tech-tag">{t}</span>)}
                    {p.tech.length > 4 && <span className="tech-tag">+{p.tech.length - 4}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {p.liveUrl   && <a href={p.liveUrl}   target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg glass border border-[#1a1a2e] text-muted hover:text-cyan-400 transition-colors"><ExternalLink size={14} /></a>}
                  {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg glass border border-[#1a1a2e] text-muted hover:text-light transition-colors"><Github size={14} /></a>}
                  <button onClick={() => togglePublished(p)} className="p-2 rounded-lg glass border border-[#1a1a2e] text-muted hover:text-cyan-400 transition-colors">
                    {p.published ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button onClick={() => openEdit(p)} className="p-2 rounded-lg glass border border-[#1a1a2e] text-muted hover:text-light transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id}
                    className="p-2 rounded-lg glass border border-[#1a1a2e] text-muted hover:text-red-400 transition-colors disabled:opacity-50">
                    {deleting === p._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-2xl glass rounded-2xl border border-[#1a1a2e] my-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#1a1a2e]">
                <h2 className="text-light font-bold">{modal === 'add' ? 'Add Project' : 'Edit Project'}</h2>
                <button onClick={() => setModal(null)} className="text-muted hover:text-light transition-colors"><X size={18} /></button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-muted text-xs mb-2">Title *</label>
                    <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                      className="w-full bg-[#0a0a14] border border-[#1a1a2e] rounded-xl px-4 py-3 text-light text-sm focus:outline-none focus:border-cyan-400/40 transition-all" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-muted text-xs mb-2">Short Description * (shown on cards)</label>
                    <textarea value={form.description} rows={2} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                      className="w-full bg-[#0a0a14] border border-[#1a1a2e] rounded-xl px-4 py-3 text-light text-sm focus:outline-none focus:border-cyan-400/40 transition-all resize-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-muted text-xs mb-2">Full Description (project detail page)</label>
                    <textarea value={form.longDesc ?? ''} rows={4} onChange={e => setForm(p => ({ ...p, longDesc: e.target.value }))}
                      className="w-full bg-[#0a0a14] border border-[#1a1a2e] rounded-xl px-4 py-3 text-light text-sm focus:outline-none focus:border-cyan-400/40 transition-all resize-none" />
                  </div>
                  <div>
                    <label className="block text-muted text-xs mb-2">Category</label>
                    <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                      className="w-full bg-[#0a0a14] border border-[#1a1a2e] rounded-xl px-4 py-3 text-light text-sm focus:outline-none focus:border-cyan-400/40 transition-all">
                      {CATS.map(c => <option key={c} value={c} className="bg-[#0a0a14]">{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <FileUpload
                      type="image"
                      folder="projects"
                      label="Thumbnail Image"
                      value={form.thumbnail ?? ''}
                      publicId={form.thumbnailId ?? ''}
                      onChange={(url, pid) => setForm(p => ({ ...p, thumbnail: url, thumbnailId: pid }))}
                    />
                  </div>
                  <div>
                    <label className="block text-muted text-xs mb-2">Live URL</label>
                    <input value={form.liveUrl ?? ''} onChange={e => setForm(p => ({ ...p, liveUrl: e.target.value }))}
                      placeholder="https://..."
                      className="w-full bg-[#0a0a14] border border-[#1a1a2e] rounded-xl px-4 py-3 text-light text-sm focus:outline-none focus:border-cyan-400/40 transition-all" />
                  </div>
                  <div>
                    <label className="block text-muted text-xs mb-2">GitHub URL</label>
                    <input value={form.githubUrl ?? ''} onChange={e => setForm(p => ({ ...p, githubUrl: e.target.value }))}
                      placeholder="https://github.com/..."
                      className="w-full bg-[#0a0a14] border border-[#1a1a2e] rounded-xl px-4 py-3 text-light text-sm focus:outline-none focus:border-cyan-400/40 transition-all" />
                  </div>

                  {/* Tech tags */}
                  <div className="sm:col-span-2">
                    <label className="block text-muted text-xs mb-2">Technologies</label>
                    <div className="flex gap-2 mb-2">
                      <input value={techInput} onChange={e => setTechInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(); }}}
                        placeholder="e.g. React, Node.js — press Enter"
                        className="flex-1 bg-[#0a0a14] border border-[#1a1a2e] rounded-xl px-4 py-2.5 text-light text-sm focus:outline-none focus:border-cyan-400/40 transition-all" />
                      <button onClick={addTech} type="button"
                        className="px-4 py-2 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm hover:bg-cyan-400/20 transition-colors">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {form.tech.map(t => (
                        <span key={t} className="tech-tag flex items-center gap-1">
                          {t}
                          <button onClick={() => setForm(p => ({ ...p, tech: p.tech.filter(x => x !== t) }))}
                            className="ml-1 hover:text-red-400 transition-colors"><X size={10} /></button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="flex items-center gap-6">
                    {([['featured', 'Featured'], ['published', 'Published']] as const).map(([key, lbl]) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <div onClick={() => setForm(p => ({ ...p, [key]: !p[key] }))}
                          className={`w-10 h-5 rounded-full transition-colors relative ${form[key] ? 'bg-cyan-400' : 'bg-[#1a1a2e]'}`}>
                          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </div>
                        <span className="text-muted text-xs">{lbl}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 p-6 border-t border-[#1a1a2e]">
                <button onClick={() => setModal(null)} className="px-5 py-2.5 rounded-xl glass border border-[#1a1a2e] text-muted text-sm hover:text-light transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving || !form.title || !form.description}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold text-sm disabled:opacity-60 hover:scale-[1.02] transition-all">
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  {saving ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
