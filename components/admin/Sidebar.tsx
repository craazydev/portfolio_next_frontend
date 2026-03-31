'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderOpen, FileText, MessageSquare,
  User, ExternalLink, LogOut, Code2, Menu, X, ChevronRight,
  Bot, BookOpen,
} from 'lucide-react';

const NAV = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard'     },
  { href: '/admin/projects',  icon: FolderOpen,      label: 'Projects'      },
  { href: '/admin/blog',      icon: FileText,         label: 'Blog Posts'   },
  { href: '/admin/messages',  icon: MessageSquare,    label: 'Messages'     },
  { href: '/admin/chats',     icon: Bot,              label: 'AI Chats'     },
  { href: '/admin/knowledge', icon: BookOpen,         label: 'Knowledge Base'},
  { href: '/admin/profile',   icon: User,             label: 'Profile'      },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router   = useRouter();

  const logout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-[#1a1a2e]">
        <Link href="/admin/dashboard" className="flex items-center gap-3" onClick={onClose}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center glow-cyan shrink-0">
            <Code2 size={18} className="text-white" />
          </div>
          <div>
            <p className="text-light font-bold text-sm leading-none">CMS Panel</p>
            <p className="text-muted text-xs mt-0.5">ashutosh.dev</p>
          </div>
        </Link>
        {/* Mobile close */}
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-muted hover:text-light transition-colors p-1">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-muted text-[10px] uppercase tracking-widest px-3 mb-3">Menu</p>
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} onClick={onClose}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                active
                  ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20'
                  : 'text-muted hover:text-light hover:bg-white/5'
              }`}
            >
              <Icon size={17} className="shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={13} className="text-cyan-400/60" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-[#1a1a2e] space-y-1">
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted hover:text-light hover:bg-white/5 transition-all">
          <ExternalLink size={17} className="shrink-0" />
          View Site
        </a>
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted hover:text-red-400 hover:bg-red-400/5 transition-all">
          <LogOut size={17} className="shrink-0" />
          Logout
        </button>

        {/* Admin badge */}
        <div className="flex items-center gap-3 px-3 py-3 mt-2 rounded-xl glass border border-[#1a1a2e]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border border-cyan-400/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 text-xs font-bold">AD</span>
          </div>
          <div className="min-w-0">
            <p className="text-light text-xs font-semibold truncate">Ashutosh Dubey</p>
            <p className="text-muted text-[10px] truncate">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Desktop sidebar ──────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 min-h-screen bg-[#0a0a14] border-r border-[#1a1a2e] sticky top-0">
        <SidebarContent />
      </aside>

      {/* ── Mobile topbar ────────────────────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 glass border-b border-[#1a1a2e] flex items-center justify-between px-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
            <Code2 size={14} className="text-white" />
          </div>
          <span className="text-light font-bold text-sm font-mono">CMS Panel</span>
        </Link>
        <button onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg glass border border-[#1a1a2e] text-light">
          <Menu size={18} />
        </button>
      </div>

      {/* ── Mobile drawer overlay ─────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#0a0a14] border-r border-[#1a1a2e] flex flex-col"
            >
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
