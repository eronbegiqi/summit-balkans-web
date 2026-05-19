import { db } from '@/lib/db/client';
import { departures, tours, guides } from '@/lib/db/schema';
import { asc, eq, inArray } from 'drizzle-orm';

export type DepartureWithTour = typeof departures.$inferSelect & {
  tour: typeof tours.$inferSelect;
  guide: typeof guides.$inferSelect | null;
};

export async function getDepartures(): Promise<DepartureWithTour[]> {
  const rows = await db.select().from(departures).orderBy(asc(departures.startDate));

  const tourIds = [...new Set(rows.map((r) => r.tourId))];
  const guideIds = [...new Set(rows.map((r) => r.guideId).filter((id): id is number => id !== null))];

  const [toursData, guidesData] = await Promise.all([
    tourIds.length ? db.select().from(tours).where(inArray(tours.id, tourIds)) : [],
    guideIds.length ? db.select().from(guides).where(inArray(guides.id, guideIds)) : [],
  ]);

  const toursMap = Object.fromEntries(toursData.map((t) => [t.id, t]));
  const guidesMap = Object.fromEntries(guidesData.map((g) => [g.id, g]));

  return rows.map((r) => ({
    ...r,
    tour: toursMap[r.tourId],
    guide: r.guideId ? (guidesMap[r.guideId] ?? null) : null,
  })) as DepartureWithTour[];
}

export async function getDepartureById(id: number): Promise<DepartureWithTour | null> {
  const [row] = await db.select().from(departures).where(eq(departures.id, id));
  if (!row) return null;

  const [tourData] = await db.select().from(tours).where(eq(tours.id, row.tourId));
  const guideData = row.guideId
    ? (await db.select().from(guides).where(eq(guides.id, row.guideId)))[0] ?? null
    : null;

  return { ...row, tour: tourData, guide: guideData } as DepartureWithTour;
}

export async function getDeparturesByTour(tourId: number) {
  return db.select().from(departures).where(eq(departures.tourId, tourId)).orderBy(asc(departures.startDate));
}
