'use client';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionHeading from '@/components/ui/SectionHeading';

const SkillsOrbit = dynamic(() => import('@/components/3d/SkillsOrbit'), { ssr: false });

const SKILL_BARS = [
  { name: 'React / Next.js',     level: 90, color: '#61dafb' },
  { name: 'Node.js / Express',   level: 85, color: '#68a063' },
  { name: 'MongoDB / MySQL',     level: 80, color: '#47a248' },
  { name: 'PHP / Laravel',       level: 75, color: '#8892bf' },
  { name: 'TypeScript',          level: 78, color: '#3178c6' },
  { name: 'Payment APIs',        level: 88, color: '#00d4ff' },
  { name: 'REST / GraphQL APIs', level: 82, color: '#e10098' },
  { name: 'Docker / AWS',        level: 65, color: '#ff9900' },
];

function SkillBar({ name, level, color, delay }: typeof SKILL_BARS[0] & { delay: number }) {
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true });

  return (
    <div ref={ref} className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <span className="text-light text-sm font-medium">{name}</span>
        <span className="text-muted text-xs font-mono">{level}%</span>
      </div>
      <div className="h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, #a855f7)`, boxShadow: `0 0 10px ${color}66` }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="section-padding bg-[#080810]">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          label="Skills"
          title="Technologies I work with"
          subtitle="From frontend to infrastructure — full stack all the way."
          center
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* 3D Orbit */}
          <div className="h-[420px] w-full">
            <SkillsOrbit />
          </div>

          {/* Skill bars */}
          <div>
            {SKILL_BARS.map(({ name, level, color }, i) => (
              <SkillBar key={name} name={name} level={level} color={color} delay={i * 0.1} />
            ))}
          </div>
        </div>

        {/* Tool badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4"
        >
          {[
            { name: 'VS Code',  bg: '#007acc22', border: '#007acc44' },
            { name: 'Postman',  bg: '#ff6c3722', border: '#ff6c3744' },
            { name: 'Figma',    bg: '#a259ff22', border: '#a259ff44' },
            { name: 'GitHub',   bg: '#ffffff10', border: '#ffffff20' },
            { name: 'Vercel',   bg: '#ffffff10', border: '#ffffff20' },
            { name: 'Railway',  bg: '#7000ff22', border: '#7000ff44' },
          ].map(({ name, bg, border }) => (
            <div
              key={name}
              className="rounded-xl px-4 py-3 text-center text-sm font-mono text-muted hover:text-light transition-colors"
              style={{ background: bg, border: `1px solid ${border}` }}
            >
              {name}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
