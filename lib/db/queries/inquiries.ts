import { db } from '@/lib/db/client';
import { cachedQuery } from '@/lib/db/cache';
import { inquiries, adminUsers } from '@/lib/db/schema';
import { and, desc, eq, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';

export type InquiryListItem = typeof inquiries.$inferSelect;

export type InquiryDetail = typeof inquiries.$inferSelect & {
  assignedTo: typeof adminUsers.$inferSelect | null;
};

export type InquiryFilters = {
  type?: string;
  status?: string;
  page?: number;
  pageSize?: number;
};

export type InquiryLookupResult = {
  inquiry: InquiryDetail | null;
  notFound: boolean;
  error: string | null;
};

export async function getInquiries(filters: InquiryFilters = {}) {
  const { type, status, page = 1, pageSize = 25 } = filters;
  const offset = (page - 1) * pageSize;

  const conditions: SQL[] = [];
  if (type) conditions.push(eq(inquiries.type, type as typeof inquiries.$inferSelect['type']));
  if (status) conditions.push(eq(inquiries.status, status as NonNullable<typeof inquiries.$inferSelect['status']>));

  const whereClause = conditions.length ? and(...conditions) : undefined;

  return cachedQuery(`inquiries:list:${JSON.stringify({ type, status, page, pageSize })}`, async () => {
    const [items, countRows] = await Promise.all([
      db.select().from(inquiries).where(whereClause).orderBy(desc(inquiries.createdAt)).limit(pageSize).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(inquiries).where(whereClause),
    ]);

    const total = Number(countRows[0]?.count ?? 0);
    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }, { items: [], total: 0, page, pageSize, totalPages: 0 });
}

export async function getInquiryById(id: number): Promise<InquiryLookupResult> {
  return cachedQuery<InquiryLookupResult>(`inquiries:id:${id}`, async () => {
    const [inquiry] = await db.select().from(inquiries).where(eq(inquiries.id, id)).limit(1);
    if (!inquiry) {
      return { inquiry: null, notFound: true, error: null };
    }

    const assignedTo = inquiry.assignedToId
      ? ((await db.select().from(adminUsers).where(eq(adminUsers.id, inquiry.assignedToId)).limit(1))[0] ?? null)
      : null;

    return { inquiry: { ...inquiry, assignedTo }, notFound: false, error: null };
  }, { inquiry: null, notFound: true, error: 'Unable to load inquiry right now.' });
}

export async function getInquiryCountsByType() {
  return cachedQuery('inquiries:countsByType', async () => {
    const [rows] = await db.execute(sql`
      SELECT type, status, COUNT(*) AS count
      FROM inquiries
      GROUP BY type, status
    `);
    return rows as unknown as Array<{ type: string; status: string; count: number }>;
  }, []);
}
