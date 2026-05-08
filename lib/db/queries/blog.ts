import { db } from '@/lib/db/client';
import { blogPosts, adminUsers } from '@/lib/db/schema';
import { desc, eq, inArray } from 'drizzle-orm';

export type BlogPostWithAuthor = typeof blogPosts.$inferSelect & {
  author: typeof adminUsers.$inferSelect | null;
};

export async function getBlogPosts(): Promise<BlogPostWithAuthor[]> {
  const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  const authorIds = [...new Set(posts.map((p) => p.authorId).filter((id): id is number => id !== null))];
  const authors = authorIds.length
    ? await db.select().from(adminUsers).where(inArray(adminUsers.id, authorIds))
    : [];
  const authorMap = new Map(authors.map((a) => [a.id, a]));
  return posts.map((p) => ({ ...p, author: p.authorId ? (authorMap.get(p.authorId) ?? null) : null }));
}

export async function getBlogPostById(id: number): Promise<BlogPostWithAuthor | null> {
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  if (!post) return null;
  const author = post.authorId
    ? ((await db.select().from(adminUsers).where(eq(adminUsers.id, post.authorId)).limit(1))[0] ?? null)
    : null;
  return { ...post, author };
}
