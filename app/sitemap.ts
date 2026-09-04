import { MetadataRoute } from 'next';
import { db } from '@/lib/db/client';
import { tours, destinations, guides, blogPosts } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://summitbalkans.com';

export const revalidate = 3600; // Regenerate sitemap hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const static_pages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/tours`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/destinations`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/guides`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/gear`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE}/gallery`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE}/private-trips`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/peaks-of-the-balkans`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE}/before-you-visit`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  try {
    const [tourRows, destinationRows, guideRows, blogRows] = await Promise.all([
      db.select({ slug: tours.slug, updatedAt: tours.updatedAt })
        .from(tours).where(eq(tours.published, true)),
      db.select({ slug: destinations.slug, updatedAt: destinations.updatedAt })
        .from(destinations).where(eq(destinations.published, true)),
      db.select({ slug: guides.slug, updatedAt: guides.updatedAt })
        .from(guides).where(eq(guides.published, true)),
      db.select({ slug: blogPosts.slug, publishedAt: blogPosts.publishedAt, updatedAt: blogPosts.updatedAt })
        .from(blogPosts).where(and(eq(blogPosts.published, true))),
    ]);

    const tourPages: MetadataRoute.Sitemap = tourRows.map((t) => ({
      url: `${BASE}/tours/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.85,
    }));

    const destinationPages: MetadataRoute.Sitemap = destinationRows.map((d) => ({
      url: `${BASE}/destinations/${d.slug}`,
      lastModified: d.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    const guidePages: MetadataRoute.Sitemap = guideRows.map((g) => ({
      url: `${BASE}/guides/${g.slug}`,
      lastModified: g.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    const blogPages: MetadataRoute.Sitemap = blogRows.map((b) => ({
      url: `${BASE}/blog/${b.slug}`,
      lastModified: b.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.65,
    }));

    return [...static_pages, ...tourPages, ...destinationPages, ...guidePages, ...blogPages];
  } catch {
    // If DB unavailable, return static pages only
    return static_pages;
  }
}
