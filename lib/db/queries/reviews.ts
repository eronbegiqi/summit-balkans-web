import { db } from '@/lib/db/client';
import { reviews, tours } from '@/lib/db/schema';
import { desc, eq, inArray } from 'drizzle-orm';

export type ReviewWithTour = typeof reviews.$inferSelect & {
  tour: typeof tours.$inferSelect | null;
};

export async function getReviews(): Promise<ReviewWithTour[]> {
  const rows = await db.select().from(reviews).orderBy(desc(reviews.date));

  const tourIds = [...new Set(rows.map((r) => r.tourId).filter((id): id is number => id !== null))];
  const toursData = tourIds.length
    ? await db.select().from(tours).where(inArray(tours.id, tourIds))
    : [];
  const toursMap = Object.fromEntries(toursData.map((t) => [t.id, t]));

  return rows.map((r) => ({
    ...r,
    tour: r.tourId ? (toursMap[r.tourId] ?? null) : null,
  }));
}

export async function getReviewById(id: number): Promise<ReviewWithTour | null> {
  const [row] = await db.select().from(reviews).where(eq(reviews.id, id));
  if (!row) return null;

  const tour = row.tourId
    ? ((await db.select().from(tours).where(eq(tours.id, row.tourId)))[0] ?? null)
    : null;

  return { ...row, tour };
}
