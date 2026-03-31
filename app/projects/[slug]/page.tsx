import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { ExternalLink, Github, ArrowLeft } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getProject(slug: string) {
  try {
    const res = await fetch(`${API}/projects/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProject(params.slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title:       project.title,
    description: project.description,
    openGraph:   { title: project.title, description: project.description, images: project.thumbnail ? [project.thumbnail] : [] },
  };
}

export default async function ProjectDetail({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 min-h-screen bg-[#080810]">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/projects" className="inline-flex items-center gap-2 text-muted hover:text-cyan-400 text-sm mb-8 transition-colors">
            <ArrowLeft size={14} /> Back to Projects
          </Link>

          {project.thumbnail && (
            <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8 border border-[#1a1a2e]">
              <Image src={project.thumbnail} alt={project.title} fill className="object-cover" />
            </div>
          )}

          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <span className="tech-tag capitalize mb-2 inline-block">{project.category}</span>
              <h1 className="text-3xl md:text-4xl font-black text-light mt-2">{project.title}</h1>
            </div>
            <div className="flex gap-3">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-[#1a1a2e] text-sm text-muted hover:text-light transition-colors">
                  <Github size={15} /> GitHub
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold text-sm">
                  <ExternalLink size={15} /> Live Demo
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {project.tech.map((t: string) => <span key={t} className="tech-tag">{t}</span>)}
          </div>

          <div className="prose prose-invert prose-sm max-w-none text-muted leading-relaxed">
            <p className="text-base text-light mb-4">{project.description}</p>
            {project.longDesc && <p>{project.longDesc}</p>}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
