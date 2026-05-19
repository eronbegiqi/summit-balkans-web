import { db } from '@/lib/db/client';
import { blogPosts, adminUsers } from '@/lib/db/schema';
import { and, desc, eq, inArray } from 'drizzle-orm';

export type BlogPostWithAuthor = typeof blogPosts.$inferSelect & {
  author: typeof adminUsers.$inferSelect | null;
};

export async function getBlogPosts(publishedOnly = true): Promise<BlogPostWithAuthor[]> {
  const rows = await db
    .select()
    .from(blogPosts)
    .where(publishedOnly ? eq(blogPosts.published, true) : undefined)
    .orderBy(desc(blogPosts.publishedAt));

  const authorIds = [...new Set(rows.map((r) => r.authorId).filter((id): id is number => id !== null))];
  const authors = authorIds.length
    ? await db.select().from(adminUsers).where(inArray(adminUsers.id, authorIds))
    : [];
  const authorsMap = Object.fromEntries(authors.map((a) => [a.id, a]));

  return rows.map((r) => ({
    ...r,
    author: r.authorId ? (authorsMap[r.authorId] ?? null) : null,
  }));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostWithAuthor | null> {
  const [row] = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.published, true)));
  if (!row) return null;

  const author = row.authorId
    ? ((await db.select().from(adminUsers).where(eq(adminUsers.id, row.authorId)))[0] ?? null)
    : null;

  return { ...row, author };
}

export async function getBlogPostById(id: number): Promise<BlogPostWithAuthor | null> {
  const [row] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
  if (!row) return null;

  const author = row.authorId
    ? ((await db.select().from(adminUsers).where(eq(adminUsers.id, row.authorId)))[0] ?? null)
    : null;

  return { ...row, author };
}
