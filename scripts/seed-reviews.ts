/**
 * Seeds the real 5-star Google reviews from the Summit Balkans listing
 * (https://maps.app.goo.gl/48D5Jpi2Az1VbFSA7) into the `reviews` table.
 *
 * Idempotent: removes any existing GOOGLE-source reviews first, then inserts
 * the current set, so it can be re-run safely. Links each review to the
 * "Peaks of the Balkans" tour when that tour exists in the DB.
 *
 * Run from the project root:  npx tsx scripts/seed-reviews.ts
 * Requires DATABASE_URL in .env.local
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { reviews, tours } from '../lib/db/schema';
import { eq, like, or } from 'drizzle-orm';

type SeedReview = {
  guestName: string;
  rating: number;
  quote: string;
  fullReview: string;
  date: Date;
  featured: boolean;
};

// Faithful transcriptions of the published Google reviews. `quote` is the
// short version shown on cards; `fullReview` holds the full visible text.
const googleReviews: SeedReview[] = [
  {
    guestName: 'Fortesa Grabanica',
    rating: 5,
    quote:
      'I had the most wonderful trip that I could think of. We did Valbona, Theth, Vuthaj and back — amazing routes and trails.',
    fullReview:
      'I had the most wonderful trip that I could think of. We did Valbona, Theth, Vuthaj and back — amazing routes and trails.',
    date: new Date('2026-05-12'),
    featured: true,
  },
  {
    guestName: 'Rudina Xhokli',
    rating: 5,
    quote:
      'We had such a great experience with Summit Balkans during our three-day hike on the Peaks of the Balkans trail through Çerem, Vuthaj, Theth, and Valbonë. The views were absolutely stunning.',
    fullReview:
      'We had such a great experience with Summit Balkans during our three-day hike on the Peaks of the Balkans trail through Çerem, Vuthaj, Theth, and Valbonë. The views were absolutely stunning.',
    date: new Date('2026-05-10'),
    featured: true,
  },
  {
    guestName: 'Adrian Joli',
    rating: 5,
    quote:
      'Amazing time with Mergim at Peaks of the Balkans. Despite the weather on day one we still had a blast, and discovered that Kosovo and Albania are still hidden gems that need more exploring. Would recommend anyone to give it a try.',
    fullReview:
      'Amazing time with Mergim at Peaks of the Balkans. Despite the weather on day one we still had a blast, and discovered that Kosovo and Albania are still hidden gems that need more exploring. Would recommend anyone to give it a try.',
    date: new Date('2026-05-08'),
    featured: true,
  },
  {
    guestName: 'Isa Mehmeti',
    rating: 5,
    quote:
      'Had an amazing time with Summit Balkans on our Albanian trip. Would recommend anyone to try it once, especially Valbona peak.',
    fullReview:
      'Had an amazing time with Summit Balkans on our Albanian trip. Would recommend anyone to try it once, especially Valbona peak.',
    date: new Date('2026-05-15'),
    featured: false,
  },
  {
    guestName: 'Deniza',
    rating: 5,
    quote:
      'I had a wonderful time. Everything was explained, and they helped me get prepared with gear and equipment.',
    fullReview:
      'I had a wonderful time. Everything was explained, and they helped me get prepared with gear and equipment.',
    date: new Date('2026-05-05'),
    featured: false,
  },
];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set in .env.local');

  const connection = await mysql.createConnection(url);
  const db = drizzle(connection);

  try {
    // Link reviews to the Peaks of the Balkans tour if it exists.
    const tourRows = await db
      .select({ id: tours.id })
      .from(tours)
      .where(or(like(tours.slug, '%peaks-of-the-balkans%'), like(tours.title, '%Peaks of the Balkans%')))
      .limit(1);
    const tourId = tourRows[0]?.id ?? null;

    // Idempotent: clear previously seeded Google reviews, then re-insert.
    await db.delete(reviews).where(eq(reviews.source, 'GOOGLE'));

    await db.insert(reviews).values(
      googleReviews.map((r) => ({
        tourId,
        guestName: r.guestName,
        guestCountry: null,
        rating: r.rating,
        quote: r.quote,
        fullReview: r.fullReview,
        date: r.date,
        verified: true,
        featured: r.featured,
        published: true,
        source: 'GOOGLE' as const,
      }))
    );

    console.log(
      `✓ Seeded ${googleReviews.length} Google reviews` +
        (tourId ? ` linked to tour #${tourId}.` : ' (no Peaks tour found — left unlinked).')
    );
  } finally {
    await connection.end();
  }
}

main().catch((err) => {
  console.error('Failed to seed reviews:', err);
  process.exit(1);
});
