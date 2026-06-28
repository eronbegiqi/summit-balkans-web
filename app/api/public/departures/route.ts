import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { departures, tours, guides } from '@/lib/db/schema';
import { asc, eq, and, sql } from 'drizzle-orm';

export const revalidate = 300;

export async function GET(req: NextRequest) {
  const limit = Number(req.nextUrl.searchParams.get('limit') ?? '8');

  try {
    const today = new Date().toISOString().split('T')[0];

    const rows = await db
      .select({
        id: departures.id,
        startDate: departures.startDate,
        endDate: departures.endDate,
        capacity: departures.capacity,
        bookedCount: departures.bookedCount,
        pricePerPersonEur: departures.pricePerPersonEur,
        tourId: tours.id,
        tourSlug: tours.slug,
        tourTitle: tours.title,
        tourCountry: tours.country,
        tourFeaturedImageUrl: tours.featuredImageUrl,
        tourVariant: tours.tourVariant,
        tourType: tours.tourType,
        guidedPriceEur: tours.pricePerPersonEur,
        guideName: guides.name,
      })
      .from(departures)
      .innerJoin(tours, eq(departures.tourId, tours.id))
      .leftJoin(guides, eq(departures.guideId, guides.id))
      .where(
        and(
          eq(tours.published, true),
          sql`${departures.startDate} >= ${today}`,
          sql`${departures.status} != 'CANCELLED'`
        )
      )
      .orderBy(asc(departures.startDate))
      .limit(limit);

    return NextResponse.json(
      rows.map((r) => ({
        ...r,
        spotsLeft: r.capacity - (r.bookedCount ?? 0),
        startDate: String(r.startDate),
        endDate: String(r.endDate),
      }))
    );
  } catch {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }
}
