import { db } from '@/lib/db/client';
import { customers, bookings } from '@/lib/db/schema';
import { desc, eq, or, sql } from 'drizzle-orm';

export type CustomerListItem = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  country: string | null;
  totalBookings: number;
  totalSpentEur: string;
  createdAt: Date;
};

export type CustomerDetail = typeof customers.$inferSelect & {
  bookings: Array<{
    id: number;
    bookingReference: string;
    tourTitle: string;
    status: string;
    paymentStatus: string;
    totalEur: string;
    createdAt: Date;
  }>;
};

export type CustomerFilters = {
  search?: string;
  page?: number;
  pageSize?: number;
};

export async function getCustomers(filters: CustomerFilters = {}) {
  const { search, page = 1, pageSize = 25 } = filters;
  const offset = (page - 1) * pageSize;

  const [rows] = await db.execute(sql`
    SELECT
      id, first_name, last_name, email, phone, country,
      total_bookings, total_spent_eur, created_at
    FROM customers
    WHERE 1=1
      ${search ? sql`AND (email LIKE ${`%${search}%`} OR CONCAT(first_name, ' ', last_name) LIKE ${`%${search}%`})` : sql``}
    ORDER BY created_at DESC
    LIMIT ${pageSize} OFFSET ${offset}
  `);

  const [countRows] = await db.execute(sql`
    SELECT COUNT(*) AS total FROM customers
    WHERE 1=1
      ${search ? sql`AND (email LIKE ${`%${search}%`} OR CONCAT(first_name, ' ', last_name) LIKE ${`%${search}%`})` : sql``}
  `);

  const items = (rows as unknown as Array<Record<string, unknown>>).map((r) => ({
    id: Number(r.id),
    firstName: String(r.first_name),
    lastName: String(r.last_name),
    email: String(r.email),
    phone: r.phone ? String(r.phone) : null,
    country: r.country ? String(r.country) : null,
    totalBookings: Number(r.total_bookings ?? 0),
    totalSpentEur: String(r.total_spent_eur ?? '0'),
    createdAt: new Date(r.created_at as string),
  }));

  const total = Number((countRows as unknown as Array<{ total: number }>)[0]?.total ?? 0);
  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getCustomerById(id: number): Promise<CustomerDetail | null> {
  const [customer] = await db.select().from(customers).where(eq(customers.id, id));
  if (!customer) return null;

  const bookingRows = await db.execute(sql`
    SELECT b.id, b.booking_reference, t.title AS tour_title,
           b.status, b.payment_status, b.total_eur, b.created_at
    FROM bookings b
    JOIN tours t ON t.id = b.tour_id
    WHERE b.customer_id = ${id}
    ORDER BY b.created_at DESC
  `);

  const bookingList = (bookingRows as unknown as Array<Record<string, unknown>>).map((r) => ({
    id: Number(r.id),
    bookingReference: String(r.booking_reference),
    tourTitle: String(r.tour_title),
    status: String(r.status),
    paymentStatus: String(r.payment_status),
    totalEur: String(r.total_eur),
    createdAt: new Date(r.created_at as string),
  }));

  return { ...customer, bookings: bookingList };
}
