import { db } from '@/lib/db/client';
import { reviews, tours } from '@/lib/db/schema';
import { desc, eq, inArray } from 'drizzle-orm';

export type ReviewWithTour = typeof reviews.$inferSelect & {
  tour: typeof tours.$inferSelect | null;
};

export async function getReviews(): Promise<ReviewWithTour[]> {
  const reviewList = await db.select().from(reviews).orderBy(desc(reviews.date));
  const tourIds = [...new Set(reviewList.map((r) => r.tourId).filter((id): id is number => id !== null))];
  const tourList = tourIds.length
    ? await db.select().from(tours).where(inArray(tours.id, tourIds))
    : [];
  const tourMap = new Map(tourList.map((t) => [t.id, t]));
  return reviewList.map((r) => ({ ...r, tour: r.tourId ? (tourMap.get(r.tourId) ?? null) : null }));
}

export async function getReviewById(id: number): Promise<ReviewWithTour | null> {
  const [review] = await db.select().from(reviews).where(eq(reviews.id, id)).limit(1);
  if (!review) return null;
  const tour = review.tourId
    ? ((await db.select().from(tours).where(eq(tours.id, review.tourId)).limit(1))[0] ?? null)
    : null;
  return { ...review, tour };
}
