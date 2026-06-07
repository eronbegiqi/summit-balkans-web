import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { tours, departures, guides, tourStages } from '@/lib/db/schema';
import { asc, eq, and, sql } from 'drizzle-orm';

export const revalidate = 300;

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    const tour = await db.query.tours.findFirst({
      where: and(eq(tours.slug, slug), eq(tours.published, true)),
      with: { guide: true },
    });

    if (!tour) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Fetch stages and departures in parallel
    const [stages, tourDepartures] = await Promise.all([
      db
        .select()
        .from(tourStages)
        .where(eq(tourStages.tourId, tour.id))
        .orderBy(asc(tourStages.dayNumber)),

      db
        .select({
          id: departures.id,
          startDate: departures.startDate,
          endDate: departures.endDate,
          capacity: departures.capacity,
          bookedCount: departures.bookedCount,
          pricePerPersonEur: departures.pricePerPersonEur,
          language: departures.language,
          status: departures.status,
          guideName: guides.name,
        })
        .from(departures)
        .leftJoin(guides, eq(departures.guideId, guides.id))
        .where(
          and(
            eq(departures.tourId, tour.id),
            sql`${departures.startDate} >= ${new Date().toISOString().split('T')[0]}`,
            sql`${departures.status} != 'CANCELLED'`
          )
        )
        .orderBy(asc(departures.startDate)),
    ]);

    return NextResponse.json({
      ...tour,
      stages,
      departures: tourDepartures.map((d) => ({
        ...d,
        spotsLeft: d.capacity - (d.bookedCount ?? 0),
        startDate: String(d.startDate),
        endDate: String(d.endDate),
      })),
    });
  } catch {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }
}
