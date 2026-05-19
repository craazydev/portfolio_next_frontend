import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio.crazydev.in';
const API      = process.env.NEXT_PUBLIC_API_URL  || 'http://localhost:5000/api';

async function getBlogSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  try {
    const res  = await fetch(`${API}/blog?limit=200`, { next: { revalidate: 3600 } });
    const data = await res.json();
    return (data.data ?? []).map((p: { slug: string; updatedAt?: string; createdAt: string }) => ({
      slug:      p.slug,
      updatedAt: p.updatedAt || p.createdAt,
    }));
  } catch {
    return [];
  }
}

async function getProjectSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  try {
    const res  = await fetch(`${API}/projects`, { next: { revalidate: 3600 } });
    const data = await res.json();
    return (data.data ?? []).map((p: { slug: string; updatedAt?: string; createdAt: string }) => ({
      slug:      p.slug,
      updatedAt: p.updatedAt || p.createdAt,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogPosts, projects] = await Promise.all([getBlogSlugs(), getProjectSlugs()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL,                  lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 },
    { url: `${SITE_URL}/about`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/projects`,    lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE_URL}/blog`,        lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE_URL}/contact`,     lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.7 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map(({ slug, updatedAt }) => ({
    url:             `${SITE_URL}/blog/${slug}`,
    lastModified:    new Date(updatedAt),
    changeFrequency: 'monthly',
    priority:        0.7,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map(({ slug, updatedAt }) => ({
    url:             `${SITE_URL}/projects/${slug}`,
    lastModified:    new Date(updatedAt),
    changeFrequency: 'monthly',
    priority:        0.75,
  }));

  return [...staticRoutes, ...blogRoutes, ...projectRoutes];
}
