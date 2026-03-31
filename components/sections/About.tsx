'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, Coffee, Zap } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';

const SERVICES = [
  { icon: '⚡', title: 'Full Stack Development', desc: 'End-to-end web apps with React, Next.js, Node.js & MongoDB.' },
  { icon: '💳', title: 'Payment Integrations',   desc: 'Razorpay, PhonePe, Stripe — secure & PCI-compliant.' },
  { icon: '🔧', title: 'API Development',         desc: 'RESTful & GraphQL APIs, JWT auth, rate limiting.' },
  { icon: '🚀', title: 'SaaS Products',           desc: 'Multi-tenant architecture, subscriptions, dashboards.' },
];

const STACK = ['React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'MySQL', 'PHP', 'TypeScript', 'Tailwind CSS', 'Docker', 'Git', 'AWS'];

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function About() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const [profilePic, setProfilePic] = useState('');
  const [yearsExp, setYearsExp]     = useState(3);
  const [projects, setProjects]     = useState(25);

  useEffect(() => {
    fetch(`${API}/profile`)
      .then(r => r.json())
      .then(d => {
        if (d.data?.profilePic) setProfilePic(d.data.profilePic);
        if (d.data?.yearsExp)   setYearsExp(d.data.yearsExp);
        if (d.data?.projectsDone) setProjects(d.data.projectsDone);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="about" className="section-padding bg-[#0a0a14]" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          label="About Me"
          title="The developer behind the code"
          subtitle="Passionate about building things that live on the internet."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Image + info cards */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-sm mx-auto lg:mx-0">
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 blur-xl" />
              <div className="relative rounded-2xl overflow-hidden border border-[#1a1a2e] glass">
                <Image
                  src={profilePic || '/profile.jpg'}
                  alt="Ashutosh Dubey — Full Stack Developer"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                  priority
                  unoptimized={!!profilePic}
                />
              </div>

              {/* Floating info chips */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 glass rounded-xl px-4 py-3 border border-cyan-400/20"
              >
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-cyan-400" />
                  <span className="text-xs font-mono text-cyan-400">{yearsExp}+ yrs exp</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-4 -left-4 glass rounded-xl px-4 py-3 border border-purple-400/20"
              >
                <div className="flex items-center gap-2">
                  <Coffee size={14} className="text-purple-400" />
                  <span className="text-xs font-mono text-purple-400">{projects}+ projects</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right — Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 text-muted text-sm">
                <MapPin size={14} className="text-cyan-400" />
                Lucknow, India
              </div>
              <div className="flex items-center gap-2 text-muted text-sm">
                <Calendar size={14} className="text-cyan-400" />
                Since 2021
              </div>
            </div>

            <p className="text-light text-base leading-relaxed mb-4">
              I'm <span className="text-cyan-400 font-semibold">Ashutosh Dubey</span>, a Full Stack Developer
              with {yearsExp}+ years of experience building performant web applications. I specialize in
              creating everything from simple landing pages to complex SaaS platforms.
            </p>
            <p className="text-muted text-sm leading-relaxed mb-8">
              My strength lies in bridging the gap between design and functionality — writing clean,
              maintainable code that scales. I've built payment gateways, healthcare platforms, vCard
              generators, and multi-tenant CMS systems.
            </p>

            {/* Tech stack pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {STACK.map((s) => (
                <span key={s} className="tech-tag">{s}</span>
              ))}
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold text-sm hover:scale-105 transition-transform duration-300"
            >
              Let's Work Together →
            </Link>
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {SERVICES.map(({ icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="glass rounded-xl p-6 border border-[#1a1a2e] hover:border-cyan-400/20 group transition-all duration-300 hover:glow-cyan tilt-card"
            >
              <div className="text-3xl mb-4">{icon}</div>
              <h3 className="text-light font-semibold text-sm mb-2 group-hover:text-cyan-400 transition-colors">{title}</h3>
              <p className="text-muted text-xs leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
