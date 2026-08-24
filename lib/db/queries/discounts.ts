import { db } from '@/lib/db/client';
import { cachedQuery } from '@/lib/db/cache';
import { discounts } from '@/lib/db/schema';
import { asc, eq } from 'drizzle-orm';

type Discount = typeof discounts.$inferSelect;

export async function getActiveDiscounts() {
  return cachedQuery<Discount[]>('discounts:active', async () => {
    return db.select().from(discounts).where(eq(discounts.active, true)).orderBy(asc(discounts.displayOrder));
  }, []);
}
