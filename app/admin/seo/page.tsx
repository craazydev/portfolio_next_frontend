'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, Globe, Info } from 'lucide-react';

const PAGES = [
  { key: 'home',     label: 'Home',     path: '/'          },
  { key: 'about',    label: 'About',    path: '/about'     },
  { key: 'projects', label: 'Projects', path: '/projects'  },
  { key: 'blog',     label: 'Blog',     path: '/blog'      },
  { key: 'contact',  label: 'Contact',  path: '/contact'   },
];

interface MetaForm {
  title: string;
  description: string;
  keywords: string;   // comma-separated in UI
  ogImage: string;
}

const EMPTY: MetaForm = { title: '', description: '', keywords: '', ogImage: '' };

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
function token() { return typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : ''; }

export default function AdminSEO() {
  const router = useRouter();
  const [active, setActive]   = useState('home');
  const [forms,  setForms]    = useState<Record<string, MetaForm>>({});
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState('');

  useEffect(() => {
    if (!token()) { router.push('/admin'); return; }
    fetch(`${API}/meta`)
      .then(r => r.json())
      .then(d => {
        const map: Record<string, MetaForm> = {};
        PAGES.forEach(p => { map[p.key] = EMPTY; });
        (d.data || []).forEach((doc: { page: string; title?: string; description?: string; keywords?: string[]; ogImage?: string }) => {
          if (map[doc.page] !== undefined) {
            map[doc.page] = {
              title:       doc.title       || '',
              description: doc.description || '',
              keywords:    (doc.keywords   || []).join(', '),
              ogImage:     doc.ogImage     || '',
            };
          }
        });
        setForms(map);
      })
      .finally(() => setLoading(false));
  }, []);

  function setField(page: string, field: keyof MetaForm, value: string) {
    setForms(f => ({ ...f, [page]: { ...f[page], [field]: value } }));
  }

  async function handleSave() {
    setSaving(true); setSaved('');
    const form = forms[active];
    try {
      await fetch(`${API}/meta/${active}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({
          title:       form.title,
          description: form.description,
          keywords:    form.keywords.split(',').map(k => k.trim()).filter(Boolean),
          ogImage:     form.ogImage,
        }),
      });
      setSaved(active);
      setTimeout(() => setSaved(''), 3000);
    } finally { setSaving(false); }
  }

  const inputCls = "w-full bg-[#0a0a14] border border-[#1a1a2e] rounded-xl px-4 py-3 text-light text-sm focus:outline-none focus:border-cyan-400/40 transition-all";
  const form = forms[active] || EMPTY;
  const page = PAGES.find(p => p.key === active)!;

  if (loading) return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center">
      <Loader2 size={24} className="text-cyan-400 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080810] p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-light">SEO & Meta</h1>
            <p className="text-muted text-sm mt-1">Manage page titles, descriptions & keywords</p>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold text-sm disabled:opacity-60 hover:scale-[1.02] transition-all">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? 'Saving...' : saved === active ? '✓ Saved!' : 'Save Page'}
          </button>
        </div>

        {/* Page tabs */}
        <div className="flex border-b border-[#1a1a2e] mb-8 overflow-x-auto">
          {PAGES.map(p => (
            <button key={p.key} onClick={() => setActive(p.key)}
              className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                active === p.key
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-muted hover:text-light'
              }`}>
              {p.label}
              {saved === p.key && <span className="ml-2 text-xs text-green-400">✓</span>}
            </button>
          ))}
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 glass rounded-xl border border-cyan-400/10 p-4 mb-6">
          <Info size={15} className="text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-light text-xs font-medium mb-0.5">Page: <span className="text-cyan-400 font-mono">{page.path}</span></p>
            <p className="text-muted text-xs">These values override default meta tags for this page. Next.js reads them at build/request time via <span className="font-mono text-cyan-400/70">generateMetadata</span>.</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-muted text-xs">Page Title</label>
              <span className={`text-xs font-mono ${form.title.length > 60 ? 'text-red-400' : 'text-muted'}`}>
                {form.title.length}/60
              </span>
            </div>
            <input
              value={form.title}
              onChange={e => setField(active, 'title', e.target.value)}
              maxLength={70}
              placeholder={`e.g. About — Ashutosh Dubey | Full Stack Developer`}
              className={inputCls}
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-muted text-xs">Meta Description</label>
              <span className={`text-xs font-mono ${form.description.length > 160 ? 'text-red-400' : 'text-muted'}`}>
                {form.description.length}/160
              </span>
            </div>
            <textarea
              value={form.description}
              onChange={e => setField(active, 'description', e.target.value)}
              rows={3}
              maxLength={200}
              placeholder="Brief description shown in Google search results..."
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-muted text-xs mb-2">Keywords <span className="text-muted/60">(comma-separated)</span></label>
            <input
              value={form.keywords}
              onChange={e => setField(active, 'keywords', e.target.value)}
              placeholder="React, Next.js, Full Stack Developer, Lucknow"
              className={inputCls}
            />
            {/* Pills preview */}
            {form.keywords && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.keywords.split(',').map(k => k.trim()).filter(Boolean).map(k => (
                  <span key={k} className="tech-tag text-xs">{k}</span>
                ))}
              </div>
            )}
          </div>

          {/* OG Image */}
          <div>
            <label className="block text-muted text-xs mb-2">OG Image URL <span className="text-muted/60">(1200×630px for social sharing)</span></label>
            <input
              value={form.ogImage}
              onChange={e => setField(active, 'ogImage', e.target.value)}
              placeholder="https://... or /og-image.png"
              className={inputCls}
            />
          </div>

          {/* Google SERP Preview */}
          <div className="glass rounded-xl border border-[#1a1a2e] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Globe size={13} className="text-muted" />
              <span className="text-muted text-xs uppercase tracking-widest">Google Preview</span>
            </div>
            <div className="space-y-0.5">
              <p className="text-[#1a73e8] text-base font-medium leading-tight">
                {form.title || `${page.label} — Ashutosh Dubey`}
              </p>
              <p className="text-green-700 text-xs font-mono">
                ashutoshdubey.dev{page.path}
              </p>
              <p className="text-[#4d5156] text-sm mt-1 leading-relaxed line-clamp-2">
                {form.description || 'No description set. Google will pick a snippet from the page content.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
