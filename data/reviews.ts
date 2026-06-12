import type { Review } from "@/lib/types";
import { CONTACT } from "@/lib/constants";

// Real 5-star reviews from the Summit Balkans Google Business listing
// (https://maps.app.goo.gl/48D5Jpi2Az1VbFSA7). Used as the homepage/PoB
// fallback when the database is unavailable — kept in sync with the DB seed
// in scripts/seed-reviews.ts. reviewUrl links each card back to Google.

const GOOGLE = CONTACT.googleReviewsUrl;

export const reviews: Review[] = [
  {
    id: "g-fortesa-grabanica",
    name: "Fortesa Grabanica",
    rating: 5,
    quote:
      "I had the most wonderful trip that I could think of. We did Valbona, Theth, Vuthaj and back — amazing routes and trails.",
    tour: "Peaks of the Balkans",
    date: "2026-05-12",
    avatarInitial: "F",
    source: "GOOGLE",
    reviewUrl: GOOGLE,
  },
  {
    id: "g-rudina-xhokli",
    name: "Rudina Xhokli",
    rating: 5,
    quote:
      "We had such a great experience with Summit Balkans during our three-day hike on the Peaks of the Balkans trail through Çerem, Vuthaj, Theth, and Valbonë. The views were absolutely stunning.",
    tour: "Peaks of the Balkans",
    date: "2026-05-10",
    avatarInitial: "R",
    source: "GOOGLE",
    reviewUrl: GOOGLE,
  },
  {
    id: "g-adrian-joli",
    name: "Adrian Joli",
    rating: 5,
    quote:
      "Amazing time with Mergim at Peaks of the Balkans. Despite the weather on day one we still had a blast, and discovered that Kosovo and Albania are still hidden gems that need more exploring. Would recommend anyone to give it a try.",
    tour: "Peaks of the Balkans",
    date: "2026-05-08",
    avatarInitial: "A",
    source: "GOOGLE",
    reviewUrl: GOOGLE,
  },
  {
    id: "g-isa-mehmeti",
    name: "Isa Mehmeti",
    rating: 5,
    quote:
      "Had an amazing time with Summit Balkans on our Albanian trip. Would recommend anyone to try it once, especially Valbona peak.",
    tour: "Peaks of the Balkans",
    date: "2026-05-15",
    avatarInitial: "I",
    source: "GOOGLE",
    reviewUrl: GOOGLE,
  },
  {
    id: "g-deniza",
    name: "Deniza",
    rating: 5,
    quote:
      "I had a wonderful time. Everything was explained, and they helped me get prepared with gear and equipment.",
    tour: "Peaks of the Balkans",
    date: "2026-05-05",
    avatarInitial: "D",
    source: "GOOGLE",
    reviewUrl: GOOGLE,
  },
];
