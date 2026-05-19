'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ExternalLink, Github, ArrowRight, FolderOpen } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';

const FILTERS = ['All', 'fullstack', 'frontend', 'backend', 'tool'];
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[#1a1a2e] overflow-hidden animate-pulse"
      style={{ background: 'rgba(10,10,20,0.6)' }}>
      <div className="h-48 bg-[#1a1a2e]" />
      <div className="p-6 space-y-3">
        <div className="h-4 bg-[#1a1a2e] rounded w-2/3" />
        <div className="h-3 bg-[#1a1a2e] rounded w-full" />
        <div className="h-3 bg-[#1a1a2e] rounded w-4/5" />
        <div className="flex gap-2 pt-1">
          {[1,2,3].map(i => <div key={i} className="h-5 w-14 bg-[#1a1a2e] rounded-full" />)}
        </div>
      </div>
    </div>
  );
}

function ProjectImage({ src, alt }: { src: string; alt: string }) {
  const [err, setErr] = useState(false);
  if (err || !src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0a0a14]">
        <FolderOpen size={36} className="text-[#1a1a2e]" />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setErr(true)}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
  );
}

export default function Projects() {
  const [filter,   setFilter]   = useState('All');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetch(`${API}/projects`)
      .then(r => r.json())
      .then(d => { if (d.data) setProjects(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All'
    ? projects
    : projects.filter(p => p.category === filter);

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
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-mono transition-all duration-300 capitalize ${
                filter === f
                  ? 'text-white font-bold'
                  : 'text-muted hover:text-light'
              }`}
              style={filter === f ? {
                background: 'linear-gradient(135deg, #00d4ff, #28e98c)',
                boxShadow: '0 0 16px rgba(40,233,140,0.2)',
              } : {
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-muted">No projects yet.</div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((project, i) => (
                <motion.article
                  key={project._id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  className="group rounded-2xl border border-[#1a1a2e] overflow-hidden hover:border-green-400/15 transition-all duration-300"
                  style={{ background: 'rgba(10,10,20,0.6)' }}
                  whileHover={{ y: -4 }}
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-[#0a0a14] overflow-hidden">
                    <ProjectImage src={project.thumbnail || ''} alt={project.title} />

                    {project.featured && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold z-10"
                        style={{ background: 'rgba(40,233,140,0.15)', border: '1px solid rgba(40,233,140,0.3)', color: '#28e98c' }}>
                        Featured
                      </span>
                    )}
                    {/* Bottom fade */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0a0a14] to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="text-light font-bold text-base group-hover:text-green-400 transition-colors leading-snug">
                        {project.title}
                      </h3>
                      <div className="flex gap-1.5 shrink-0">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-light transition-colors"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                            <Github size={13} />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-cyan-400 transition-colors"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-muted text-xs leading-relaxed mb-4 line-clamp-2">{project.description}</p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tech.slice(0, 4).map(t => (
                        <span key={t} className="tech-tag">{t}</span>
                      ))}
                      {project.tech.length > 4 && (
                        <span className="tech-tag">+{project.tech.length - 4}</span>
                      )}
                    </div>

                    <Link href={`/projects/${project.slug}`}
                      className="text-xs font-mono flex items-center gap-1 group/link transition-colors"
                      style={{ color: '#28e98c' }}>
                      View details
                      <ArrowRight size={11} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* View all */}
        {!loading && projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-green-400 transition-all hover:scale-105"
              style={{ background: 'rgba(40,233,140,0.07)', border: '1px solid rgba(40,233,140,0.2)' }}>
              View All Projects <ArrowRight size={15} />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
