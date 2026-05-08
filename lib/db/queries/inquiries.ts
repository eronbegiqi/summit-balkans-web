import { db } from '@/lib/db/client';
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

export async function getInquiries(filters: InquiryFilters = {}) {
  const { type, status, page = 1, pageSize = 25 } = filters;
  const offset = (page - 1) * pageSize;

  const conditions: SQL[] = [];
  if (type) conditions.push(eq(inquiries.type, type as typeof inquiries.$inferSelect['type']));
  if (status) conditions.push(eq(inquiries.status, status as NonNullable<typeof inquiries.$inferSelect['status']>));

  const whereClause = conditions.length ? and(...conditions) : undefined;

  const [items, countRows] = await Promise.all([
    db.select().from(inquiries).where(whereClause).orderBy(desc(inquiries.createdAt)).limit(pageSize).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(inquiries).where(whereClause),
  ]);

  const total = Number(countRows[0]?.count ?? 0);
  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getInquiryById(id: number): Promise<InquiryDetail | null> {
  const [row] = await db.select().from(inquiries).where(eq(inquiries.id, id));
  if (!row) return null;

  const assignedTo = row.assignedToId
    ? ((await db.select().from(adminUsers).where(eq(adminUsers.id, row.assignedToId)))[0] ?? null)
    : null;

  return { ...row, assignedTo };
}

export async function getInquiryCountsByType() {
  const [rows] = await db.execute(sql`
    SELECT type, status, COUNT(*) AS count
    FROM inquiries
    GROUP BY type, status
  `);
  return rows as unknown as Array<{ type: string; status: string; count: number }>;
}
