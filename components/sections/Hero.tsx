'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { ArrowRight, Download, Github, Linkedin, MousePointer2 } from 'lucide-react';

const HeroScene = dynamic(() => import('@/components/3d/HeroScene'), { ssr: false });

const STATS = [
  { value: '3+', label: 'Years Experience' },
  { value: '25+', label: 'Projects Delivered' },
  { value: '20+', label: 'Full Stack Apps' },
  { value: '5★', label: 'Client Rating' },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen hero-gradient flex items-center overflow-hidden">
      {/* 3D Canvas — right side */}
      <div className="absolute inset-0 md:left-1/2">
        <HeroScene />
      </div>

      {/* Radial fade overlay so text is readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#080810] via-[#080810]/80 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20 w-full">
        <div className="max-w-2xl">
          {/* Available badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-green-400/20 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-mono">Available for work</span>
          </motion.div>

          {/* Code tags decoration */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="code-tag mb-3"
          >
            &lt;developer&gt;
          </motion.p>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4"
          >
            Hi, I'm{' '}
            <span className="text-gradient block">Ashutosh Dubey</span>
          </motion.h1>

          {/* Typewriter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-muted font-mono mb-6 h-8"
          >
            <TypeAnimation
              sequence={[
                'Full Stack Developer',    2000,
                'React & Next.js Expert',  2000,
                'Node.js Engineer',        2000,
                'API Architect',           2000,
                'Payment Integration Pro', 2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="text-cyan-400"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-muted text-base leading-relaxed mb-8 max-w-lg"
          >
            Building scalable web applications with clean architecture. Specialized in
            full-stack development, payment integrations (Razorpay, PhonePe), and SaaS products.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <Link
              href="/projects"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold text-sm hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
            >
              View My Work <ArrowRight size={16} />
            </Link>
            <a
              href="/resume.pdf"
              download
              className="flex items-center gap-2 px-6 py-3 rounded-xl glass border border-[#1a1a2e] text-light font-semibold text-sm hover:border-cyan-400/40 hover:text-cyan-400 transition-all duration-300"
            >
              <Download size={16} /> Download CV
            </a>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-4 mb-12"
          >
            <a href="https://github.com/Ashutosh724425" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg glass border border-[#1a1a2e] flex items-center justify-center text-muted hover:text-cyan-400 hover:border-cyan-400/30 transition-all">
              <Github size={18} />
            </a>
            <a href="https://linkedin.com/in/ashutosh-dubey-78111225b/" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg glass border border-[#1a1a2e] flex items-center justify-center text-muted hover:text-cyan-400 hover:border-cyan-400/30 transition-all">
              <Linkedin size={18} />
            </a>
            <span className="text-muted text-sm font-mono">@Ashutosh724425</span>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {STATS.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0 + i * 0.1 }}
                className="glass rounded-xl p-4 border border-[#1a1a2e] text-center hover:border-cyan-400/20 transition-colors"
              >
                <div className="text-2xl font-black text-gradient">{value}</div>
                <div className="text-xs text-muted mt-1 leading-tight">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Closing tag */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="code-tag mt-8"
        >
          &lt;/developer&gt;
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted"
      >
        <MousePointer2 size={16} className="animate-bounce" />
        <span className="text-xs font-mono">scroll</span>
      </motion.div>
    </section>
  );
}
