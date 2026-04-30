import type { Tour, Departure, ItineraryDay } from "@/lib/types";

export const tours: Tour[] = [
  {
    slug: "peaks-of-the-balkans",
    name: "Peaks of the Balkans",
    tagline: "A 10-day traverse across Albania, Montenegro & Kosovo",
    country: ["Albania", "Montenegro", "Kosovo"],
    duration: 10,
    difficulty: 4,
    priceFrom: 1290,
    currency: "EUR",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=85",
      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&q=85",
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=85",
    ],
    spotsTotal: 12,
    nextDeparture: "2026-05-12",
    spotsLeft: 3,
    description:
      "One of Europe's last great wilderness walks. The Peaks of the Balkans trail crosses the rugged borderlands of Albania, Montenegro and Kosovo — threading through remote villages, glacial lakes, and high alpine passes that few outsiders ever see.",
    highlights: [
      "Cross three Balkan countries in 10 days",
      "Stay in traditional stone guesthouses",
      "Local guides with deep mountain knowledge",
      "All meals and national park permits included",
      "Max 12 travellers per group",
    ],
  },
  {
    slug: "rugova-via-ferrata",
    name: "Rugova Via Ferrata",
    tagline: "3 days of vertical Kosovo limestone",
    country: ["Kosovo"],
    duration: 3,
    difficulty: 3,
    priceFrom: 495,
    currency: "EUR",
    coverImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=85",
    images: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=85",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=85",
    ],
    spotsTotal: 8,
    nextDeparture: "2026-06-05",
    spotsLeft: 5,
    description:
      "Rugova Canyon is Kosovo's most dramatic landscape — sheer limestone walls rising 1,000m from the canyon floor. This 3-day via ferrata experience takes you up fixed-iron routes with views that reward every metre of vertical gain.",
    highlights: [
      "All via ferrata equipment provided",
      "Expert local guides with alpine certification",
      "Small group maximum 8 people",
      "Accommodation in Peja city centre",
    ],
  },
  {
    slug: "durmitor-ring",
    name: "Durmitor Ring",
    tagline: "5 days through Montenegro's highest peaks",
    country: ["Montenegro"],
    duration: 5,
    difficulty: 3,
    priceFrom: 780,
    currency: "EUR",
    coverImage: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&q=85",
    images: [
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&q=85",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=85",
    ],
    spotsTotal: 10,
    nextDeparture: "2026-07-10",
    spotsLeft: 7,
    description:
      "Durmitor National Park is Montenegro's crown jewel — a UNESCO World Heritage site of glacial lakes, ancient forests, and peaks above 2,500m. The Ring route circles the massif over 5 days, connecting the park's most spectacular viewpoints.",
    highlights: [
      "UNESCO World Heritage Site",
      "Mountain hut accommodation",
      "Black Lake sunrise walk included",
      "Transport from Podgorica included",
    ],
  },
];

export const departures: Departure[] = [
  { id: "dep-001", tourSlug: "peaks-of-the-balkans", startDate: "2026-04-14", endDate: "2026-04-23", guide: "Artan K.", spotsTotal: 12, spotsLeft: 0, price: 1290, currency: "EUR", status: "past" },
  { id: "dep-002", tourSlug: "peaks-of-the-balkans", startDate: "2026-05-12", endDate: "2026-05-21", guide: "Blerim H.", spotsTotal: 12, spotsLeft: 3, price: 1290, currency: "EUR", status: "low" },
  { id: "dep-003", tourSlug: "peaks-of-the-balkans", startDate: "2026-06-09", endDate: "2026-06-18", guide: "Artan K.", spotsTotal: 12, spotsLeft: 8, price: 1290, currency: "EUR", status: "available" },
  { id: "dep-004", tourSlug: "peaks-of-the-balkans", startDate: "2026-07-07", endDate: "2026-07-16", guide: "Dragan M.", spotsTotal: 12, spotsLeft: 12, price: 1290, currency: "EUR", status: "available" },
  { id: "dep-005", tourSlug: "peaks-of-the-balkans", startDate: "2026-08-04", endDate: "2026-08-13", guide: "Blerim H.", spotsTotal: 12, spotsLeft: 5, price: 1290, currency: "EUR", status: "available" },
  { id: "dep-006", tourSlug: "peaks-of-the-balkans", startDate: "2026-09-08", endDate: "2026-09-17", guide: "Artan K.", spotsTotal: 12, spotsLeft: 0, price: 1290, currency: "EUR", status: "sold-out" },
  { id: "dep-007", tourSlug: "rugova-via-ferrata", startDate: "2026-06-05", endDate: "2026-06-07", guide: "Liridon G.", spotsTotal: 8, spotsLeft: 5, price: 495, currency: "EUR", status: "available" },
  { id: "dep-008", tourSlug: "durmitor-ring", startDate: "2026-07-10", endDate: "2026-07-14", guide: "Dragan M.", spotsTotal: 10, spotsLeft: 7, price: 780, currency: "EUR", status: "available" },
];

