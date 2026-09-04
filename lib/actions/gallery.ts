'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db/client';
import { galleryImages } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';
import { deleteImage, urlToKey } from '@/lib/r2/client';

async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  return session;
}

function revalidateGallery() {
  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
  revalidatePath('/');
}

type NewGalleryImage = {
  imageUrl: string;
  title?: string | null;
  altText?: string | null;
};

export async function createGalleryImages(images: NewGalleryImage[]) {
  await requireAdmin();
  if (images.length === 0) return;

  const [row] = await db
    .select({ max: sql<number>`coalesce(max(${galleryImages.displayOrder}), -1)` })
    .from(galleryImages);
  const startOrder = (row?.max ?? -1) + 1;

  await db.insert(galleryImages).values(
    images.map((img, i) => ({
      imageUrl: img.imageUrl,
      title: img.title ?? null,
      altText: img.altText ?? null,
      displayOrder: startOrder + i,
    }))
  );

  revalidateGallery();
}

export async function updateGalleryImage(
  id: number,
  data: Partial<{ title: string | null; altText: string | null; published: boolean }>
) {
  await requireAdmin();
  await db.update(galleryImages).set(data).where(eq(galleryImages.id, id));
  revalidateGallery();
}

export async function deleteGalleryImage(id: number) {
  await requireAdmin();

  const [row] = await db.select().from(galleryImages).where(eq(galleryImages.id, id));
  await db.delete(galleryImages).where(eq(galleryImages.id, id));

  if (row) {
    try {
      await deleteImage(urlToKey(row.imageUrl));
    } catch (err) {
      // DB row is already gone; a stray R2 object is a cheaper failure mode
      // than blocking the delete on storage cleanup.
      console.error('[gallery] failed to delete R2 object for', row.imageUrl, err);
    }
  }

  revalidateGallery();
}

/** Persists a new order: orderedIds is the full list of ids, in the desired order. */
export async function reorderGalleryImages(orderedIds: number[]) {
  await requireAdmin();
  await Promise.all(
    orderedIds.map((id, index) =>
      db.update(galleryImages).set({ displayOrder: index }).where(eq(galleryImages.id, id))
    )
  );
  revalidateGallery();
}
