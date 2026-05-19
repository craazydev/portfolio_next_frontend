'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Code2 } from 'lucide-react';

const NAV_LINKS = [
  { href: '/',         label: 'Home'     },
  { href: '/about',    label: 'About'    },
  { href: '/projects', label: 'Projects' },
  { href: '/blog',     label: 'Blog'     },
  { href: '/contact',  label: 'Contact'  },
];

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass border-b border-[#1a1a2e] py-3' : 'py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #28e98c)', boxShadow: '0 0 16px rgba(40,233,140,0.3)' }}>
              <Code2 size={18} className="text-white" />
            </div>
            <span className="font-mono font-bold text-lg">
              <span className="text-green-400">ash</span>
              <span className="text-light">utosh</span>
              <span className="text-cyan-400">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg ${
                    active ? 'text-green-400' : 'text-muted hover:text-light'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: 'rgba(40,233,140,0.08)', border: '1px solid rgba(40,233,140,0.2)' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* CTA + Toggle */}
          <div className="flex items-center gap-3">
            <Link href="/contact"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #28e98c)', boxShadow: '0 0 20px rgba(40,233,140,0.2)' }}>
              Hire Me
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl glass text-light"
              aria-label="Toggle menu">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[68px] left-0 right-0 z-40 glass border-b border-[#1a1a2e] md:hidden"
          >
            <nav className="flex flex-col p-5 gap-1.5">
              {NAV_LINKS.map(({ href, label }) => (
                <Link key={href} href={href}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                    pathname === href
                      ? 'text-green-400'
                      : 'text-muted hover:text-light hover:bg-white/5'
                  }`}
                  style={pathname === href ? { background: 'rgba(40,233,140,0.08)', border: '1px solid rgba(40,233,140,0.2)' } : {}}>
                  {label}
                </Link>
              ))}
              <Link href="/contact"
                className="mt-2 py-3 px-4 rounded-xl text-sm font-semibold text-center text-white"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #28e98c)' }}>
                Hire Me
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
