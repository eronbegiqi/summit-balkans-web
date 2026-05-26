import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { destinations } from '@/lib/db/schema';
import { and, asc, eq } from 'drizzle-orm';

export const revalidate = 300;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const countryFilter = searchParams.get('country')?.replace(/^\w/, (c) => c.toUpperCase());
  const typeFilter = searchParams.get('type')?.toUpperCase();

  try {
    const conditions = [eq(destinations.published, true)];
    if (countryFilter)
      conditions.push(eq(destinations.parentCountry, countryFilter as 'Albania' | 'Montenegro' | 'Kosovo'));
    if (typeFilter)
      conditions.push(eq(destinations.destinationType, typeFilter as 'COUNTRY' | 'CITY' | 'TRAIL_STOP'));

    const rows = await db
      .select()
      .from(destinations)
      .where(and(...conditions))
      .orderBy(asc(destinations.displayOrder), asc(destinations.name));

    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }
}
