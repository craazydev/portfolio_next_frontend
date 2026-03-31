'use client';
import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail, Code2, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LINKS = {
  nav:    [{ href: '/about', l: 'About' }, { href: '/projects', l: 'Projects' }, { href: '/blog', l: 'Blog' }, { href: '/contact', l: 'Contact' }],
  social: [
    { href: 'https://github.com/Ashutosh724425',                  icon: Github,   label: 'GitHub'   },
    { href: 'https://linkedin.com/in/ashutosh-dubey-78111225b/',  icon: Linkedin, label: 'LinkedIn' },
    { href: 'mailto:your@email.com',                              icon: Mail,     label: 'Email'    },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-[#1a1a2e] bg-[#080810]">
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                <Code2 size={18} className="text-white" />
              </div>
              <span className="font-mono font-bold text-lg">
                <span className="text-cyan-400">ash</span>
                <span className="text-light">utosh</span>
                <span className="text-purple-400">.</span>
              </span>
            </Link>
            <p className="text-muted text-sm leading-relaxed max-w-xs">
              Full Stack Developer from Lucknow. Building scalable web applications, APIs, and payment integrations.
            </p>
          </div>

          {/* Nav Links */}
          <div>
            <h4 className="text-light font-semibold mb-4 text-sm uppercase tracking-widest">Pages</h4>
            <ul className="space-y-2">
              {LINKS.nav.map(({ href, l }) => (
                <li key={href}>
                  <Link href={href} className="text-muted text-sm hover:text-cyan-400 transition-colors flex items-center gap-1 group">
                    <span>{l}</span>
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-light font-semibold mb-4 text-sm uppercase tracking-widest">Connect</h4>
            <div className="flex gap-3 mb-4">
              {LINKS.social.map(({ href, icon: Icon, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  className="w-10 h-10 rounded-lg glass flex items-center justify-center text-muted hover:text-cyan-400 hover:border-cyan-400/30 transition-colors border border-[#1a1a2e]"
                  aria-label={label}
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
            <Link href="/contact" className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
              Let's work together →
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1a1a2e] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted text-sm font-mono">
            &copy; {new Date().getFullYear()} Ashutosh Dubey. Crafted with{' '}
            <span className="text-cyan-400">Next.js</span> &amp;{' '}
            <span className="text-purple-400">Three.js</span>
          </p>
          <p className="text-muted text-xs">Lucknow, India 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}
