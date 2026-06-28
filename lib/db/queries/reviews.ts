import { db } from '@/lib/db/client';
import { cachedQuery } from '@/lib/db/cache';
import { reviews, tours } from '@/lib/db/schema';
import { desc, eq, inArray } from 'drizzle-orm';
import type { Review } from '@/lib/types';
import { reviews as staticReviews } from '@/data/reviews';
import { CONTACT } from '@/lib/constants';

export type ReviewWithTour = typeof reviews.$inferSelect & {
  tour: typeof tours.$inferSelect | null;
};

/**
 * Published reviews for public display (homepage, Peaks of the Balkans page),
 * mapped to the display `Review` shape. Falls back to the static Google
 * reviews in data/reviews.ts when the DB is unavailable or has too few
 * published reviews, so the reviews section never goes blank.
 */
export async function getPublishedReviews(): Promise<Review[]> {
  try {
    const rows = await db
      .select()
      .from(reviews)
      .where(eq(reviews.published, true))
      .orderBy(desc(reviews.date))
      .limit(12);

    if (rows.length < 3) return staticReviews;

    const tourIds = [...new Set(rows.map((r) => r.tourId).filter((id): id is number => id !== null))];
    const tourMap = new Map<number, string>();
    if (tourIds.length) {
      const tourRows = await db
        .select({ id: tours.id, title: tours.title })
        .from(tours)
        .where(inArray(tours.id, tourIds));
      tourRows.forEach((t) => tourMap.set(t.id, t.title));
    }

    return rows.map((r) => ({
      id: String(r.id),
      name: r.guestName,
      country: r.guestCountry ?? undefined,
      rating: r.rating,
      quote: r.quote,
      date: r.date instanceof Date ? r.date.toISOString().slice(0, 10) : String(r.date),
      avatarInitial: r.guestName.trim().charAt(0).toUpperCase() || '★',
      tour: r.tourId ? tourMap.get(r.tourId) : undefined,
      source: r.source ?? undefined,
      reviewUrl: r.source === 'GOOGLE' ? CONTACT.googleReviewsUrl : undefined,
    }));
  } catch {
    // DB unavailable — fall back to the real static Google reviews.
    return staticReviews;
  }
}

export async function getReviews(): Promise<ReviewWithTour[]> {
  return cachedQuery('reviews:all', async () => {
    const reviewList = await db.select().from(reviews).orderBy(desc(reviews.date));
    const tourIds = [...new Set(reviewList.map((r) => r.tourId).filter((id): id is number => id !== null))];
    const tourList = tourIds.length
      ? await db.select().from(tours).where(inArray(tours.id, tourIds))
      : [];
    const tourMap = new Map(tourList.map((t) => [t.id, t]));
    return reviewList.map((r) => ({ ...r, tour: r.tourId ? (tourMap.get(r.tourId) ?? null) : null }));
  }, []);
}

export async function getReviewById(id: number): Promise<ReviewWithTour | null> {
  return cachedQuery<ReviewWithTour | null>(`reviews:id:${id}`, async () => {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id)).limit(1);
    if (!review) return null;
    const tour = review.tourId
      ? ((await db.select().from(tours).where(eq(tours.id, review.tourId)).limit(1))[0] ?? null)
      : null;
    return { ...review, tour };
  }, null);
}
