import { db } from '@/lib/db/client';
import { bookings, customers, tours, departures, gearRentals, gearUnits, gearItems, paymentTransactions } from '@/lib/db/schema';
import { and, desc, eq, ilike, inArray, or, sql } from 'drizzle-orm';

export type BookingListItem = {
  id: number;
  bookingReference: string;
  customerName: string;
  customerEmail: string;
  tourTitle: string;
  departureDate: string | null;
  totalEur: string;
  paymentStatus: string;
  status: string;
  bookingSource: string;
  createdAt: Date;
};

export type BookingDetail = typeof bookings.$inferSelect & {
  customer: typeof customers.$inferSelect;
  tour: typeof tours.$inferSelect;
  departure: typeof departures.$inferSelect | null;
  gearRentals: Array<typeof gearRentals.$inferSelect & {
    gearUnit: typeof gearUnits.$inferSelect & {
      gearItem: typeof gearItems.$inferSelect;
    };
  }>;
  paymentTransactions: Array<typeof paymentTransactions.$inferSelect>;
};

export type BookingFilters = {
  status?: string;
  paymentStatus?: string;
  search?: string;
  page?: number;
  pageSize?: number;
};

export async function getBookings(filters: BookingFilters = {}) {
  const { status, paymentStatus, search, page = 1, pageSize = 25 } = filters;
  const offset = (page - 1) * pageSize;

  const rows = await db.execute(sql`
    SELECT
      b.id,
      b.booking_reference,
      CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
      c.email AS customer_email,
      t.title AS tour_title,
      d.start_date AS departure_date,
      b.total_eur,
      b.payment_status,
      b.status,
      b.booking_source,
      b.created_at
    FROM bookings b
    JOIN customers c ON c.id = b.customer_id
    JOIN tours t ON t.id = b.tour_id
    LEFT JOIN departures d ON d.id = b.departure_id
    WHERE 1=1
      ${status ? sql`AND b.status = ${status}` : sql``}
      ${paymentStatus ? sql`AND b.payment_status = ${paymentStatus}` : sql``}
      ${search ? sql`AND (b.booking_reference LIKE ${`%${search}%`} OR c.email LIKE ${`%${search}%`} OR CONCAT(c.first_name, ' ', c.last_name) LIKE ${`%${search}%`})` : sql``}
    ORDER BY b.created_at DESC
    LIMIT ${pageSize} OFFSET ${offset}
  `);

  const countRows = await db.execute(sql`
    SELECT COUNT(*) AS total
    FROM bookings b
    JOIN customers c ON c.id = b.customer_id
    WHERE 1=1
      ${status ? sql`AND b.status = ${status}` : sql``}
      ${paymentStatus ? sql`AND b.payment_status = ${paymentStatus}` : sql``}
      ${search ? sql`AND (b.booking_reference LIKE ${`%${search}%`} OR c.email LIKE ${`%${search}%`})` : sql``}
  `);

  const items = rows as unknown as BookingListItem[];
  const total = Number((countRows as unknown as Array<{ total: number }>)[0]?.total ?? 0);

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getBookingById(id: number): Promise<BookingDetail | null> {
  const result = await db.query.bookings.findFirst({
    where: eq(bookings.id, id),
    with: {
      customer: true,
      tour: true,
      departure: true,
      gearRentals: {
        with: {
          gearUnit: {
            with: { gearItem: true },
          },
        },
      },
      paymentTransactions: true,
    },
  });
  return result as BookingDetail | null;
}

export async function getNewBookingCount(): Promise<number> {
  const [row] = await db
    .select({ count: sql<number>`count(*)` })
    .from(bookings)
    .where(eq(bookings.status, 'NEW'));
  return Number(row?.count ?? 0);
}
