import { db } from '@/lib/db/client';
import { destinations } from '@/lib/db/schema';
import { asc, eq } from 'drizzle-orm';

export async function getDestinations() {
  return db.select().from(destinations).orderBy(asc(destinations.displayOrder), asc(destinations.name));
}

export async function getDestinationById(id: number) {
  return db.query.destinations.findFirst({ where: eq(destinations.id, id) });
}
