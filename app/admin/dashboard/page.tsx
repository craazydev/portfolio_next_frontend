'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FolderOpen, FileText, MessageSquare, User } from 'lucide-react';

interface Stats { projects: number; blogs: number; messages: number; }

const CARDS = [
  { href: '/admin/projects', icon: FolderOpen,    label: 'Projects',  key: 'projects', color: '#00d4ff' },
  { href: '/admin/blog',     icon: FileText,       label: 'Blog Posts',key: 'blogs',    color: '#a855f7' },
  { href: '/admin/messages', icon: MessageSquare,  label: 'Messages',  key: 'messages', color: '#f59e0b' },
];

export default function Dashboard() {
  const router  = useRouter();
  const [stats, setStats] = useState<Stats>({ projects: 0, blogs: 0, messages: 0 });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { router.push('/admin'); return; }

    // Verify token
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => { if (!r.ok) { router.push('/admin'); } });

    // Fetch counts (best effort)
    const headers = { Authorization: `Bearer ${token}` };
    Promise.allSettled([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, { headers }).then((r) => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog`,     { headers }).then((r) => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`,  { headers }).then((r) => r.json()),
    ]).then(([p, b, m]) => {
      setStats({
        projects: p.status === 'fulfilled' ? (p.value.count ?? 0) : 0,
        blogs:    b.status === 'fulfilled' ? (b.value.total ?? 0) : 0,
        messages: m.status === 'fulfilled' ? (m.value.count ?? 0) : 0,
      });
    });
  }, [router]);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-light">Good to see you, <span className="text-gradient">Ashutosh</span> 👋</h1>
          <p className="text-muted text-sm mt-1">Manage your portfolio content from here.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {CARDS.map(({ href, icon: Icon, label, key, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={href} className="block glass rounded-2xl border border-[#1a1a2e] p-6 hover:border-cyan-400/20 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                    <Icon size={20} style={{ color }} />
                  </div>
                  <span className="text-3xl font-black" style={{ color }}>
                    {stats[key as keyof Stats]}
                  </span>
                </div>
                <p className="text-light text-sm font-semibold group-hover:text-cyan-400 transition-colors">{label}</p>
                <p className="text-muted text-xs mt-1">Manage →</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick actions */}
        <h2 className="text-light font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { href: '/admin/projects', label: '+ Add New Project',  icon: FolderOpen   },
            { href: '/admin/blog',     label: '+ Write Blog Post',   icon: FileText     },
            { href: '/admin/messages', label: 'View Messages',       icon: MessageSquare },
            { href: '/admin/profile',  label: 'Edit Profile',        icon: User         },
          ].map(({ href, label, icon: Icon }) => (
            <Link key={label} href={href}
              className="flex items-center gap-3 glass rounded-xl border border-[#1a1a2e] p-4 text-sm text-muted hover:text-cyan-400 hover:border-cyan-400/20 transition-all">
              <Icon size={16} /> {label}
            </Link>
          ))}
        </div>
    </div>
  );
}
