import { NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { discounts } from '@/lib/db/schema';
import { asc, eq } from 'drizzle-orm';

export const revalidate = 300;

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(discounts)
      .where(eq(discounts.active, true))
      .orderBy(asc(discounts.displayOrder));
    return NextResponse.json({ discounts: rows });
  } catch {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }
}
