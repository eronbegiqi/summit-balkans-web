import { NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { gearItems, gearUnits, gearRentals } from '@/lib/db/schema';
import { asc, eq, sql } from 'drizzle-orm';

export const revalidate = 60;

export async function GET() {
  try {
    const rows = await db.execute(sql`
      SELECT
        gi.*,
        COUNT(gu.id) AS total_units,
        SUM(CASE WHEN gu.status = 'AVAILABLE' THEN 1 ELSE 0 END) AS available_units
      FROM gear_items gi
      LEFT JOIN gear_units gu ON gu.gear_item_id = gi.id
      WHERE gi.published = true
      GROUP BY gi.id
      ORDER BY gi.display_order ASC, gi.name ASC
    `);

    return NextResponse.json(
      (rows as unknown as Array<Record<string, unknown>>).map((r) => ({
        ...r,
        totalUnits: Number(r.total_units),
        availableUnits: Number(r.available_units),
      }))
    );
  } catch {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }
}
