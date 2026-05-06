import { NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { guides } from '@/lib/db/schema';
import { asc, eq } from 'drizzle-orm';

export const revalidate = 300;

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(guides)
      .where(eq(guides.published, true))
      .orderBy(asc(guides.displayOrder), asc(guides.name));
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }
}
