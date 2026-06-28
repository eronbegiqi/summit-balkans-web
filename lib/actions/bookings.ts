'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db/client';
import { bookings, activityLog, paymentTransactions, gearRentals } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';

async function getAdminSession() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  return session;
}

type BookingStatus = typeof bookings.$inferSelect['status'];
type PaymentMethod = 'BANK_TRANSFER' | 'CASH' | 'OTHER';

const STATUS_FLOW: BookingStatus[] = [
  'NEW', 'CONFIRMED', 'PRE_TRIP', 'IN_PROGRESS', 'COMPLETED',
];

export async function updateBookingStatus(bookingId: number, newStatus: BookingStatus) {
  const session = await getAdminSession();

  const [booking] = await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1);
  if (!booking) throw new Error('Booking not found');

  await db.update(bookings).set({ status: newStatus }).where(eq(bookings.id, bookingId));

  await db.insert(activityLog).values({
    adminUserId: session.adminUserId,
    entityType: 'booking',
    entityId: bookingId,
    action: 'status_change',
    changes: { status: { from: booking.status, to: newStatus } },
  });

  revalidatePath(`/admin/bookings/${bookingId}`);
  revalidatePath('/admin/bookings');
}

export async function cancelBooking(bookingId: number) {
  const session = await getAdminSession();

  await db.update(bookings)
    .set({ status: 'CANCELLED' })
    .where(eq(bookings.id, bookingId));

  await db.insert(activityLog).values({
    adminUserId: session.adminUserId,
    entityType: 'booking',
    entityId: bookingId,
    action: 'cancelled',
    changes: {},
  });

  revalidatePath(`/admin/bookings/${bookingId}`);
  revalidatePath('/admin/bookings');
}

export async function saveInternalNotes(bookingId: number, notes: string) {
  await getAdminSession();
  await db.update(bookings).set({ internalNotes: notes }).where(eq(bookings.id, bookingId));
  revalidatePath(`/admin/bookings/${bookingId}`);
}

export async function deleteBooking(bookingId: number) {
  const session = await getAdminSession();

  const [booking] = await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1);
  if (!booking) throw new Error('Booking not found');

  await Promise.all([
    db.delete(paymentTransactions).where(eq(paymentTransactions.bookingId, bookingId)),
    db.delete(gearRentals).where(eq(gearRentals.bookingId, bookingId)),
    db.delete(activityLog).where(and(eq(activityLog.entityType, 'booking'), eq(activityLog.entityId, bookingId))),
  ]);

  await db.delete(bookings).where(eq(bookings.id, bookingId));

  await db.insert(activityLog).values({
    adminUserId: session.adminUserId,
    entityType: 'booking',
    entityId: bookingId,
    action: 'deleted',
    changes: { deleted: { from: booking.bookingReference, to: null } },
  });

  revalidatePath('/admin/bookings');
  redirect('/admin/bookings');
}

export async function recordManualPayment(
  bookingId: number,
  amountEur: number,
  method: PaymentMethod,
  reference: string
) {
  const session = await getAdminSession();

  const [booking] = await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1);
  if (!booking) throw new Error('Booking not found');

  const newPaid = parseFloat(booking.paidAmountEur ?? '0') + amountEur;
  const total = parseFloat(booking.totalEur);
  const newPaymentStatus = newPaid >= total ? 'PAID' : newPaid > 0 ? 'DEPOSIT_PAID' : 'PENDING';

  await Promise.all([
    db.update(bookings).set({
      paidAmountEur: String(newPaid),
      paymentStatus: newPaymentStatus,
      paymentMethod: method,
      paymentReference: reference || undefined,
    }).where(eq(bookings.id, bookingId)),

    db.insert(paymentTransactions).values({
      bookingId,
      transactionType: 'PAYMENT',
      paymentMethod: method,
      amountEur: String(amountEur),
      status: 'SUCCESS',
      externalReference: reference || undefined,
      processedById: session.adminUserId,
    }),

    db.insert(activityLog).values({
      adminUserId: session.adminUserId,
      entityType: 'booking',
      entityId: bookingId,
      action: 'manual_payment',
      changes: { amount: { from: booking.paidAmountEur, to: String(newPaid) } },
    }),
  ]);

  revalidatePath(`/admin/bookings/${bookingId}`);
}
