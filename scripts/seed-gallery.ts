/**
 * Seeds placeholder photos into the `gallery_images` table so the homepage
 * gallery section and /gallery page have real content to preview before real
 * trip photos are uploaded through the admin.
 *
 * Idempotent: clears any previously seeded placeholders (imageUrl containing
 * "picsum.photos") first, then re-inserts, so it can be re-run safely. Once
 * real images are uploaded via /admin/gallery, this script has nothing left
 * to touch — real rows never match the picsum.photos filter.
 *
 * Run from the project root:  npx tsx scripts/seed-gallery.ts
 * Requires DATABASE_URL in .env.local
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { galleryImages } from '../lib/db/schema';
import { like } from 'drizzle-orm';

const captions = [
  'Sunrise over the Accursed Mountains',
  'Trail through Valbona valley',
  'Crossing the Rugova Canyon',
  'Alpine lake in Montenegro',
  'Village guesthouse, Theth',
  'Ridge walk above the clouds',
  'Local guide leading the way',
  'Wildflowers on the high pastures',
  'Adriatic coastline near Kotor',
  'Camp at dusk',
  'Limestone peaks of the Sharr range',
  'Shepherd trail, Vuthaj',
  'Morning mist over Çerem',
  'Stone bridge on the old trade route',
  'Group hiking the Peaks of the Balkans',
  'Waterfall stop, Kosovo',
];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set in .env.local');

  const connection = await mysql.createConnection(url);
  const db = drizzle(connection);

  try {
    await db.delete(galleryImages).where(like(galleryImages.imageUrl, '%picsum.photos%'));

    await db.insert(galleryImages).values(
      captions.map((caption, i) => ({
        imageUrl: `https://picsum.photos/seed/summit-balkans-gallery-${i + 1}/1600/1200`,
        title: caption,
        altText: caption,
        published: true,
        displayOrder: i,
      }))
    );

    console.log(`✓ Seeded ${captions.length} placeholder gallery images.`);
  } finally {
    await connection.end();
  }
}

main().catch((err) => {
  console.error('Failed to seed gallery:', err);
  process.exit(1);
});
