import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { reviews, tours } from '@/lib/db/schema';
import { and, desc, eq } from 'drizzle-orm';

export const revalidate = 300;

export async function GET(req: NextRequest) {
  try {
    const tourSlug = req.nextUrl.searchParams.get('tour');
    const onlyFeatured = req.nextUrl.searchParams.get('featured') === 'true';

    const where = [eq(reviews.published, true)];
    if (onlyFeatured) where.push(eq(reviews.featured, true));

    let rows;
    if (tourSlug) {
      rows = await db.execute(
        require('drizzle-orm').sql`
          SELECT r.* FROM reviews r
          JOIN tours t ON t.id = r.tour_id
          WHERE r.published = true AND t.slug = ${tourSlug}
          ORDER BY r.date DESC
        `
      );
      rows = rows as unknown as typeof reviews.$inferSelect[];
    } else {
      rows = await db.query.reviews.findMany({
        where: where.length === 1 ? where[0] : and(...where),
        orderBy: [desc(reviews.date)],
        limit: 20,
      });
    }

    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }
}
