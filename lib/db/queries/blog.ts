import { db } from '@/lib/db/client';
import { cachedQuery } from '@/lib/db/cache';
import { blogPosts, adminUsers } from '@/lib/db/schema';
import { and, desc, eq, inArray } from 'drizzle-orm';

export type BlogPostWithAuthor = typeof blogPosts.$inferSelect & {
  author: typeof adminUsers.$inferSelect | null;
};

async function attachAuthor(post: typeof blogPosts.$inferSelect): Promise<BlogPostWithAuthor> {
  const author = post.authorId
    ? ((await db.select().from(adminUsers).where(eq(adminUsers.id, post.authorId)))[0] ?? null)
    : null;
  return { ...post, author };
}

export async function getBlogPosts(publishedOnly = true): Promise<BlogPostWithAuthor[]> {
  return cachedQuery(`blog:list:${publishedOnly ? 'published' : 'all'}`, async () => {
    const rows = await db
      .select()
      .from(blogPosts)
      .where(publishedOnly ? and(eq(blogPosts.published, true)) : undefined)
      .orderBy(desc(blogPosts.publishedAt));

    const authorIds = [...new Set(rows.map((r) => r.authorId).filter((id): id is number => id !== null))];
    const authors = authorIds.length
      ? await db.select().from(adminUsers).where(inArray(adminUsers.id, authorIds))
      : [];
    const authorMap = new Map(authors.map((a) => [a.id, a]));
    return rows.map((r) => ({ ...r, author: r.authorId ? (authorMap.get(r.authorId) ?? null) : null }));
  }, []);
}

export async function getBlogPostById(id: number): Promise<BlogPostWithAuthor | null> {
  return cachedQuery<BlogPostWithAuthor | null>(`blog:id:${id}`, async () => {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    if (!post) return null;
    return attachAuthor(post);
  }, null);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostWithAuthor | null> {
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
  if (!post) return null;
  return attachAuthor(post);
}
