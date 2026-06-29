export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { db } from "@/lib/db/client";
import { bookings, customers, tours, departures } from "@/lib/db/schema";
import { eq, and, or, isNull, notInArray } from "drizzle-orm";
import { PaymentReminder } from "@/emails/PaymentReminder";

const getResend = () => new Resend(process.env.RESEND_API_KEY ?? '');
const FROM = process.env.RESEND_FROM ?? "Summit Balkans <info@summitbalkans.com>";

// Finds bookings whose departure is exactly 37 days away (1 week before the 30-day payment deadline).
// Skips bookings already paid in full.

function targetDate(daysAhead: number): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + daysAhead);
  return d;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export async function GET(req: NextRequest) {
  // Verify Vercel cron secret (not set in dev, so only enforced when the env var exists)
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const departureDateTarget = targetDate(37); // 37 days out = 7 days before the 30-day deadline
    const dueDate = targetDate(7);              // payment due in 7 days

    const dueBookings = await db
      .select({
        bookingRef: bookings.bookingReference,
        firstName: customers.firstName,
        email: customers.email,
        tourName: tours.title,
        departureStartDate: departures.startDate,
        customStartDate: bookings.customStartDate,
        totalEur: bookings.totalEur,
        paidAmountEur: bookings.paidAmountEur,
        paymentStatus: bookings.paymentStatus,
      })
      .from(bookings)
      .innerJoin(customers, eq(bookings.customerId, customers.id))
      .innerJoin(tours, eq(bookings.tourId, tours.id))
      .leftJoin(departures, eq(bookings.departureId, departures.id))
      .where(
        and(
          notInArray(bookings.paymentStatus, ['PAID', 'REFUNDED', 'FAILED']),
          notInArray(bookings.status, ['CANCELLED', 'REFUNDED', 'COMPLETED']),
          or(
            eq(departures.startDate, departureDateTarget),
            and(
              isNull(bookings.departureId),
              eq(bookings.customStartDate, departureDateTarget),
            ),
          ),
        ),
      );

    if (dueBookings.length === 0) {
      return NextResponse.json({ ok: true, sent: 0, message: 'No reminders due today' });
    }

    const results = await Promise.allSettled(
      dueBookings.map(async (row) => {
        const rawDeparture = row.departureStartDate ?? row.customStartDate;
        if (!rawDeparture) return null;

        const total = parseFloat(row.totalEur ?? '0');
        const paid = parseFloat(row.paidAmountEur ?? '0');
        const remaining = Math.max(0, total - paid);

        // Skip if nothing is actually owed
        if (remaining <= 0) return null;

        await getResend().emails.send({
          from: FROM,
          to: row.email,
          subject: `Final payment due in 7 days — ${row.tourName} · ${row.bookingRef}`,
          html: await render(PaymentReminder({
            bookingRef: row.bookingRef,
            firstName: row.firstName,
            tourName: row.tourName,
            departureDate: formatDate(rawDeparture instanceof Date ? rawDeparture : new Date(`${rawDeparture}T00:00:00`)),
            dueDate: formatDate(dueDate),
            totalPrice: total,
            paidAmount: paid,
            remainingAmount: remaining,
          })),
        });

        return row.bookingRef;
      })
    );

    const sent = results.filter(
      (r) => r.status === 'fulfilled' && r.value !== null
    ).length;

    const failed = results
      .filter((r) => r.status === 'rejected')
      .map((r) => (r as PromiseRejectedResult).reason?.message ?? 'unknown error');

    console.log(`[cron/payment-reminder] sent=${sent} failed=${failed.length} date=${departureDateTarget}`);

    return NextResponse.json({ ok: true, sent, failed: failed.length > 0 ? failed : undefined });
  } catch (err) {
    console.error('[cron/payment-reminder]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
