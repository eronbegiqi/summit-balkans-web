import { NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { destinations } from '@/lib/db/schema';
import { asc, eq } from 'drizzle-orm';

export const revalidate = 300;

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(destinations)
      .where(eq(destinations.published, true))
      .orderBy(asc(destinations.displayOrder), asc(destinations.name));
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }
}
