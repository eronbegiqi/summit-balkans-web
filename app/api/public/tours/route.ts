import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { tours } from '@/lib/db/schema';
import { and, asc, eq, sql } from 'drizzle-orm';

export const revalidate = 300;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const variantFilter = searchParams.get('variant')?.toUpperCase();
  const typeFilter = searchParams.get('type')?.toUpperCase();

  try {
    const conditions = [eq(tours.published, true)];
    if (variantFilter)
      conditions.push(eq(tours.tourVariant, variantFilter as 'QUICK' | 'REGULAR' | 'CLASSIC' | 'OTHER'));
    if (typeFilter)
      conditions.push(eq(tours.tourType, typeFilter as 'GUIDED' | 'SELF_GUIDED'));

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
        selfGuidedPriceEur: tours.selfGuidedPriceEur,
        groupSizeMax: tours.groupSizeMax,
        minParticipants: tours.minParticipants,
        tourType: tours.tourType,
        tourVariant: tours.tourVariant,
        isFlagship: tours.isFlagship,
        bestSeasonStart: tours.bestSeasonStart,
        bestSeasonEnd: tours.bestSeasonEnd,
        totalDistanceKm: tours.totalDistanceKm,
        maxElevationM: tours.maxElevationM,
      })
      .from(tours)
      .where(and(...conditions))
      .orderBy(asc(tours.displayOrder), asc(tours.title));

    // Get next departure per tour (separate query, no lateral join for MariaDB compat)
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
