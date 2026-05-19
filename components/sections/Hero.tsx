'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { ArrowRight, Download, Github, Linkedin, Zap, Code2, Database, Globe, Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const HeroScene = dynamic(() => import('@/components/3d/HeroScene'), { ssr: false });

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/* ── Floating code snippets in background ──────────────────────── */
const CODE_SNIPPETS = [
  { text: 'const dev = new Ashutosh()',     x: '8%',  y: '18%', delay: 0    },
  { text: 'npm run build --production',      x: '72%', y: '12%', delay: 0.4  },
  { text: 'git push origin main',            x: '82%', y: '55%', delay: 0.8  },
  { text: 'docker-compose up -d',            x: '5%',  y: '72%', delay: 0.3  },
  { text: 'SELECT * FROM portfolio',         x: '65%', y: '80%', delay: 0.6  },
  { text: '{ status: 200, ok: true }',       x: '18%', y: '88%', delay: 1.0  },
];

/* ── Orbiting skill badges ──────────────────────────────────────── */
const SKILLS = [
  { label: 'React',    color: '#00d4ff', icon: '⚛️',  r: 0    },
  { label: 'Node.js',  color: '#28e98c', icon: '🟢',  r: 72   },
  { label: 'MongoDB',  color: '#28e98c', icon: '🍃',  r: 144  },
  { label: 'Next.js',  color: '#a855f7', icon: '▲',   r: 216  },
  { label: 'TypeScript', color: '#00d4ff', icon: '📘', r: 288  },
];

