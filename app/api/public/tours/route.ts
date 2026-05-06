import { NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { tours, departures, guides } from '@/lib/db/schema';
import { and, asc, eq, gte, sql } from 'drizzle-orm';

export const revalidate = 300;

export async function GET() {
  try {
    const rows = await db
      .select({
        id: tours.id,
        slug: tours.slug,
        title: tours.title,
        excerpt: tours.excerpt,
        featuredImageUrl: tours.featuredImageUrl,
        country: tours.country,
        region: tours.region,
        durationDays: tours.durationDays,
        difficulty: tours.difficulty,
        pricePerPersonEur: tours.pricePerPersonEur,
        groupSizeMax: tours.groupSizeMax,
        isFlagship: tours.isFlagship,
        bestSeasonStart: tours.bestSeasonStart,
        bestSeasonEnd: tours.bestSeasonEnd,
        totalDistanceKm: tours.totalDistanceKm,
        maxElevationM: tours.maxElevationM,
      })
      .from(tours)
      .where(eq(tours.published, true))
      .orderBy(asc(tours.displayOrder), asc(tours.title));

    // Get next departure per tour
    const today = new Date().toISOString().split('T')[0];
    const nextDepartures = await db.execute(sql`
      SELECT tour_id, MIN(start_date) AS next_departure,
             (capacity - COALESCE(booked_count, 0)) AS spots_left
      FROM departures
      WHERE start_date >= ${today} AND status != 'CANCELLED'
      GROUP BY tour_id
    `);
    const nextMap = new Map<number, { nextDeparture: string; spotsLeft: number }>();
    (nextDepartures as unknown as Array<{ tour_id: number; next_departure: string; spots_left: number }>)
      .forEach((r) => nextMap.set(r.tour_id, { nextDeparture: r.next_departure, spotsLeft: r.spots_left }));

    return NextResponse.json(rows.map((t) => ({
      ...t,
      ...nextMap.get(t.id),
    })));
  } catch {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }
}
