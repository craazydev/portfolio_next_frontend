'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';
import FileUpload from '@/components/admin/FileUpload';

interface SkillItem  { name: string; level: number; }
interface SkillGroup { category: string; items: SkillItem[]; }
interface Profile {
  name: string; title: string; tagline: string; bio: string;
  location: string; email: string; phone: string;
  yearsExp: number; projectsDone: number;
  profilePic: string; profilePicId: string;
  resumeUrl: string; resumeId: string;
  social: { github: string; linkedin: string; twitter: string; instagram: string; };
  skills: SkillGroup[];
}

const DEFAULT: Profile = {
  name: 'Ashutosh Dubey', title: 'Full Stack Developer',
  tagline: 'Building Scalable Web Applications',
  bio: '', location: 'Lucknow, India', email: '', phone: '',
  yearsExp: 3, projectsDone: 25,
  profilePic: '', profilePicId: '',
  resumeUrl: '', resumeId: '',
  social: { github: 'https://github.com/Ashutosh724425', linkedin: 'https://linkedin.com/in/ashutosh-dubey-78111225b/', twitter: '', instagram: '' },
  skills: [],
};

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
function token() { return typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : ''; }

const TABS = ['basic', 'social', 'skills'] as const;

export default function AdminProfile() {
  const router = useRouter();
  const [form,    setForm]    = useState<Profile>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [tab,     setTab]     = useState<typeof TABS[number]>('basic');

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` };

  useEffect(() => {
    if (!token()) { router.push('/admin'); return; }
    fetch(`${API}/profile`)
      .then(r => r.json())
      .then(d => { if (d.data) setForm(d.data); })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true); setSaved(false);
    try {
      await fetch(`${API}/profile`, { method: 'PUT', headers, body: JSON.stringify(form) });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  }

  const set = (field: keyof Profile, value: unknown) =>
    setForm(p => ({ ...p, [field]: value }));

  const setSocial = (k: keyof Profile['social'], v: string) =>
    setForm(p => ({ ...p, social: { ...p.social, [k]: v } }));

  const addSkillGroup = () =>
    setForm(p => ({ ...p, skills: [...p.skills, { category: 'New Category', items: [] }] }));

  const addSkillItem = (gi: number) =>
    setForm(p => {
      const skills = [...p.skills];
      skills[gi] = { ...skills[gi], items: [...skills[gi].items, { name: '', level: 80 }] };
      return { ...p, skills };
    });

  const updateSkillItem = (gi: number, ii: number, field: keyof SkillItem, value: string | number) =>
    setForm(p => {
      const skills = p.skills.map((g, gIdx) => gIdx !== gi ? g : {
        ...g, items: g.items.map((item, iIdx) => iIdx !== ii ? item : { ...item, [field]: value }),
      });
      return { ...p, skills };
    });

  const inputCls = "w-full bg-[#0a0a14] border border-[#1a1a2e] rounded-xl px-4 py-3 text-light text-sm focus:outline-none focus:border-cyan-400/40 transition-all";

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
            <h1 className="text-2xl font-black text-light">Edit Profile</h1>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold text-sm disabled:opacity-60 hover:scale-[1.02] transition-all">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#1a1a2e] mb-8">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-colors ${tab === t ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-muted hover:text-light'}`}>
              {t === 'basic' ? 'Basic Info' : t === 'social' ? 'Social Links' : 'Skills'}
            </button>
          ))}
        </div>

        {/* ── Basic Info ── */}
        {tab === 'basic' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {([['name', 'Full Name'], ['title', 'Job Title'], ['tagline', 'Tagline'], ['location', 'Location'], ['email', 'Email'], ['phone', 'Phone']] as const).map(([f, lbl]) => (
                <div key={f}>
                  <label className="block text-muted text-xs mb-2">{lbl}</label>
                  <input value={(form[f] as string) || ''} onChange={e => set(f, e.target.value)} className={inputCls} />
                </div>
              ))}
              <div>
                <label className="block text-muted text-xs mb-2">Years of Experience</label>
                <input type="number" value={form.yearsExp} onChange={e => set('yearsExp', Number(e.target.value))} className={inputCls} />
              </div>
              <div>
                <label className="block text-muted text-xs mb-2">Projects Done</label>
                <input type="number" value={form.projectsDone} onChange={e => set('projectsDone', Number(e.target.value))} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <FileUpload
                  type="image"
                  folder="profile"
                  label="Profile Picture"
                  value={form.profilePic || ''}
                  publicId={form.profilePicId || ''}
                  onChange={(url, pid) => setForm(p => ({ ...p, profilePic: url, profilePicId: pid }))}
                />
              </div>
              <div className="sm:col-span-2">
                <FileUpload
                  type="pdf"
                  label="Resume / CV (PDF)"
                  value={form.resumeUrl || ''}
                  publicId={form.resumeId || ''}
                  onChange={(url, pid) => setForm(p => ({ ...p, resumeUrl: url, resumeId: pid }))}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-muted text-xs mb-2">Bio</label>
                <textarea value={form.bio || ''} rows={4} onChange={e => set('bio', e.target.value)}
                  className={`${inputCls} resize-none`} placeholder="Tell the world about yourself..." />
              </div>
            </div>
          </div>
        )}

        {/* ── Social Links ── */}
        {tab === 'social' && (
          <div className="space-y-5">
            {([
              ['github',    'GitHub URL'],
              ['linkedin',  'LinkedIn URL'],
              ['twitter',   'Twitter URL'],
              ['instagram', 'Instagram URL'],
            ] as const).map(([k, lbl]) => (
              <div key={k}>
                <label className="block text-muted text-xs mb-2">{lbl}</label>
                <input value={form.social[k] || ''} onChange={e => setSocial(k, e.target.value)}
                  className={inputCls} placeholder="https://..." />
              </div>
            ))}
          </div>
        )}

        {/* ── Skills ── */}
        {tab === 'skills' && (
          <div className="space-y-6">
            {form.skills.map((group, gi) => (
              <div key={gi} className="glass rounded-xl border border-[#1a1a2e] p-5">
                <div className="flex items-center gap-3 mb-4">
                  <input value={group.category}
                    onChange={e => setForm(p => { const skills = [...p.skills]; skills[gi] = { ...skills[gi], category: e.target.value }; return { ...p, skills }; })}
                    className="flex-1 bg-[#0a0a14] border border-[#1a1a2e] rounded-lg px-3 py-2 text-light text-sm font-semibold focus:outline-none focus:border-cyan-400/40" />
                  <button onClick={() => setForm(p => ({ ...p, skills: p.skills.filter((_, i) => i !== gi) }))}
                    className="p-2 text-muted hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
                <div className="space-y-3">
                  {group.items.map((item, ii) => (
                    <div key={ii} className="flex items-center gap-3">
                      <input value={item.name} onChange={e => updateSkillItem(gi, ii, 'name', e.target.value)}
                        placeholder="Skill name"
                        className="flex-1 bg-[#0a0a14] border border-[#1a1a2e] rounded-lg px-3 py-2 text-light text-xs focus:outline-none focus:border-cyan-400/40" />
                      <input type="range" min={0} max={100} value={item.level}
                        onChange={e => updateSkillItem(gi, ii, 'level', Number(e.target.value))}
                        className="w-28 accent-cyan-400" />
                      <span className="text-muted text-xs w-8 text-right font-mono">{item.level}%</span>
                      <button onClick={() => setForm(p => { const skills = p.skills.map((g, gI) => gI !== gi ? g : { ...g, items: g.items.filter((_, iI) => iI !== ii) }); return { ...p, skills }; })}
                        className="p-1 text-muted hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
                    </div>
                  ))}
                </div>
                <button onClick={() => addSkillItem(gi)}
                  className="mt-3 flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                  <Plus size={12} /> Add skill
                </button>
              </div>
            ))}
            <button onClick={addSkillGroup}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-cyan-400/30 text-cyan-400 text-sm hover:border-cyan-400/60 transition-colors w-full justify-center">
              <Plus size={15} /> Add Skill Category
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
