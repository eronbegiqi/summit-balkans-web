import { db } from '@/lib/db/client';
import { departures, tours, guides } from '@/lib/db/schema';
import { asc, eq, sql } from 'drizzle-orm';

export type DepartureWithTour = typeof departures.$inferSelect & {
  tour: typeof tours.$inferSelect;
  guide: typeof guides.$inferSelect | null;
};

export async function getDepartures(): Promise<DepartureWithTour[]> {
  const result = await db.query.departures.findMany({
    with: { tour: true, guide: true },
    orderBy: [asc(departures.startDate)],
  });
  return result as DepartureWithTour[];
}

export async function getDepartureById(id: number): Promise<DepartureWithTour | null> {
  const result = await db.query.departures.findFirst({
    where: eq(departures.id, id),
    with: { tour: true, guide: true },
  });
  return result as DepartureWithTour | null;
}

export async function getDeparturesByTour(tourId: number) {
  return db.query.departures.findMany({
    where: eq(departures.tourId, tourId),
    orderBy: [asc(departures.startDate)],
  });
}
