'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Plus, Pencil, Trash2, Eye, EyeOff,
  Loader2, X, Save, Clock, Star,
} from 'lucide-react';
import FileUpload from '@/components/admin/FileUpload';
import RichEditor from '@/components/admin/RichEditor';

interface Post {
  _id: string; title: string; slug: string; excerpt: string;
  content: string; thumbnail?: string; thumbnailId?: string; tags: string[]; category?: string;
  readTime: number; published: boolean; featured: boolean;
  views: number; metaTitle?: string; metaDesc?: string; createdAt: string;
}

const EMPTY_POST = {
  title: '', excerpt: '', content: '', thumbnail: '', thumbnailId: '', tags: [] as string[],
  category: '', published: false, featured: false,
  metaTitle: '', metaDesc: '',
};

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
function token() { return typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : ''; }

export default function AdminBlog() {
  const router = useRouter();
  const [posts,     setPosts]     = useState<Post[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [modal,     setModal]     = useState<'add' | 'edit' | null>(null);
  const [editing,   setEditing]   = useState<Post | null>(null);
  const [form,      setForm]      = useState(EMPTY_POST);
  const [tagInput,  setTagInput]  = useState('');
  const [saving,    setSaving]    = useState(false);
  const [deleting,  setDeleting]  = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` };

  useEffect(() => {
    if (!token()) { router.push('/admin'); return; }
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      const r = await fetch(`${API}/blog?limit=50`, { headers });
      const d = await r.json();
      setPosts(d.data ?? []);
    } finally { setLoading(false); }
  }

  function openAdd() { setForm(EMPTY_POST); setTagInput(''); setEditing(null); setModal('add'); setActiveTab('content'); }

  function openEdit(p: Post) {
    setEditing(p);
    setForm({
      title: p.title, excerpt: p.excerpt, content: p.content,
      thumbnail: p.thumbnail ?? '', thumbnailId: p.thumbnailId ?? '',
      tags: [...p.tags], category: p.category ?? '',
      published: p.published, featured: p.featured,
      metaTitle: p.metaTitle ?? '', metaDesc: p.metaDesc ?? '',
    });
    setTagInput(''); setModal('edit'); setActiveTab('content');
  }

  function addTag() {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) setForm(p => ({ ...p, tags: [...p.tags, t] }));
    setTagInput('');
  }

  async function handleSave() {
    if (!form.title || !form.content) return;
    setSaving(true);
    try {
      if (modal === 'add') {
        const r = await fetch(`${API}/blog`, { method: 'POST', headers, body: JSON.stringify(form) });
        const d = await r.json();
        if (d.success) setPosts(p => [d.data, ...p]);
      } else if (editing) {
        const r = await fetch(`${API}/blog/${editing._id}`, { method: 'PUT', headers, body: JSON.stringify(form) });
        const d = await r.json();
        if (d.success) setPosts(p => p.map(x => x._id === editing._id ? d.data : x));
      }
      setModal(null);
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this post?')) return;
    setDeleting(id);
    try {
      await fetch(`${API}/blog/${id}`, { method: 'DELETE', headers });
      setPosts(p => p.filter(x => x._id !== id));
    } finally { setDeleting(null); }
  }

  async function togglePublished(p: Post) {
    const r = await fetch(`${API}/blog/${p._id}`, { method: 'PUT', headers, body: JSON.stringify({ published: !p.published }) });
    const d = await r.json();
    if (d.success) setPosts(prev => prev.map(x => x._id === p._id ? d.data : x));
  }

  const inputCls = "w-full bg-[#0a0a14] border border-[#1a1a2e] rounded-xl px-4 py-3 text-light text-sm focus:outline-none focus:border-cyan-400/40 transition-all";

  return (
    <div className="min-h-screen bg-[#080810] p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-light">Blog Posts</h1>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold text-sm hover:scale-105 transition-transform">
            <Plus size={16} /> Write Post
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={24} className="text-cyan-400 animate-spin" /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-muted">No posts yet. <button onClick={openAdd} className="text-cyan-400 hover:underline">Write one →</button></div>
        ) : (
          <div className="space-y-3">
            {posts.map((p) => (
              <motion.div key={p._id} layout
                className="glass rounded-xl border border-[#1a1a2e] p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-cyan-400/10 transition-all">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-light font-semibold text-sm truncate">{p.title}</h3>
                    {p.featured  && <Star  size={12} className="text-yellow-400 shrink-0" fill="currentColor" />}
                    {!p.published && <span className="text-xs text-muted border border-[#1a1a2e] px-2 py-0.5 rounded-full">Draft</span>}
                  </div>
                  <p className="text-muted text-xs line-clamp-1 mb-2">{p.excerpt}</p>
                  <div className="flex items-center gap-3 text-muted text-xs">
                    <span className="flex items-center gap-1"><Clock size={11} /> {p.readTime}m read</span>
                    <span>{p.views} views</span>
                    <span>{new Date(p.createdAt).toLocaleDateString('en-IN')}</span>
                    <div className="flex flex-wrap gap-1">
                      {p.tags.slice(0, 3).map(t => <span key={t} className="tech-tag">{t}</span>)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
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
              className="w-full max-w-3xl glass rounded-2xl border border-[#1a1a2e] my-8">

              <div className="flex items-center justify-between p-6 border-b border-[#1a1a2e]">
                <h2 className="text-light font-bold">{modal === 'add' ? 'Write Blog Post' : 'Edit Post'}</h2>
                <button onClick={() => setModal(null)} className="text-muted hover:text-light transition-colors"><X size={18} /></button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-[#1a1a2e]">
                {(['content', 'seo'] as const).map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-muted hover:text-light'}`}>
                    {tab === 'seo' ? 'SEO Settings' : 'Content'}
                  </button>
                ))}
              </div>

              <div className="p-6 space-y-5">
                {activeTab === 'content' ? (
                  <>
                    <div>
                      <label className="block text-muted text-xs mb-2">Title *</label>
                      <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-muted text-xs mb-2">Excerpt * (shown on blog listing)</label>
                      <textarea value={form.excerpt} rows={2} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))}
                        className={`${inputCls} resize-none`} />
                    </div>
                    <div>
                      <label className="block text-muted text-xs mb-2">Content *</label>
                      <RichEditor
                        value={form.content}
                        onChange={html => setForm(p => ({ ...p, content: html }))}
                        minHeight={320}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <FileUpload
                          type="image"
                          folder="blog"
                          label="Thumbnail Image"
                          value={form.thumbnail}
                          publicId={form.thumbnailId}
                          onChange={(url, pid) => setForm(p => ({ ...p, thumbnail: url, thumbnailId: pid }))}
                        />
                      </div>
                      <div>
                        <label className="block text-muted text-xs mb-2">Category</label>
                        <input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className={inputCls} placeholder="e.g. React, Node.js" />
                      </div>
                    </div>
                    {/* Tags */}
                    <div>
                      <label className="block text-muted text-xs mb-2">Tags</label>
                      <div className="flex gap-2 mb-2">
                        <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); }}}
                          placeholder="Add tag — press Enter"
                          className={`${inputCls} flex-1`} />
                        <button onClick={addTag} type="button"
                          className="px-4 py-2 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm hover:bg-cyan-400/20 transition-colors">Add</button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {form.tags.map(t => (
                          <span key={t} className="tech-tag flex items-center gap-1">{t}
                            <button onClick={() => setForm(p => ({ ...p, tags: p.tags.filter(x => x !== t) }))} className="ml-1 hover:text-red-400"><X size={10} /></button>
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Toggles */}
                    <div className="flex items-center gap-6">
                      {([['published', 'Published'], ['featured', 'Featured']] as const).map(([key, lbl]) => (
                        <label key={key} className="flex items-center gap-2 cursor-pointer">
                          <div onClick={() => setForm(p => ({ ...p, [key]: !p[key] }))}
                            className={`w-10 h-5 rounded-full transition-colors relative ${form[key] ? 'bg-cyan-400' : 'bg-[#1a1a2e]'}`}>
                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                          </div>
                          <span className="text-muted text-xs">{lbl}</span>
                        </label>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-muted text-xs mb-4">Override the default SEO title and description for this post.</p>
                    <div>
                      <label className="block text-muted text-xs mb-2">Meta Title (max 60 chars)</label>
                      <input value={form.metaTitle} onChange={e => setForm(p => ({ ...p, metaTitle: e.target.value }))} maxLength={60} className={inputCls} />
                      <p className="text-muted text-xs mt-1">{form.metaTitle.length}/60</p>
                    </div>
                    <div>
                      <label className="block text-muted text-xs mb-2">Meta Description (max 160 chars)</label>
                      <textarea value={form.metaDesc} rows={3} maxLength={160} onChange={e => setForm(p => ({ ...p, metaDesc: e.target.value }))}
                        className={`${inputCls} resize-none`} />
                      <p className="text-muted text-xs mt-1">{form.metaDesc.length}/160</p>
                    </div>
                    {/* Preview */}
                    <div className="glass rounded-xl border border-[#1a1a2e] p-4">
                      <p className="text-muted text-xs mb-3 uppercase tracking-widest">Google Preview</p>
                      <p className="text-blue-400 text-sm font-medium mb-1 truncate">{form.metaTitle || form.title || 'Post Title'}</p>
                      <p className="text-green-600 text-xs mb-1">ashutoshdubey.dev/blog/your-post-slug</p>
                      <p className="text-muted text-xs line-clamp-2">{form.metaDesc || form.excerpt || 'Post description...'}</p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-[#1a1a2e]">
                <button onClick={() => setModal(null)} className="px-5 py-2.5 rounded-xl glass border border-[#1a1a2e] text-muted text-sm hover:text-light transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving || !form.title || !form.content}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold text-sm disabled:opacity-60 hover:scale-[1.02] transition-all">
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  {saving ? 'Saving...' : 'Save Post'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
