import { db } from '@/lib/db/client';
import { cachedQuery } from '@/lib/db/cache';
import { departures, tours, guides } from '@/lib/db/schema';
import { and, asc, eq, sql } from 'drizzle-orm';

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
  return cachedQuery('departures:all', async () => {
    const deps = await db.select().from(departures).orderBy(asc(departures.startDate));
    return Promise.all(deps.map(attachTourAndGuide));
  }, []);
}

export async function getDepartureById(id: number): Promise<DepartureWithTour | null> {
  return cachedQuery(`departures:id:${id}`, async () => {
    const [dep] = await db.select().from(departures).where(eq(departures.id, id)).limit(1);
    if (!dep) return null;
    return attachTourAndGuide(dep);
  }, null);
}

export async function getDeparturesByTour(tourId: number) {
  return db.select().from(departures).where(eq(departures.tourId, tourId)).orderBy(asc(departures.startDate));
}

export async function getUpcomingDeparturesByTourSlug(slug: string): Promise<DepartureWithTour[]> {
  const [tour] = await db.select({ id: tours.id }).from(tours).where(eq(tours.slug, slug)).limit(1);

  if (!tour?.id) return [];

  const today = new Date().toISOString().split('T')[0];
  const deps = await db
    .select()
    .from(departures)
    .where(
      and(
        eq(departures.tourId, tour.id),
        sql`${departures.startDate} >= ${today}`,
        sql`${departures.status} != 'CANCELLED'`
      )
    )
    .orderBy(asc(departures.startDate));

  return Promise.all(deps.map(attachTourAndGuide));
}
