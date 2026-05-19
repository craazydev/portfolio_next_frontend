'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Github, Linkedin, Mail, Code2, ArrowUpRight, ExternalLink, Clock, FolderOpen, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Project { _id: string; title: string; slug: string; category: string; }
interface BlogPost { _id: string; title: string; slug: string; readTime: number; createdAt: string; }
interface Profile  { social?: { github?: string; linkedin?: string; email?: string }; email?: string; }

const NAV = [
  { href: '/',         label: 'Home'     },
  { href: '/about',    label: 'About'    },
  { href: '/projects', label: 'Projects' },
  { href: '/blog',     label: 'Blog'     },
  { href: '/contact',  label: 'Contact'  },
];

export default function Footer() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts,    setPosts]    = useState<BlogPost[]>([]);
  const [social,   setSocial]   = useState({ github: 'https://github.com/Ashutosh724425', linkedin: 'https://linkedin.com/in/ashutosh-dubey-78111225b/', email: 'ashutosh@crazydev.in' });

  useEffect(() => {
    fetch(`${API}/projects?limit=4`).then(r => r.json()).then(d => setProjects(d.data?.slice(0,4) || [])).catch(() => {});
    fetch(`${API}/blog?limit=3`).then(r => r.json()).then(d => setPosts(d.data?.slice(0,3) || [])).catch(() => {});
    fetch(`${API}/profile`).then(r => r.json()).then(d => {
      const p: Profile = d.data || {};
      setSocial({
        github:   p.social?.github   || social.github,
        linkedin: p.social?.linkedin || social.linkedin,
        email:    `mailto:${p.email || 'ashutosh@crazydev.in'}`,
      });
    }).catch(() => {});
  }, []);

  const SOCIALS = [
    { href: social.github,   icon: Github,   label: 'GitHub',   color: 'hover:text-light hover:border-white/20' },
    { href: social.linkedin, icon: Linkedin, label: 'LinkedIn', color: 'hover:text-cyan-400 hover:border-cyan-400/30' },
    { href: social.email,    icon: Mail,     label: 'Email',    color: 'hover:text-green-400 hover:border-green-400/30' },
  ];

  return (
    <footer className="relative border-t border-[#1a1a2e] bg-[#06060f] overflow-hidden">
      {/* Decorative top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/40 to-transparent" />

      {/* Background orbs */}
      <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(40,233,140,0.04) 0%, transparent 70%)' }} />
      <div className="absolute top-0 right-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)' }} />

      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* ── Brand col ─────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #28e98c)', boxShadow: '0 0 20px rgba(40,233,140,0.25)' }}>
                <Code2 size={18} className="text-white" />
              </div>
              <span className="font-mono font-bold text-lg leading-none">
                <span className="text-green-400">ash</span>
                <span className="text-light">utosh</span>
                <span className="text-cyan-400">.</span>
              </span>
            </Link>
            <p className="text-muted text-sm leading-relaxed mb-6">
              Full Stack Developer from Lucknow. Building scalable apps, payment integrations & SaaS.
            </p>

            {/* Social icons */}
            <div className="flex gap-2.5">
              {SOCIALS.map(({ href, icon: Icon, label, color }) => (
                <motion.a key={label} href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  className={`w-10 h-10 rounded-xl glass border border-[#1a1a2e] flex items-center justify-center text-muted transition-all ${color}`}
                  aria-label={label}>
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* ── Navigation col ────────────────────────────────── */}
          <div>
            <h4 className="text-light font-semibold mb-5 text-xs uppercase tracking-[0.15em] flex items-center gap-2">
              <span className="w-4 h-px bg-green-400/60 inline-block" />
              Pages
            </h4>
            <ul className="space-y-2.5">
              {NAV.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}
                    className="text-muted text-sm hover:text-green-400 transition-colors flex items-center gap-1.5 group">
                    <ArrowUpRight size={11} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-green-400" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Recent Projects col ───────────────────────────── */}
          <div>
            <h4 className="text-light font-semibold mb-5 text-xs uppercase tracking-[0.15em] flex items-center gap-2">
              <span className="w-4 h-px bg-cyan-400/60 inline-block" />
              Recent Projects
            </h4>
            {projects.length > 0 ? (
              <ul className="space-y-3">
                {projects.map(p => (
                  <li key={p._id}>
                    <Link href={`/projects/${p.slug}`}
                      className="group flex items-start gap-2 text-muted hover:text-light transition-colors">
                      <FolderOpen size={13} className="text-cyan-400/60 shrink-0 mt-0.5 group-hover:text-cyan-400 transition-colors" />
                      <div className="min-w-0">
                        <p className="text-sm truncate group-hover:text-cyan-400 transition-colors">{p.title}</p>
                        <p className="text-[10px] font-mono capitalize text-muted/60">{p.category}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="h-10 rounded-lg bg-[#1a1a2e]/50 animate-pulse" />
                ))}
              </div>
            )}
            <Link href="/projects"
              className="inline-flex items-center gap-1 mt-4 text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-mono group">
              All projects <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* ── Latest Blog col ───────────────────────────────── */}
          <div>
            <h4 className="text-light font-semibold mb-5 text-xs uppercase tracking-[0.15em] flex items-center gap-2">
              <span className="w-4 h-px bg-purple-400/60 inline-block" />
              Latest Posts
            </h4>
            {posts.length > 0 ? (
              <ul className="space-y-3">
                {posts.map(p => (
                  <li key={p._id}>
                    <Link href={`/blog/${p.slug}`}
                      className="group flex items-start gap-2 text-muted hover:text-light transition-colors">
                      <div className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-purple-400/50 group-hover:bg-purple-400 transition-colors" />
                      <div className="min-w-0">
                        <p className="text-sm line-clamp-2 group-hover:text-purple-300 transition-colors leading-snug">{p.title}</p>
                        <p className="text-[10px] font-mono text-muted/60 mt-0.5 flex items-center gap-1">
                          <Clock size={9} /> {p.readTime}m read
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="h-12 rounded-lg bg-[#1a1a2e]/50 animate-pulse" />
                ))}
              </div>
            )}
            <Link href="/blog"
              className="inline-flex items-center gap-1 mt-4 text-xs text-purple-400 hover:text-purple-300 transition-colors font-mono group">
              All posts <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────────── */}
        <div className="border-t border-[#1a1a2e] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted text-sm font-mono">
            &copy; {new Date().getFullYear()}{' '}
            <span className="text-green-400">Ashutosh Dubey</span>.
            {' '}Crafted with{' '}
            <span className="text-cyan-400">Next.js</span>,{' '}
            <span className="text-purple-400">Three.js</span> &{' '}
            <span className="text-green-400">❤</span>
          </p>
          <div className="flex items-center gap-4">
            <a href="https://crazydev.in" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-muted text-xs hover:text-green-400 transition-colors font-mono">
              <ExternalLink size={11} /> crazydev.in
            </a>
            <span className="text-muted text-xs">Lucknow, India 🇮🇳</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
