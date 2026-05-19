import { db } from '@/lib/db/client';
import { guides } from '@/lib/db/schema';
import { asc, eq } from 'drizzle-orm';

export type GuideListItem = typeof guides.$inferSelect;

export async function getGuides() {
  return db.select().from(guides).orderBy(asc(guides.displayOrder), asc(guides.name));
}

export async function getGuideById(id: number) {
  const [row] = await db.select().from(guides).where(eq(guides.id, id));
  return row ?? null;
}
