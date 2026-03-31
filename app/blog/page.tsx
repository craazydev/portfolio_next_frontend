import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Navbar  from '@/components/ui/Navbar';
import Footer  from '@/components/ui/Footer';
import SectionHeading from '@/components/ui/SectionHeading';
import { Clock, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Articles on web development, React, Node.js, and software engineering by Ashutosh Dubey.',
};

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getPosts() {
  try {
    const res = await fetch(`${API}/blog?limit=12`, { next: { revalidate: 3600 } });
    const data = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

interface Post {
  _id: string; slug: string; title: string; excerpt: string;
  thumbnail?: string; tags: string[]; readTime: number; createdAt: string;
}

export default async function BlogPage() {
  const posts: Post[] = await getPosts();

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 min-h-screen bg-[#080810]">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading
            label="Blog"
            title="Thoughts & Articles"
            subtitle="Writing about web dev, architecture, and lessons learned."
          />

          {posts.length === 0 ? (
            <div className="text-center py-20 text-muted">
              <p className="text-5xl mb-4">✍️</p>
              <p>No posts yet — coming soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <article key={post._id} className="glass rounded-2xl border border-[#1a1a2e] overflow-hidden group hover:border-cyan-400/20 transition-all duration-300 tilt-card">
                  {post.thumbnail && (
                    <div className="relative h-44 overflow-hidden">
                      <Image src={post.thumbnail} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.tags.slice(0, 3).map((t) => <span key={t} className="tech-tag">{t}</span>)}
                    </div>
                    <h2 className="text-light font-bold text-base mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-muted text-xs leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-muted text-xs">
                        <Clock size={12} /> {post.readTime} min read
                      </span>
                      <Link href={`/blog/${post.slug}`} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group/l">
                        Read <ArrowRight size={11} className="group-hover/l:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
