'use client';
import { motion } from 'framer-motion';

interface Props {
  label:    string;
  title:    string;
  subtitle?: string;
  center?:  boolean;
}

export default function SectionHeading({ label, title, subtitle, center = false }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`mb-16 ${center ? 'text-center' : ''}`}
    >
      <div className={`flex items-center gap-3 mb-4 ${center ? 'justify-center' : ''}`}>
        <div className="section-line" />
        <span className="text-green-400 font-mono text-xs uppercase tracking-[0.2em]">{label}</span>
      </div>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-light leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-muted text-lg max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
