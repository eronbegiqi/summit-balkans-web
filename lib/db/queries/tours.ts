import { db } from '@/lib/db/client';
import { cachedQuery } from '@/lib/db/cache';
import { tours, guides } from '@/lib/db/schema';
import { asc, eq, sql } from 'drizzle-orm';

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
  return cachedQuery('tours:all', async () => {
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
  }, []);
}

/** Published tours for server-rendered link cards (e.g. the PoB route picker). */
export async function getPublishedTourCards() {
  return cachedQuery('tours:published-cards', () =>
    db
      .select({
        slug: tours.slug,
        title: tours.title,
        excerpt: tours.excerpt,
        featuredImageUrl: tours.featuredImageUrl,
        pricePerPersonEur: tours.pricePerPersonEur,
        durationDays: tours.durationDays,
        tourType: tours.tourType,
      })
      .from(tours)
      .where(eq(tours.published, true))
      .orderBy(asc(tours.displayOrder), asc(tours.durationDays)),
  [] as never[]);
}

async function attachGuide(tour: typeof tours.$inferSelect): Promise<TourWithGuide> {
  const guide = tour.assignedGuideId
    ? ((await db.select().from(guides).where(eq(guides.id, tour.assignedGuideId)).limit(1))[0] ?? null)
    : null;
  return { ...tour, guide };
}

export async function getTourById(id: number): Promise<TourWithGuide | null> {
  return cachedQuery<TourWithGuide | null>(`tours:id:${id}`, async () => {
    const [tour] = await db.select().from(tours).where(eq(tours.id, id)).limit(1);
    if (!tour) return null;
    return attachGuide(tour);
  }, null);
}

export async function getTourBySlug(slug: string): Promise<TourWithGuide | null> {
  const [tour] = await db.select().from(tours).where(eq(tours.slug, slug)).limit(1);
  if (!tour) return null;
  return attachGuide(tour);
}

export type PoBFacts = {
  minDays: number;
  maxDays: number;
  minKm: number;
  maxKm: number;
  maxElevationM: number;
  fromPriceEur: number;
  slugs: string[];
  /** Longest published route, used for the day-by-day section. */
  longestSlug: string | null;
};

const POB_FALLBACK: PoBFacts = {
  minDays: 7, maxDays: 16, minKm: 93, maxKm: 202, maxElevationM: 2656, fromPriceEur: 630, slugs: [], longestSlug: null,
};

/**
 * Headline numbers for the Peaks of the Balkans page, derived from the published
 * route tours so the page can't drift from the tour pages. Distance is the sum of
 * the day-by-day stages (what the tour pages show), falling back to the tour's own
 * total_distance_km when a tour has no stages yet.
 */
export async function getPoBFacts(): Promise<PoBFacts> {
  return cachedQuery('tours:pob-facts', async () => {
    const [rows] = await db.execute(sql`
      SELECT t.slug, t.duration_days, t.max_elevation_m, t.price_per_person_eur, t.total_distance_km,
             (SELECT SUM(s.distance_km) FROM tour_stages s WHERE s.tour_id = t.id) AS stage_km
      FROM tours t
      WHERE t.published = 1 AND t.slug LIKE 'peaks-of-the-balkans-%'
    `);
    const list = rows as unknown as Array<Record<string, unknown>>;
    if (!list.length) return POB_FALLBACK;
    const days = list.map((r) => Number(r.duration_days));
    const kms = list.map((r) => Math.round(Number(r.stage_km ?? r.total_distance_km ?? 0))).filter((k) => k > 0);
    const longest = list.reduce((a, b) => (Number(b.duration_days) > Number(a.duration_days) ? b : a));
    return {
      minDays: Math.min(...days),
      maxDays: Math.max(...days),
      minKm: kms.length ? Math.min(...kms) : POB_FALLBACK.minKm,
      maxKm: kms.length ? Math.max(...kms) : POB_FALLBACK.maxKm,
      maxElevationM: Math.max(...list.map((r) => Number(r.max_elevation_m ?? 0))) || POB_FALLBACK.maxElevationM,
      fromPriceEur: Math.min(...list.map((r) => Number(r.price_per_person_eur))),
      slugs: list.map((r) => String(r.slug)),
      longestSlug: String(longest.slug),
    };
  }, POB_FALLBACK);
}

export type PoBStage = {
  day: number; title: string; distance: number; elevation: number; description: string; accommodation: string;
};

/** Day-by-day stages for one tour, shaped for ItineraryAccordion. */
export async function getTourStagesBySlug(slug: string): Promise<PoBStage[]> {
  return cachedQuery(`tours:stages:${slug}`, async () => {
    const [rows] = await db.execute(sql`
      SELECT s.day_number, s.title, s.description, s.distance_km, s.elevation_gain_m, s.accommodation
      FROM tour_stages s JOIN tours t ON t.id = s.tour_id
      WHERE t.slug = ${slug} AND t.published = 1
      ORDER BY s.day_number
    `);
    return (rows as unknown as Array<Record<string, unknown>>).map((r) => ({
      day: Number(r.day_number),
      title: String(r.title),
      distance: Number(r.distance_km ?? 0),
      elevation: Number(r.elevation_gain_m ?? 0),
      description: r.description ? String(r.description) : '',
      accommodation: r.accommodation ? String(r.accommodation) : '',
    }));
  }, [] as PoBStage[]);
}
