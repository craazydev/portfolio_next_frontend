import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { ExternalLink, Github, ArrowLeft, Calendar, Tag } from 'lucide-react';

const API      = process.env.NEXT_PUBLIC_API_URL  || 'http://localhost:5000/api';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio.crazydev.in';

async function getProject(slug: string) {
  try {
    const res = await fetch(`${API}/projects/${slug}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const res  = await fetch(`${API}/projects`);
    const data = await res.json();
    return (data.data ?? []).map((p: { slug: string }) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProject(params.slug);
  if (!project) return { title: 'Project Not Found' };

  const title       = `${project.title} | Ashutosh Dubey`;
  const description = project.description;
  const url         = `${SITE_URL}/projects/${params.slug}`;
  const image       = project.thumbnail || `${SITE_URL}/og-image.png`;

  return {
    title,
    description,
    keywords:   project.tech ?? [],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type:   'website',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
      images:      [image],
    },
  };
}

export default async function ProjectDetail({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  const url = `${SITE_URL}/projects/${params.slug}`;

  const projectSchema = {
    '@context':   'https://schema.org',
    '@type':      'SoftwareApplication',
    name:         project.title,
    description:  project.description,
    url,
    image:        project.thumbnail || `${SITE_URL}/og-image.png`,
    author: {
      '@type': 'Person',
      name:    'Ashutosh Dubey',
      url:     SITE_URL,
    },
    applicationCategory: 'WebApplication',
    ...(project.liveUrl  && { sameAs: project.liveUrl }),
    ...(project.tech?.length && { keywords: project.tech.join(', ') }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      <Navbar />
      <main className="pt-24 pb-20 min-h-screen bg-[#06060f]">
        <div className="max-w-4xl mx-auto px-6">

          <Link href="/projects"
            className="inline-flex items-center gap-2 text-muted hover:text-green-400 text-sm mb-8 transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Projects
          </Link>

          {project.thumbnail && (
            <div className="relative rounded-2xl overflow-hidden mb-8 border border-[#1a1a2e]"
              style={{ background: '#0a0a14' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-64 md:h-96 object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          )}

          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="tech-tag capitalize">{project.category}</span>
                {project.featured && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold"
                    style={{ background: 'rgba(40,233,140,0.12)', border: '1px solid rgba(40,233,140,0.25)', color: '#28e98c' }}>
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-light">{project.title}</h1>
              {project.createdAt && (
                <p className="text-muted text-xs font-mono mt-2 flex items-center gap-1.5">
                  <Calendar size={11} />
                  {new Date(project.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}
                </p>
              )}
            </div>

            <div className="flex gap-3 shrink-0">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-muted hover:text-light transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Github size={15} /> GitHub
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white hover:scale-105 transition-all"
                  style={{ background: 'linear-gradient(135deg, #00d4ff, #28e98c)', boxShadow: '0 0 20px rgba(40,233,140,0.2)' }}>
                  <ExternalLink size={15} /> Live Demo
                </a>
              )}
            </div>
          </div>

          {project.tech?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-[#1a1a2e]">
              <Tag size={13} className="text-muted mt-0.5 shrink-0" />
              {project.tech.map((t: string) => (
                <span key={t} className="tech-tag">{t}</span>
              ))}
            </div>
          )}

          <div className="space-y-6">
            <p className="text-light text-base leading-relaxed">{project.description}</p>

            {project.longDesc && (
              <div
                className="rich-content text-muted text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: project.longDesc }}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />

      <style>{`
        .rich-content h1 { font-size: 1.4rem; font-weight: 800; color: #f1f5f9; margin: 1.2rem 0 0.5rem; }
        .rich-content h2 { font-size: 1.15rem; font-weight: 700; color: #f1f5f9; margin: 1rem 0 0.4rem; }
        .rich-content h3 { font-size: 1rem; font-weight: 600; color: #e2e8f0; margin: 0.8rem 0 0.3rem; }
        .rich-content p  { margin: 0.5rem 0; }
        .rich-content a  { color: #28e98c; text-decoration: underline; }
        .rich-content strong { color: #f1f5f9; font-weight: 700; }
        .rich-content em { font-style: italic; color: #94a3b8; }
        .rich-content code { background: #1a1a2e; color: #00d4ff; padding: 0.1em 0.4em; border-radius: 4px; font-size: 0.82em; font-family: 'JetBrains Mono', monospace; }
        .rich-content pre { background: #0d0d1a; border: 1px solid #1a1a2e; border-radius: 10px; padding: 1rem; margin: 0.75rem 0; overflow-x: auto; }
        .rich-content pre code { background: none; color: #a5f3fc; padding: 0; font-size: 0.82rem; }
        .rich-content ul { list-style: disc; padding-left: 1.4rem; }
        .rich-content ol { list-style: decimal; padding-left: 1.4rem; }
        .rich-content li { margin: 0.25rem 0; }
        .rich-content blockquote { border-left: 3px solid #28e98c; padding-left: 1rem; color: #64748b; font-style: italic; margin: 0.8rem 0; }
        .rich-content hr { border: none; border-top: 1px solid #1a1a2e; margin: 1.2rem 0; }
      `}</style>
    </>
  );
}
