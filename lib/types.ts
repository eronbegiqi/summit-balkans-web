export interface Tour {
  slug: string;
  name: string;
  tagline: string;
  country: string[];
  duration: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  priceFrom: number;
  currency: string;
  coverImage: string;
  images: string[];
  spotsTotal: number;
  nextDeparture: string;
  spotsLeft: number;
  description: string;
  highlights: string[];
}

export interface Departure {
  id: string;
  tourSlug: string;
  startDate: string;
  endDate: string;
  guide: string;
  spotsTotal: number;
  spotsLeft: number;
  price: number;
  currency: string;
  status: "available" | "low" | "sold-out" | "past";
}

export interface Review {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  rating: number;
  quote: string;
  tour?: string;
  date: string;
  avatarInitial: string;
}

export interface GearItem {
  id: string;
  name: string;
  dayRate: number;
  deposit: number;
  description: string;
  specs: Record<string, string>;
  image: string;
  sizes?: string[];
  tags: string[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  distance: number;
  elevation: number;
  description: string;
  accommodation: string;
}

export interface BookingAddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  priceType: "per-day" | "per-person" | "flat";
  icon: string;
}
