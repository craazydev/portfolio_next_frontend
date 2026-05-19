import type { Metadata } from 'next';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ashutoshdubey.dev';

interface PageMetaDoc {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
}

const DEFAULTS: Record<string, { title: string; description: string; keywords: string[] }> = {
  home: {
    title: 'Ashutosh Dubey — Full Stack Developer | Lucknow',
    description: 'Ashutosh Dubey is a Full Stack Developer from Lucknow with 3+ years of experience building scalable web applications, payment integrations, and SaaS products.',
    keywords: ['Full Stack Developer Lucknow', 'React Developer India', 'Node.js Developer', 'Ashutosh Dubey'],
  },
  about: {
    title: 'About — Ashutosh Dubey',
    description: 'Learn about Ashutosh Dubey — Full Stack Developer from Lucknow with 3+ years of experience in React, Node.js, and MongoDB.',
    keywords: ['About Ashutosh Dubey', 'Full Stack Developer Lucknow', 'Web Developer India'],
  },
  projects: {
    title: 'Projects — Ashutosh Dubey',
    description: 'Explore full-stack projects by Ashutosh Dubey — SaaS platforms, payment integrations, REST APIs, and more.',
    keywords: ['Ashutosh Dubey Projects', 'Full Stack Projects', 'React Next.js Portfolio'],
  },
  blog: {
    title: 'Blog — Ashutosh Dubey',
    description: 'Articles on React, Node.js, MongoDB, and modern web development by Ashutosh Dubey.',
    keywords: ['Web Development Blog', 'React Blog', 'Node.js Articles'],
  },
  contact: {
    title: 'Contact — Ashutosh Dubey',
    description: 'Get in touch with Ashutosh Dubey for freelance projects, collaborations, or just to say hello.',
    keywords: ['Hire Full Stack Developer', 'Freelance Developer India', 'Contact Ashutosh Dubey'],
  },
};

export async function getPageMeta(page: string): Promise<Metadata> {
  const def = DEFAULTS[page] || DEFAULTS.home;

  let doc: PageMetaDoc | null = null;
  try {
    const res = await fetch(`${API}/meta/${page}`, { next: { revalidate: 300 } });
    const json = await res.json();
    doc = json.data;
  } catch { /* fall through to defaults */ }

  const title       = doc?.title       || def.title;
  const description = doc?.description || def.description;
  const keywords    = doc?.keywords?.length ? doc.keywords : def.keywords;
  const ogImage     = doc?.ogImage     || '/og-image.png';

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${page === 'home' ? '' : `/${page}`}`,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `${SITE_URL}${page === 'home' ? '' : `/${page}`}`,
    },
  };
}
