import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { destinations } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';

export const revalidate = 300;

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const [row] = await db
      .select()
      .from(destinations)
      .where(and(eq(destinations.slug, slug), eq(destinations.published, true)))
      .limit(1);
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(row);
  } catch {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }
}
