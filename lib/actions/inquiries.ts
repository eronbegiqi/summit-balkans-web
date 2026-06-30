'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db/client';
import { inquiries, activityLog, bookings, customers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';
import { Resend } from 'resend';

const getResend = () => new Resend(process.env.RESEND_API_KEY ?? '');

type InquiryStatus = typeof inquiries.$inferSelect['status'];

async function getAdminSession() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  return session;
}

export async function updateInquiryStatus(inquiryId: number, newStatus: InquiryStatus) {
  const session = await getAdminSession();

  await db.update(inquiries)
    .set({ status: newStatus })
    .where(eq(inquiries.id, inquiryId));

  await db.insert(activityLog).values({
    adminUserId: session.adminUserId,
    entityType: 'inquiry',
    entityId: inquiryId,
    action: 'status_change',
    changes: { status: { from: null, to: newStatus } },
  });

  revalidatePath(`/admin/inquiries/${inquiryId}`);
  revalidatePath('/admin/inquiries');
}

export async function replyToInquiry(inquiryId: number, replyBody: string) {
  const session = await getAdminSession();

  const [inquiry] = await db.select().from(inquiries).where(eq(inquiries.id, inquiryId)).limit(1);
  if (!inquiry) throw new Error('Inquiry not found');

  await getResend().emails.send({
    from: `Summit Balkans <${process.env.RESEND_FROM_EMAIL}>`,
    to: [inquiry.email],
    replyTo: process.env.RESEND_FROM_EMAIL,
    subject: `Re: Your enquiry — Summit Balkans`,
    text: replyBody,
  });

  await db.update(inquiries).set({
    status: 'REPLIED',
    repliedAt: new Date(),
    replyNotes: replyBody,
  }).where(eq(inquiries.id, inquiryId));

  await db.insert(activityLog).values({
    adminUserId: session.adminUserId,
    entityType: 'inquiry',
    entityId: inquiryId,
    action: 'replied',
    changes: {},
  });

  revalidatePath(`/admin/inquiries/${inquiryId}`);
}

export async function saveInquiryNotes(inquiryId: number, notes: string) {
  await getAdminSession();
  await db.update(inquiries).set({ replyNotes: notes }).where(eq(inquiries.id, inquiryId));
  revalidatePath(`/admin/inquiries/${inquiryId}`);
}

export async function deleteInquiry(inquiryId: number) {
  await getAdminSession();

  const [existing] = await db.select().from(inquiries).where(eq(inquiries.id, inquiryId)).limit(1);
  if (!existing) throw new Error('Inquiry not found');

  await db.delete(inquiries).where(eq(inquiries.id, inquiryId));

  revalidatePath('/admin/inquiries');
  revalidatePath(`/admin/inquiries/${inquiryId}`);
}

export async function convertInquiryToBookingDraft(inquiryId: number): Promise<{ bookingId: number }> {
  const session = await getAdminSession();

  const [inquiry] = await db.select().from(inquiries).where(eq(inquiries.id, inquiryId)).limit(1);
  if (!inquiry) throw new Error('Inquiry not found');

  // Find or create customer
  let [customer] = await db.select().from(customers).where(eq(customers.email, inquiry.email)).limit(1);
  if (!customer) {
    const [firstName, ...rest] = inquiry.name.split(' ');
    const [inserted] = await db.insert(customers).values({
      email: inquiry.email,
      firstName,
      lastName: rest.join(' ') || '-',
      phone: inquiry.phone ?? undefined,
    });
    // Re-fetch the inserted customer
    [customer] = await db.select().from(customers).where(eq(customers.email, inquiry.email)).limit(1);
  }

  // Create minimal draft booking — must select a tour manually after
  const ref = `SB-${Date.now().toString(36).toUpperCase()}`;
  const [result] = await db.insert(bookings).values({
    bookingReference: ref,
    customerId: customer.id,
    tourId: 1, // placeholder — admin must update
    numAdults: inquiry.groupSize ?? 1,
    basePriceEur: '0',
    totalEur: '0',
    status: 'NEW',
    paymentStatus: 'PENDING',
    internalNotes: `Converted from inquiry #${inquiryId} — ${inquiry.type}`,
  });

  const bookingId = Number((result as unknown as { insertId: number }).insertId);

  await db.insert(activityLog).values({
    adminUserId: session.adminUserId,
    entityType: 'booking',
    entityId: bookingId,
    action: 'created_from_inquiry',
    changes: { inquiryId: { from: null, to: inquiryId } },
  });

  revalidatePath('/admin/bookings');
  return { bookingId };
}