export const itinerary: ItineraryDay[] = [
  { day: 1, title: "Arrival in Theth, Albania", distance: 0, elevation: 0, description: "Transfer from Shkodra to the remote mountain village of Theth. Settle in, briefing with your guide, and a short evening walk to the waterfall.", accommodation: "Guesthouse Polia, Theth" },
  { day: 2, title: "Theth to Valbona via Valbona Pass", distance: 18, elevation: 1250, description: "The trail's most iconic day. Climb steeply from Theth to the Valbona Pass (1,793m) and descend into the Valbona Valley with views stretching to Montenegro.", accommodation: "Guesthouse Rragami, Valbona" },
  { day: 3, title: "Valbona to Dobërdol", distance: 14, elevation: 820, description: "A high alpine day through remote pastures and shepherds' huts. Cross into Kosovo near the Dobërdol plateau.", accommodation: "Mountain hut, Dobërdol" },
  { day: 4, title: "Dobërdol to Çerem", distance: 12, elevation: 640, description: "Descend through beech forest to the Rugova valley floor. Stop at the glacial Liqeni i Dobërdolit lake.", accommodation: "Guesthouse, Çerem" },
  { day: 5, title: "Çerem to Peja — Rest Day", distance: 0, elevation: 0, description: "Transfer to Peja city. Free time to explore the bazaar, visit Patriarchate of Peć monastery, and rest.", accommodation: "Hotel Dukagjini, Peja" },
  { day: 6, title: "Peja to Babino Polje, Montenegro", distance: 16, elevation: 990, description: "Cross into Montenegro via the Čakor Pass. Dramatic views of the Rugova gorge and Prokletije mountains.", accommodation: "Guesthouse Babino Polje" },
  { day: 7, title: "Babino Polje to Plav", distance: 13, elevation: -680, description: "Descend to the Plav lake, one of Montenegro's most beautiful alpine lakes. Visit the old town.", accommodation: "Apartments near Plav lake" },
  { day: 8, title: "Plav to Ropiojani via Visitor", distance: 17, elevation: 1050, description: "A long wilderness day crossing back into Kosovo near Ropiojani. Pass through Visitor plateau — arguably the most scenic terrain on the whole trail.", accommodation: "Mountain hut, Ropiojani" },
  { day: 9, title: "Ropiojani to Gjakova", distance: 15, elevation: -900, description: "Final descending day through ancient oak forest to the historic city of Gjakova.", accommodation: "Hotel BB Gjakova" },
  { day: 10, title: "Gjakova — Departure Day", distance: 0, elevation: 0, description: "Morning free in Gjakova's Ottoman bazaar. Transfers to Prishtina airport, or onward by bus.", accommodation: "" },
];

export function getTourBySlug(slug: string): Tour | undefined {
  return tours.find((t) => t.slug === slug);
}

export function getDeparturesByTour(slug: string): Departure[] {
  return departures.filter((d) => d.tourSlug === slug);
}

export function getUpcomingDepartures(limit = 4): (Departure & { tour: Tour })[] {
  const now = new Date().toISOString().slice(0, 10);
  return departures
    .filter((d) => d.startDate >= now && d.status !== "past")
    .slice(0, limit)
    .map((d) => ({ ...d, tour: tours.find((t) => t.slug === d.tourSlug)! }));
}
