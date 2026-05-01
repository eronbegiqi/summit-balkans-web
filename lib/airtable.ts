import { tours as mockTours, departures as mockDepartures } from "@/data/tours";
import { gearItems as mockGear } from "@/data/gear";
import type { Tour, Departure, GearItem } from "@/lib/types";

const BASE = process.env.AIRTABLE_BASE_ID;
const KEY = process.env.AIRTABLE_API_KEY;

function headers() {
  return { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };
}

async function airtableFetch(path: string, options?: RequestInit) {
  const res = await fetch(`https://api.airtable.com/v0/${BASE}/${path}`, {
    ...options,
    headers: { ...headers(), ...(options?.headers ?? {}) },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable ${res.status}: ${text}`);
  }
  return res.json();
}

// ─── Write a submission row ───────────────────────────────────────────────────
export async function saveSubmission(
  type: "contact" | "booking" | "private-trip",
  fields: Record<string, string | number>
): Promise<void> {
  if (!BASE || !KEY) return; // silently skip in local dev without env vars
  await airtableFetch("Submissions", {
    method: "POST",
    body: JSON.stringify({
      records: [{ fields: { Type: type, Date: new Date().toISOString(), Status: "New", ...fields } }],
    }),
  });
}

// ─── Fetch tours (falls back to mock data) ────────────────────────────────────
export async function fetchTours(): Promise<Tour[]> {
  if (!BASE || !KEY) return mockTours;
  try {
    const data = await airtableFetch(
      "Tours?filterByFormula={Active}=1&sort[0][field]=Name&sort[0][direction]=asc"
    );
    return (data.records as AirtableRecord[]).map(airtableTourToTour);
  } catch {
    return mockTours;
  }
}

export async function fetchTourBySlug(slug: string): Promise<Tour | undefined> {
  if (!BASE || !KEY) return mockTours.find((t) => t.slug === slug);
  try {
    const data = await airtableFetch(
      `Tours?filterByFormula=AND({Slug}="${slug}",{Active}=1)&maxRecords=1`
    );
    if (!data.records?.length) return undefined;
    return airtableTourToTour(data.records[0]);
  } catch {
    return mockTours.find((t) => t.slug === slug);
  }
}

// ─── Fetch departures ─────────────────────────────────────────────────────────
export async function fetchDepartures(tourSlug?: string): Promise<Departure[]> {
  if (!BASE || !KEY) {
    return tourSlug
      ? mockDepartures.filter((d) => d.tourSlug === tourSlug)
      : mockDepartures;
  }
  try {
    const filter = tourSlug
      ? `AND({TourSlug}="${tourSlug}",{Status}!="past")`
      : `{Status}!="past"`;
    const data = await airtableFetch(
      `Departures?filterByFormula=${encodeURIComponent(filter)}&sort[0][field]=StartDate&sort[0][direction]=asc`
    );
    return (data.records as AirtableRecord[]).map(airtableDepartureToDeparture);
  } catch {
    return tourSlug
      ? mockDepartures.filter((d) => d.tourSlug === tourSlug)
      : mockDepartures;
  }
}

// ─── Fetch gear ───────────────────────────────────────────────────────────────
export async function fetchGear(): Promise<GearItem[]> {
  if (!BASE || !KEY) return mockGear;
  try {
    const data = await airtableFetch(
      "Gear?filterByFormula={Active}=1&sort[0][field]=Name&sort[0][direction]=asc"
    );
    return (data.records as AirtableRecord[]).map(airtableGearToGear);
  } catch {
    return mockGear;
  }
}

// ─── Type helpers ─────────────────────────────────────────────────────────────
interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
}

function str(v: unknown): string { return String(v ?? ""); }
function num(v: unknown): number { return Number(v ?? 0); }

function airtableTourToTour(r: AirtableRecord): Tour {
  const f = r.fields;
  return {
    slug: str(f["Slug"]),
    name: str(f["Name"]),
    tagline: str(f["Tagline"]),
    country: String(f["Countries"] ?? "").split(",").map((s) => s.trim()),
    duration: num(f["Duration"]),
    difficulty: Math.min(5, Math.max(1, num(f["Difficulty"]))) as 1|2|3|4|5,
    priceFrom: num(f["Price From"]),
    currency: "EUR",
    coverImage: str(f["Cover Image URL"]),
    images: str(f["Image URLs"]).split(",").map((s) => s.trim()).filter(Boolean),
    spotsTotal: num(f["Spots Total"]) || 12,
    nextDeparture: str(f["Next Departure"]),
    spotsLeft: num(f["Spots Left"]),
    description: str(f["Description"]),
    highlights: str(f["Highlights"]).split("\n").filter(Boolean),
  };
}

function airtableDepartureToDeparture(r: AirtableRecord): Departure {
  const f = r.fields;
  return {
    id: r.id,
    tourSlug: str(f["TourSlug"]),
    startDate: str(f["StartDate"]),
    endDate: str(f["EndDate"]),
    guide: str(f["Guide"]),
    spotsTotal: num(f["SpotsTotal"]),
    spotsLeft: num(f["SpotsLeft"]),
    price: num(f["Price"]),
    currency: "EUR",
    status: str(f["Status"]) as Departure["status"],
  };
}

function airtableGearToGear(r: AirtableRecord): GearItem {
  const f = r.fields;
  return {
    id: r.id,
    name: str(f["Name"]),
    dayRate: num(f["Day Rate"]),
    deposit: num(f["Deposit"]),
    description: str(f["Description"]),
    specs: JSON.parse(str(f["Specs"] || "{}")),
    image: str(f["Image URL"]),
    sizes: str(f["Sizes"]).split(",").map((s) => s.trim()).filter(Boolean),
    tags: str(f["Tags"]).split(",").map((s) => s.trim()).filter(Boolean),
  };
}
