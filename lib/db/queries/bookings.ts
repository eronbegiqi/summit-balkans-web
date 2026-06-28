import { db } from '@/lib/db/client';
import { cachedQuery } from '@/lib/db/cache';
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

  return cachedQuery(`bookings:list:${JSON.stringify({ status, paymentStatus, search, page, pageSize })}`, async () => {
    const [rows] = await db.execute(sql`
      SELECT
        b.id,
        b.booking_reference   AS bookingReference,
        CONCAT(c.first_name, ' ', c.last_name) AS customerName,
        c.email               AS customerEmail,
        t.title               AS tourTitle,
        d.start_date          AS departureDate,
        b.total_eur           AS totalEur,
        b.payment_status      AS paymentStatus,
        b.status,
        b.booking_source      AS bookingSource,
        b.created_at          AS createdAt
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

    const [countRows] = await db.execute(sql`
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
  }, { items: [] as BookingListItem[], total: 0, page, pageSize, totalPages: 0 });
}

export async function getBookingById(id: number): Promise<BookingDetail | null> {
  return cachedQuery<BookingDetail | null>(`bookings:id:${id}`, async () => {
  const [booking] = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
  if (!booking) return null;

  const [customer] = await db.select().from(customers).where(eq(customers.id, booking.customerId)).limit(1);
  const [tour] = await db.select().from(tours).where(eq(tours.id, booking.tourId)).limit(1);
  const departure = booking.departureId
    ? ((await db.select().from(departures).where(eq(departures.id, booking.departureId)).limit(1))[0] ?? null)
    : null;

  const rentals = await db.select().from(gearRentals).where(eq(gearRentals.bookingId, id));
  const gearRentalsWithUnits = await Promise.all(
    rentals.map(async (rental) => {
      const [unit] = await db.select().from(gearUnits).where(eq(gearUnits.id, rental.gearUnitId)).limit(1);
      const [item] = await db.select().from(gearItems).where(eq(gearItems.id, unit.gearItemId)).limit(1);
      return { ...rental, gearUnit: { ...unit, gearItem: item } };
    })
  );

  const txList = await db.select().from(paymentTransactions).where(eq(paymentTransactions.bookingId, id));

  // mysql2 prepared statements may return JSON columns as raw strings — parse them.
  const parseJson = <T>(val: unknown): T | null => {
    if (val == null) return null;
    if (typeof val === 'string') { try { return JSON.parse(val) as T; } catch { return null; } }
    return val as T;
  };

  return {
    ...booking,
    travelersData: parseJson(booking.travelersData),
    paymentData: parseJson(booking.paymentData),
    customer,
    tour,
    departure,
    gearRentals: gearRentalsWithUnits,
    paymentTransactions: txList,
  } as unknown as BookingDetail;
  }, null);
}

export async function getNewBookingCount(): Promise<number> {
  return cachedQuery('bookings:newCount', async () => {
    const [row] = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(eq(bookings.status, 'NEW'));
    return Number(row?.count ?? 0);
  }, 0);
}
