import { db } from '@/lib/db/client';
import { reviews, tours } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export type ReviewWithTour = typeof reviews.$inferSelect & {
  tour: typeof tours.$inferSelect | null;
};

export async function getReviews(): Promise<ReviewWithTour[]> {
  const result = await db.query.reviews.findMany({
    with: { tour: true },
    orderBy: [desc(reviews.date)],
  });
  return result as ReviewWithTour[];
}

export async function getReviewById(id: number): Promise<ReviewWithTour | null> {
  const result = await db.query.reviews.findFirst({
    where: eq(reviews.id, id),
    with: { tour: true },
  });
  return result as ReviewWithTour | null;
}
