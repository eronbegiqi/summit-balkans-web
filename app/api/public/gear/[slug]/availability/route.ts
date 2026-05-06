import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { gearItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getAvailableUnitCount } from '@/lib/inventory/availability';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const from = req.nextUrl.searchParams.get('from');
  const to = req.nextUrl.searchParams.get('to');

  if (!from || !to) {
    return NextResponse.json({ error: 'from and to query params required' }, { status: 400 });
  }

  try {
    const [item] = await db.select().from(gearItems).where(eq(gearItems.slug, slug)).limit(1);
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const available = await getAvailableUnitCount(item.id, from, to);
    return NextResponse.json({ slug, from, to, available, totalUnits: item.totalUnits });
  } catch {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }
}