/* ── Animated stat counter ──────────────────────────────────────── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = Math.ceil(to / 40);
        const t = setInterval(() => {
          start = Math.min(start + step, to);
          setCount(start);
          if (start >= to) clearInterval(t);
        }, 35);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 600], [0, -80]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  const [profile, setProfile] = useState({ yearsExp: 3, projectsDone: 25, github: 'https://github.com/Ashutosh724425', linkedin: 'https://linkedin.com/in/ashutosh-dubey-78111225b/', resumeUrl: '' });

  useEffect(() => {
    fetch(`${API}/profile`).then(r => r.json()).then(d => {
      if (d.data) setProfile(p => ({
        ...p,
        yearsExp: d.data.yearsExp || p.yearsExp,
        projectsDone: d.data.projectsDone || p.projectsDone,
        github: d.data.social?.github || p.github,
        linkedin: d.data.social?.linkedin || p.linkedin,
        resumeUrl: d.data.resumeUrl || '',
      }));
    }).catch(() => {});
  }, []);

  const STATS = [
    { value: profile.yearsExp,    suffix: '+', label: 'Years Exp',    icon: Zap,      color: '#00d4ff' },
    { value: profile.projectsDone, suffix: '+', label: 'Projects',     icon: Code2,    color: '#28e98c' },
    { value: 20,                  suffix: '+', label: 'APIs Built',   icon: Database, color: '#a855f7' },
    { value: 5,                   suffix: '★', label: 'Client Rating', icon: Star,    color: '#f59e0b' },
  ];

  return (
    <section ref={containerRef} className="relative min-h-screen hero-gradient grid-bg flex items-center overflow-hidden">

      {/* ── Animated background orbs ─────────────────────────── */}
      <motion.div style={{ y: y1, opacity }}
        className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large slow orbs */}
        <motion.div
          className="absolute w-[700px] h-[700px] rounded-full"
          style={{ top: '-20%', left: '-15%', background: 'radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1], x: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{ bottom: '-15%', right: '-10%', background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{ top: '40%', left: '40%', background: 'radial-gradient(circle, rgba(40,233,140,0.05) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.3, 1], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </motion.div>

      {/* ── Floating code snippets ───────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
        {CODE_SNIPPETS.map((s, i) => (
          <motion.div
            key={i}
            className="absolute font-mono text-xs px-3 py-1.5 rounded-lg"
            style={{
              left: s.x, top: s.y,
              background: 'rgba(10,10,20,0.7)',
              border: '1px solid rgba(40,233,140,0.12)',
              color: 'rgba(40,233,140,0.45)',
              backdropFilter: 'blur(8px)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: [0, 0.7, 0.7, 0], y: [20, 0, 0, -20] }}
            transition={{ duration: 6, delay: s.delay + 1.5, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
          >
            {s.text}
          </motion.div>
        ))}
      </div>

      {/* ── 3D Canvas (right side) ───────────────────────────── */}
      <div className="absolute inset-0 md:left-1/2">
        <HeroScene />
      </div>

      {/* Gradient fade overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#06060f] via-[#06060f]/85 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#06060f]/40 via-transparent to-transparent pointer-events-none" />

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20 w-full">
        <div className="max-w-2xl">

          {/* Available badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: 'rgba(40,233,140,0.08)',
              border: '1px solid rgba(40,233,140,0.25)',
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            <span className="text-green-400 text-xs font-mono tracking-wider">Available for work</span>
          </motion.div>

          {/* Code tag */}
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="code-tag mb-3"
          >&lt;developer&gt;</motion.p>

          {/* Main heading — split word animation */}
          <div className="mb-4">
            {['Hi,', "I'm"].map((word, wi) => (
              <motion.span
                key={wi}
                className="text-5xl md:text-6xl lg:text-7xl font-black text-light inline-block mr-4"
                initial={{ opacity: 0, y: 60, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.3 + wi * 0.1, duration: 0.7, ease: [0.2, 0, 0, 1] }}
              >
                {word}
              </motion.span>
            ))}
            <br />
            <motion.span
              className="text-5xl md:text-6xl lg:text-7xl font-black shimmer-text inline-block"
              initial={{ opacity: 0, y: 60, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.2, 0, 0, 1] }}
            >
              Ashutosh Dubey
            </motion.span>
          </div>

          {/* Typewriter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="text-xl md:text-2xl font-mono mb-6 h-8 flex items-center gap-3"
          >
            <span className="text-muted">//</span>
            <TypeAnimation
              sequence={[
                'Full Stack Developer',    2000,
                'React & Next.js Expert',  2000,
                'Node.js Engineer',        2000,
                'Payment Integration Pro', 2000,
                'API Architect',           2000,
                'Open Source Builder',     2000,
              ]}
              wrapper="span"
              speed={55}
              repeat={Infinity}
              className="text-green-400"
            />
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="text-muted text-base leading-relaxed mb-8 max-w-lg"
          >
            Building <span className="text-cyan-400 font-medium">scalable web apps</span> with clean architecture.
            Expert in full-stack development, <span className="text-green-400 font-medium">Razorpay & PhonePe</span> integrations, and modern SaaS products.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="flex flex-wrap gap-4 mb-10"
          >
            <Link href="/projects"
              className="group relative flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #28e98c)' }}>
              <span className="relative z-10 flex items-center gap-2">
                View My Work <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            {profile.resumeUrl ? (
              <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer"
                className="group flex items-center gap-2 px-7 py-3.5 rounded-xl glass-green text-green-400 font-semibold text-sm hover:text-green-300 transition-all">
                <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                Download CV
              </a>
            ) : (
              <a href="/resume.pdf" download
                className="group flex items-center gap-2 px-7 py-3.5 rounded-xl glass-green text-green-400 font-semibold text-sm hover:text-green-300 transition-all">
                <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                Download CV
              </a>
            )}
          </motion.div>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95 }}
            className="flex items-center gap-4 mb-12"
          >
            {[
              { href: profile.github,   icon: Github,   label: 'GitHub',   hoverColor: 'hover:text-light' },
              { href: profile.linkedin, icon: Linkedin, label: 'LinkedIn', hoverColor: 'hover:text-cyan-400' },
            ].map(({ href, icon: Icon, label, hoverColor }) => (
              <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ y: -3, scale: 1.05 }}
                className={`w-11 h-11 rounded-xl glass border border-[#1a1a2e] flex items-center justify-center text-muted ${hoverColor} transition-colors`}>
                <Icon size={18} />
              </motion.a>
            ))}
            <div className="h-px w-12 bg-gradient-to-r from-[#1a1a2e] to-transparent" />
            <span className="text-muted text-xs font-mono">@Ashutosh724425</span>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {STATS.map(({ value, suffix, label, icon: Icon, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 + i * 0.08 }}
                whileHover={{ y: -3, scale: 1.04 }}
                className="relative glass rounded-xl p-4 border border-[#1a1a2e] text-center group overflow-hidden cursor-default"
              >
                {/* Color bleed on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `radial-gradient(circle at 50% 50%, ${color}10 0%, transparent 70%)` }} />
                <Icon size={16} className="mx-auto mb-2 relative z-10" style={{ color }} />
                <div className="text-2xl font-black relative z-10" style={{ color }}>
                  <Counter to={value} suffix={suffix} />
                </div>
                <div className="text-xs text-muted mt-0.5 relative z-10">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Closing tag */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="code-tag mt-10"
        >&lt;/developer&gt;</motion.p>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-green-400/30 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-green-400" />
        </motion.div>
        <span className="text-muted text-[10px] font-mono tracking-widest uppercase">scroll</span>
      </motion.div>

      {/* ── Orbiting skill pills (desktop only) ─────────────── */}
      <div className="absolute right-[4%] top-1/2 -translate-y-1/2 w-16 hidden xl:flex flex-col gap-3 items-center">
        {SKILLS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4 + i * 0.1 }}
            whileHover={{ x: -6, scale: 1.05 }}
            className="glass rounded-lg px-3 py-1.5 text-xs font-mono cursor-default whitespace-nowrap"
            style={{ border: `1px solid ${s.color}25`, color: s.color }}
          >
            {s.icon} {s.label}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
