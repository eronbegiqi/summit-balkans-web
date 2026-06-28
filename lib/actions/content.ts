'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db/client';
import { destinations, guides, blogPosts, reviews, departures, gearItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';

async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  return session;
}

// ─── Destinations ────────────────────────────────────────────────────────────

export async function saveDestination(id: number | null, data: Omit<typeof destinations.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
  await requireAdmin();
  if (id) {
    await db.update(destinations).set(data).where(eq(destinations.id, id));
  } else {
    await db.insert(destinations).values(data);
  }
  revalidatePath('/admin/destinations');
}

export async function toggleDestinationPublished(id: number, published: boolean) {
  await requireAdmin();
  await db.update(destinations).set({ published }).where(eq(destinations.id, id));
  revalidatePath('/admin/destinations');
}

// ─── Guides ──────────────────────────────────────────────────────────────────

export async function saveGuide(id: number | null, data: Omit<typeof guides.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
  await requireAdmin();
  if (id) {
    await db.update(guides).set(data).where(eq(guides.id, id));
  } else {
    await db.insert(guides).values(data);
  }
  revalidatePath('/admin/guides');
}

export async function toggleGuidePublished(id: number, published: boolean) {
  await requireAdmin();
  await db.update(guides).set({ published }).where(eq(guides.id, id));
  revalidatePath('/admin/guides');
}

export async function deleteGuide(id: number) {
  await requireAdmin();
  await db.delete(guides).where(eq(guides.id, id));
  revalidatePath('/admin/guides');
  redirect('/admin/guides');
}

// ─── Departures ──────────────────────────────────────────────────────────────

export async function saveDeparture(id: number | null, data: Omit<typeof departures.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
  await requireAdmin();
  if (id) {
    await db.update(departures).set(data).where(eq(departures.id, id));
  } else {
    await db.insert(departures).values(data);
  }
  revalidatePath('/admin/departures');
}

export async function deleteDeparture(id: number) {
  await requireAdmin();
  await db.delete(departures).where(eq(departures.id, id));
  revalidatePath('/admin/departures');
  redirect('/admin/departures');
}

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export async function saveBlogPost(id: number | null, data: Omit<typeof blogPosts.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
  await requireAdmin();
  if (id) {
    await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
  } else {
    const [result] = await db.insert(blogPosts).values(data);
    const newId = Number((result as unknown as { insertId: number }).insertId);
    revalidatePath('/admin/blog');
    redirect(`/admin/blog/${newId}/edit`);
  }
  revalidatePath('/admin/blog');
}

export async function toggleBlogPublished(id: number, published: boolean) {
  await requireAdmin();
  await db.update(blogPosts)
    .set({ published, ...(published ? { publishedAt: new Date() } : {}) })
    .where(eq(blogPosts.id, id));
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
}

export async function deleteBlogPost(id: number) {
  await requireAdmin();
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export async function saveReview(id: number | null, data: Omit<typeof reviews.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
  await requireAdmin();
  if (id) {
    await db.update(reviews).set(data).where(eq(reviews.id, id));
  } else {
    await db.insert(reviews).values(data);
  }
  revalidatePath('/admin/reviews');
}

export async function toggleReviewFeatured(id: number, featured: boolean) {
  await requireAdmin();
  await db.update(reviews).set({ featured }).where(eq(reviews.id, id));
  revalidatePath('/admin/reviews');
}

export async function toggleReviewPublished(id: number, published: boolean) {
  await requireAdmin();
  await db.update(reviews).set({ published }).where(eq(reviews.id, id));
  revalidatePath('/admin/reviews');
}

// ─── Gear Items ───────────────────────────────────────────────────────────────

export async function saveGearItem(id: number | null, data: Omit<typeof gearItems.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
  await requireAdmin();
  if (id) {
    await db.update(gearItems).set(data).where(eq(gearItems.id, id));
  } else {
    await db.insert(gearItems).values(data);
  }
  revalidatePath('/admin/gear');
}
