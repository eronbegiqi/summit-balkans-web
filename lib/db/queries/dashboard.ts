import { db } from '@/lib/db/client';
import { cachedQuery } from '@/lib/db/cache';
import { bookings, departures, inquiries } from '@/lib/db/schema';
import { and, count, eq, gte, inArray, lte, sql, sum } from 'drizzle-orm';

export type MonthlyPoint = { month: string; value: number };

export type DashboardStats = {
  pendingBookings: number;
  revenueThisMonth: number;
  upcomingDepartures: number;
  openInquiries: number;
};

export type RecentBooking = {
  id: number;
  bookingReference: string;
  customerName: string;
  tourTitle: string;
  departureDate: string | null;
  totalEur: string;
  paymentStatus: string;
  status: string;
  createdAt: Date;
};

export type UpcomingDeparture = {
  id: number;
  tourTitle: string;
  startDate: string;
  capacity: number;
  bookedCount: number;
  status: string;
};

// Offline-resilient: serves the last cached result when the DB is unreachable.
const safeQuery = cachedQuery;

export async function getNewBookingsCount(): Promise<number> {
  return safeQuery('dashboard:newBookingsCount', async () => {
    const [row] = await db
      .select({ count: count() })
      .from(bookings)
      .where(eq(bookings.status, 'NEW'));
    return row?.count ?? 0;
  }, 0);
}

export async function getNewInquiriesCount(): Promise<number> {
  return safeQuery('dashboard:newInquiriesCount', async () => {
    const [row] = await db
      .select({ count: count() })
      .from(inquiries)
      .where(inArray(inquiries.status, ['NEW', 'IN_PROGRESS']));
    return row?.count ?? 0;
  }, 0);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return safeQuery('dashboard:stats', async () => {
    const [pending, revenue, upcoming, openInq] = await Promise.all([
      db.select({ count: count() }).from(bookings).where(eq(bookings.status, 'NEW')),
      db
        .select({ total: sum(bookings.paidAmountEur) })
        .from(bookings)
        .where(and(gte(bookings.createdAt, startOfMonth), lte(bookings.createdAt, now))),
      db
        .select({ count: count() })
        .from(departures)
        .where(sql`${departures.startDate} >= CURDATE() AND ${departures.startDate} <= ${thirtyDaysFromNow.toISOString().split('T')[0]}`),
      db
        .select({ count: count() })
        .from(inquiries)
        .where(inArray(inquiries.status, ['NEW', 'IN_PROGRESS'])),
    ]);

    return {
      pendingBookings: pending[0]?.count ?? 0,
      revenueThisMonth: parseFloat(revenue[0]?.total ?? '0'),
      upcomingDepartures: upcoming[0]?.count ?? 0,
      openInquiries: openInq[0]?.count ?? 0,
    };
  }, { pendingBookings: 0, revenueThisMonth: 0, upcomingDepartures: 0, openInquiries: 0 });
}

export async function getBookingsChartData(): Promise<MonthlyPoint[]> {
  return safeQuery('dashboard:bookingsChart', async () => {
    const [rows] = await db.execute(sql`
      SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS value
      FROM bookings
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY month
      ORDER BY month ASC
    `);
    const data = rows as unknown as Array<{ month: string; value: string | number }>;
    return data.map((r) => ({ month: r.month, value: Number(r.value) }));
  }, []);
}

export async function getRevenueChartData(): Promise<MonthlyPoint[]> {
  return safeQuery('dashboard:revenueChart', async () => {
    const [rows] = await db.execute(sql`
      SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COALESCE(SUM(paid_amount_eur), 0) AS value
      FROM bookings
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY month
      ORDER BY month ASC
    `);
    const data = rows as unknown as Array<{ month: string; value: string | number }>;
    return data.map((r) => ({ month: r.month, value: Number(r.value) }));
  }, []);
}

export async function getRecentBookings(): Promise<RecentBooking[]> {
  return safeQuery('dashboard:recentBookings', async () => {
    const [rows] = await db.execute(sql`
      SELECT
        b.id,
        b.booking_reference   AS bookingReference,
        CONCAT(c.first_name, ' ', c.last_name) AS customerName,
        t.title               AS tourTitle,
        d.start_date          AS departureDate,
        b.total_eur           AS totalEur,
        b.payment_status      AS paymentStatus,
        b.status,
        b.created_at          AS createdAt
      FROM bookings b
      JOIN customers c ON c.id = b.customer_id
      JOIN tours t ON t.id = b.tour_id
      LEFT JOIN departures d ON d.id = b.departure_id
      ORDER BY b.created_at DESC
      LIMIT 10
    `);
    return rows as unknown as RecentBooking[];
  }, []);
}

export async function getRecentInquiries() {
  return safeQuery('dashboard:recentInquiries', async () => {
    const [rows] = await db.execute(sql`
      SELECT id, type, name, email, status, created_at AS createdAt
      FROM inquiries
      ORDER BY created_at DESC
      LIMIT 5
    `);
    return rows as unknown as Array<{
      id: number;
      type: string;
      name: string;
      email: string;
      status: string;
      createdAt: Date;
    }>;
  }, []);
}

export async function getUpcomingDepartures(): Promise<UpcomingDeparture[]> {
  return safeQuery('dashboard:upcomingDepartures', async () => {
    const [rows] = await db.execute(sql`
      SELECT d.id, t.title AS tourTitle, d.start_date AS startDate, d.capacity, d.booked_count AS bookedCount, d.status
      FROM departures d
      JOIN tours t ON t.id = d.tour_id
      WHERE d.start_date >= CURDATE()
        AND d.status != 'CANCELLED'
      ORDER BY d.start_date ASC
      LIMIT 5
    `);
    return rows as unknown as UpcomingDeparture[];
  }, []);
}
