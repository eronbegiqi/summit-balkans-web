import { db } from '@/lib/db/client';
import { blogPosts, adminUsers } from '@/lib/db/schema';
import { asc, desc, eq } from 'drizzle-orm';

export type BlogPostWithAuthor = typeof blogPosts.$inferSelect & {
  author: typeof adminUsers.$inferSelect | null;
};

export async function getBlogPosts() {
  return db.query.blogPosts.findMany({
    with: { author: true },
    orderBy: [desc(blogPosts.createdAt)],
  });
}

export async function getBlogPostById(id: number): Promise<BlogPostWithAuthor | null> {
  const result = await db.query.blogPosts.findFirst({
    where: eq(blogPosts.id, id),
    with: { author: true },
  });
  return result as BlogPostWithAuthor | null;
}
