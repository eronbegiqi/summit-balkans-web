import { db } from '@/lib/db/client';
import { cachedQuery } from '@/lib/db/cache';
import { destinations, tours, tourStages } from '@/lib/db/schema';
import { asc, eq } from 'drizzle-orm';

type Destination = typeof destinations.$inferSelect;

export async function getDestinations() {
  return cachedQuery<Destination[]>('destinations:all', async () => {
    return db.select().from(destinations).orderBy(asc(destinations.displayOrder), asc(destinations.name));
  }, []);
}

export async function getDestinationById(id: number) {
  return cachedQuery<Destination | null>(`destinations:id:${id}`, async () => {
    const [row] = await db.select().from(destinations).where(eq(destinations.id, id));
    return row ?? null;
  }, null);
}

// ── Public destination pages ────────────────────────────────────────────────

export async function getPublishedDestinations() {
  return cachedQuery<Destination[]>('destinations:published', async () => {
    return db
      .select()
      .from(destinations)
      .where(eq(destinations.published, true))
      .orderBy(asc(destinations.displayOrder), asc(destinations.name));
  }, []);
}

/** Stored as `{name, description}` objects even though the column is typed string[]. */
export function normalizeHighlights(raw: unknown): { name: string; description?: string }[] {
  const list = typeof raw === 'string' ? safeJson(raw) : raw;
  if (!Array.isArray(list)) return [];
  return list
    .map((h) => (typeof h === 'string' ? { name: h } : h && typeof h === 'object' && 'name' in h ? (h as { name: string; description?: string }) : null))
    .filter((h): h is { name: string; description?: string } => !!h?.name?.trim());
}

function safeJson(s: string): unknown {
  try { return JSON.parse(s); } catch { return null; }
}

/** "Vuthaj (Vusanje)" → ["vuthaj", "vusanje"]; accents stripped so Çerem ≈ Cerem. */
export function placeKeys(name: string): string[] {
  return name
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .split(/[()/,]| or /)
    .map((s) => s.replace(/\b(valley|airport|onward)\b/g, '').trim())
    .filter((s) => s.length > 2);
}

export function samePlace(a: string, b: string): boolean {
  const ka = placeKeys(a), kb = placeKeys(b);
  return ka.some((x) => kb.some((y) => x === y || x.startsWith(y + ' ') || y.startsWith(x + ' ')));
}

export type StageAtPlace = {
  tourSlug: string;
  tourTitle: string;
  dayNumber: number;
  fromLocation: string | null;
  toLocation: string | null;
  distanceKm: string | null;
  elevationGainM: number | null;
  highestPointM: number | null;
};

async function getPublishedStages() {
  return cachedQuery<StageAtPlace[]>('stages:published', async () => {
    return db
      .select({
        tourSlug: tours.slug,
        tourTitle: tours.title,
        dayNumber: tourStages.dayNumber,
        fromLocation: tourStages.fromLocation,
        toLocation: tourStages.toLocation,
        distanceKm: tourStages.distanceKm,
        elevationGainM: tourStages.elevationGainM,
        highestPointM: tourStages.highestPointM,
      })
      .from(tourStages)
      .innerJoin(tours, eq(tours.id, tourStages.tourId))
      .where(eq(tours.published, true))
      .orderBy(asc(tours.displayOrder), asc(tourStages.dayNumber));
  }, []);
}

/** Tour stages that start or end at this destination (matched by place name). */
export async function getStagesAtPlace(name: string) {
  const stages = await getPublishedStages();
  return stages.filter(
    (s) => (s.fromLocation && samePlace(s.fromLocation, name)) || (s.toLocation && samePlace(s.toLocation, name)),
  );
}

// ponytail: per-instance memo, never expires — a fixed image is picked up on the
// next deploy/cold start. Exists because several stored Unsplash URLs now 404.
const imageOk = new Map<string, Promise<boolean>>();
function imageExists(url: string): Promise<boolean> {
  if (!imageOk.has(url)) {
    imageOk.set(url, fetch(url, { method: 'HEAD', cache: 'no-store' }).then((r) => r.ok, () => true));
  }
  return imageOk.get(url)!;
}

// Stock photos stored against Balkan places that show somewhere else entirely
// (the Eiffel Tower; city construction cranes). Delete once replaced in admin.
const MISMATCHED_PHOTOS = ['photo-1569949381669', 'photo-1565008447742'];

// Our own photos (also used on the /destinations index).
const COUNTRY_PHOTOS: Record<string, string> = {
  Albania: '/images/albanian-thumbs-img.webp',
  Kosovo: '/images/kosova-thumbs-img.webp',
  Montenegro: '/images/montenegro-img.webp',
};

/**
 * Published destinations with a usable hero image: countries use our own photo;
 * places with a dead or mismatched stored photo fall back to their country's.
 */
export async function getPublishedDestinationsForPages() {
  const rows = await getPublishedDestinations();
  return Promise.all(
    rows.map(async (d) => {
      const own = COUNTRY_PHOTOS[d.country];
      if (d.destinationType === 'COUNTRY' && own) return { ...d, heroImageUrl: own };
      const url = d.heroImageUrl;
      const usable = url && !MISMATCHED_PHOTOS.some((id) => url.includes(id)) && (await imageExists(url));
      return usable ? d : { ...d, heroImageUrl: own ?? null };
    }),
  );
}
