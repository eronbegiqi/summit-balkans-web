import { db } from '@/lib/db/client';
import { cachedQuery } from '@/lib/db/cache';
import { galleryImages } from '@/lib/db/schema';
import { asc, eq } from 'drizzle-orm';

export type GalleryImageListItem = typeof galleryImages.$inferSelect;

/** All rows, published and unpublished — admin use. */
export async function getGalleryImages() {
  return cachedQuery<GalleryImageListItem[]>('gallery:all', async () => {
    return db.select().from(galleryImages).orderBy(asc(galleryImages.displayOrder));
  }, []);
}

/** Published rows only, in display order — public use. */
export async function getPublishedGalleryImages() {
  return cachedQuery<GalleryImageListItem[]>('gallery:published', async () => {
    return db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.published, true))
      .orderBy(asc(galleryImages.displayOrder));
  }, []);
}
