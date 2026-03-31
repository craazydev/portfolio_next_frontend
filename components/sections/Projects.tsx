'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { getProjects } from '@/lib/api';

const FILTERS = ['All', 'fullstack', 'frontend', 'backend', 'tool'];

interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  tech: string[];
  category: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

// Fallback static projects (used if API is unavailable)
const STATIC_PROJECTS: Project[] = [
  {
    _id: '1', title: 'Dr. Helper', slug: 'dr-helper',
    description: 'Healthcare platform for skin disease diagnosis with AI-assisted treatment recommendations.',
    thumbnail: '/projects/drhelper.webp', tech: ['PHP', 'MySQL', 'Bootstrap', 'JavaScript'],
    category: 'fullstack', liveUrl: 'https://drhelper.crazydev.in/', featured: true,
  },
  {
    _id: '2', title: 'PhonePe Payment Gateway', slug: 'phonepay-gateway',
    description: 'Complete PhonePe payment integration with webhook handling and transaction logging.',
    thumbnail: '/projects/phonepay.webp', tech: ['PHP', 'PhonePe API', 'MySQL'],
    category: 'backend', featured: true,
  },
  {
    _id: '3', title: 'VCard QR Generator', slug: 'vcard-generator',
    description: 'Dynamic vCard generator with QR code export. Used by 1000+ users.',
    thumbnail: '/projects/vcard.webp', tech: ['PHP', 'QR Library', 'CSS'],
    category: 'tool', liveUrl: '#', featured: true,
  },
  {
    _id: '4', title: 'Micasa Interiors', slug: 'micasa-interiors',
    description: 'Interior design portfolio website with gallery and project showcase.',
    thumbnail: '/projects/micasa.webp', tech: ['PHP', 'MySQL', 'Bootstrap'],
    category: 'fullstack',
  },
];

export default function Projects() {
  const [filter,   setFilter]   = useState('All');
  const [projects, setProjects] = useState<Project[]>(STATIC_PROJECTS);

  useEffect(() => {
    getProjects().then((data) => { if (data.length) setProjects(data); }).catch(() => {});
  }, []);

  const filtered = filter === 'All'
    ? projects
    : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="section-padding bg-[#0a0a14]">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          label="Projects"
          title="Things I've built"
          subtitle="A collection of projects — from healthcare platforms to payment gateways."
        />

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-mono transition-all duration-300 capitalize ${
                filter === f
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold'
                  : 'glass border border-[#1a1a2e] text-muted hover:text-light hover:border-cyan-400/20'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Project grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((project, i) => (
              <motion.article
                key={project._id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="glass rounded-2xl border border-[#1a1a2e] overflow-hidden group hover:border-cyan-400/20 transition-all duration-300 tilt-card"
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-[#0f0f1a] overflow-hidden">
                  {project.thumbnail ? (
                    <Image
                      src={project.thumbnail}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl opacity-20 font-black text-gradient">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  {project.featured && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-mono bg-cyan-400/20 border border-cyan-400/30 text-cyan-400">
                      Featured
                    </span>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-transparent to-transparent opacity-60" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-light font-bold text-base group-hover:text-cyan-400 transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex gap-2 shrink-0">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                          className="text-muted hover:text-light transition-colors p-1">
                          <Github size={15} />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                          className="text-muted hover:text-cyan-400 transition-colors p-1">
                          <ExternalLink size={15} />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-muted text-xs leading-relaxed mb-4 line-clamp-2">{project.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech.slice(0, 4).map((t) => (
                      <span key={t} className="tech-tag">{t}</span>
                    ))}
                    {project.tech.length > 4 && (
                      <span className="tech-tag">+{project.tech.length - 4}</span>
                    )}
                  </div>

                  <Link href={`/projects/${project.slug}`}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 group/link">
                    View details <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View all */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-gradient text-cyan-400 font-semibold text-sm hover:glow-cyan transition-all duration-300"
          >
            View All Projects <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
