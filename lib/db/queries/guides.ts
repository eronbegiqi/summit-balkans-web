import { db } from '@/lib/db/client';
import { cachedQuery } from '@/lib/db/cache';
import { guides } from '@/lib/db/schema';
import { asc, eq } from 'drizzle-orm';

export type GuideListItem = typeof guides.$inferSelect;

export async function getGuides() {
  return cachedQuery<GuideListItem[]>('guides:all', async () => {
    return db.select().from(guides).orderBy(asc(guides.displayOrder), asc(guides.name));
  }, []);
}

export async function getGuideById(id: number) {
  return cachedQuery<GuideListItem | null>(`guides:id:${id}`, async () => {
    const [row] = await db.select().from(guides).where(eq(guides.id, id));
    return row ?? null;
  }, null);
}
