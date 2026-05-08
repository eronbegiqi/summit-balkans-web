import { db } from '@/lib/db/client';
import { tours, guides } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export type TourListItem = {
  id: number;
  slug: string;
  title: string;
  country: string | null;
  durationDays: number;
  difficulty: number;
  pricePerPersonEur: string;
  isFlagship: boolean | null;
  published: boolean | null;
  displayOrder: number | null;
  departureCount: number;
  guideName: string | null;
};

export type TourWithGuide = typeof tours.$inferSelect & {
  guide: typeof guides.$inferSelect | null;
};

export async function getTours(): Promise<TourListItem[]> {
  const [rows] = await db.execute(sql`
    SELECT
      t.id, t.slug, t.title, t.country, t.duration_days, t.difficulty,
      t.price_per_person_eur, t.is_flagship, t.published, t.display_order,
      COUNT(d.id) AS departure_count,
      g.name AS guide_name
    FROM tours t
    LEFT JOIN departures d ON d.tour_id = t.id
    LEFT JOIN guides g ON g.id = t.assigned_guide_id
    GROUP BY t.id
    ORDER BY t.display_order ASC, t.title ASC
  `);
  return (rows as unknown as Array<Record<string, unknown>>).map((r) => ({
    id: Number(r.id),
    slug: String(r.slug),
    title: String(r.title),
    country: r.country ? String(r.country) : null,
    durationDays: Number(r.duration_days),
    difficulty: Number(r.difficulty),
    pricePerPersonEur: String(r.price_per_person_eur),
    isFlagship: Boolean(r.is_flagship),
    published: Boolean(r.published),
    displayOrder: r.display_order ? Number(r.display_order) : null,
    departureCount: Number(r.departure_count),
    guideName: r.guide_name ? String(r.guide_name) : null,
  }));
}

export async function getTourById(id: number): Promise<TourWithGuide | null> {
  const [tour] = await db.select().from(tours).where(eq(tours.id, id));
  if (!tour) return null;

  const guide = tour.assignedGuideId
    ? ((await db.select().from(guides).where(eq(guides.id, tour.assignedGuideId)))[0] ?? null)
    : null;

  return { ...tour, guide };
}

export async function getTourBySlug(slug: string): Promise<TourWithGuide | null> {
  const [tour] = await db.select().from(tours).where(eq(tours.slug, slug));
  if (!tour) return null;

  const guide = tour.assignedGuideId
    ? ((await db.select().from(guides).where(eq(guides.id, tour.assignedGuideId)))[0] ?? null)
    : null;

  return { ...tour, guide };
}
