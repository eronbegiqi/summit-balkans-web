import { db } from '@/lib/db/client';
import { departures, tours, guides } from '@/lib/db/schema';
import { asc, eq } from 'drizzle-orm';

export type DepartureWithTour = typeof departures.$inferSelect & {
  tour: typeof tours.$inferSelect;
  guide: typeof guides.$inferSelect | null;
};

async function attachTourAndGuide(dep: typeof departures.$inferSelect): Promise<DepartureWithTour> {
  const [tour] = await db.select().from(tours).where(eq(tours.id, dep.tourId)).limit(1);
  const guide = dep.guideId
    ? ((await db.select().from(guides).where(eq(guides.id, dep.guideId)).limit(1))[0] ?? null)
    : null;
  return { ...dep, tour, guide };
}

export async function getDepartures(): Promise<DepartureWithTour[]> {
  const deps = await db.select().from(departures).orderBy(asc(departures.startDate));
  return Promise.all(deps.map(attachTourAndGuide));
}

export async function getDepartureById(id: number): Promise<DepartureWithTour | null> {
  const [dep] = await db.select().from(departures).where(eq(departures.id, id)).limit(1);
  if (!dep) return null;
  return attachTourAndGuide(dep);
}

export async function getDeparturesByTour(tourId: number) {
  return db.select().from(departures).where(eq(departures.tourId, tourId)).orderBy(asc(departures.startDate));
}
