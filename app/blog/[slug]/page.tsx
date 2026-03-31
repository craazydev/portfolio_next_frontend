import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getPost(slug: string) {
  try {
    const res = await fetch(`${API}/blog/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title:       post.metaTitle  || post.title,
    description: post.metaDesc   || post.excerpt,
    openGraph: {
      title:       post.title,
      description: post.excerpt,
      type:        'article',
      images:      post.thumbnail ? [post.thumbnail] : [],
    },
  };
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 min-h-screen bg-[#080810]">
        <article className="max-w-3xl mx-auto px-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-muted hover:text-cyan-400 text-sm mb-8 transition-colors">
            <ArrowLeft size={14} /> Back to Blog
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
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-10 border border-[#1a1a2e]">
              <Image src={post.thumbnail} alt={post.title} fill className="object-cover" />
            </div>
          )}

          {/* Content — rendered as HTML from CMS */}
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
