import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';

const API      = process.env.NEXT_PUBLIC_API_URL  || 'http://localhost:5000/api';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio.crazydev.in';

async function getPost(slug: string) {
  try {
    const res = await fetch(`${API}/blog/${slug}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const res  = await fetch(`${API}/blog?limit=200`);
    const data = await res.json();
    return (data.data ?? []).map((p: { slug: string }) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Post Not Found' };

  const title       = post.metaTitle || post.title;
  const description = post.metaDesc  || post.excerpt;
  const url         = `${SITE_URL}/blog/${params.slug}`;
  const image       = post.thumbnail || `${SITE_URL}/og-image.png`;

  return {
    title,
    description,
    keywords:   post.tags ?? [],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type:          'article',
      publishedTime: post.createdAt,
      modifiedTime:  post.updatedAt,
      authors:       ['Ashutosh Dubey'],
      images:        [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
      images:      [image],
    },
  };
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${params.slug}`;

  const articleSchema = {
    '@context':       'https://schema.org',
    '@type':          'BlogPosting',
    headline:         post.title,
    description:      post.excerpt,
    image:            post.thumbnail || `${SITE_URL}/og-image.png`,
    url,
    datePublished:    post.createdAt,
    dateModified:     post.updatedAt || post.createdAt,
    author: {
      '@type': 'Person',
      name:    'Ashutosh Dubey',
      url:     SITE_URL,
    },
    publisher: {
      '@type': 'Person',
      name:    'Ashutosh Dubey',
      url:     SITE_URL,
    },
    keywords:  (post.tags ?? []).join(', '),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Navbar />
      <main className="pt-24 pb-20 min-h-screen bg-[#080810]">
        <article className="max-w-3xl mx-auto px-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-muted hover:text-green-400 text-sm mb-8 transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Blog
          </Link>

          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags?.map((t: string) => <span key={t} className="tech-tag">{t}</span>)}
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-light leading-tight mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 text-muted text-sm mb-8">
            <span className="flex items-center gap-1.5"><Clock size={13} /> {post.readTime} min read</span>
            <span className="flex items-center gap-1.5"><Calendar size={13} /> {new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>

          {post.thumbnail && (
            <div className="rounded-2xl overflow-hidden mb-10 border border-[#1a1a2e]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.thumbnail} alt={post.title} className="w-full h-64 md:h-80 object-cover" />
            </div>
          )}

          <div
            className="prose prose-invert prose-sm max-w-none text-muted leading-relaxed
              prose-headings:text-light prose-a:text-cyan-400 prose-code:text-cyan-300
              prose-code:bg-[#1a1a2e] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-[#0f0f1a] prose-pre:border prose-pre:border-[#1a1a2e]"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
      <Footer />
    </>
  );
}
