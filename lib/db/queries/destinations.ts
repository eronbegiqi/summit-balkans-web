import { db } from '@/lib/db/client';
import { cachedQuery } from '@/lib/db/cache';
import { destinations } from '@/lib/db/schema';
import { asc, eq } from 'drizzle-orm';

type Destination = typeof destinations.$inferSelect;

export async function getDestinations() {
  return cachedQuery<Destination[]>('destinations:all', async () => {
    return db.select().from(destinations).orderBy(asc(destinations.displayOrder), asc(destinations.name));
  }, []);
}

export async function getDestinationById(id: number) {
  return cachedQuery<Destination | null>(`destinations:id:${id}`, async () => {
    const [row] = await db.select().from(destinations).where(eq(destinations.id, id));
    return row ?? null;
  }, null);
}
