import { db } from '@/lib/db/client';
import { guides } from '@/lib/db/schema';
import { asc, eq } from 'drizzle-orm';

export type GuideListItem = typeof guides.$inferSelect;

export async function getGuides() {
  return db.select().from(guides).orderBy(asc(guides.displayOrder), asc(guides.name));
}

export async function getGuideById(id: number) {
  return db.query.guides.findFirst({ where: eq(guides.id, id) });
}
