import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { inquiries } from '@/lib/db/schema';
import { z } from 'zod';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = `Summit Balkans <${process.env.RESEND_FROM_EMAIL ?? 'info@summitbalkans.com'}>`;
const ADMIN_EMAIL = 'info@summitbalkans.com';

const inquirySchema = z.object({
  type: z.enum(['CONTACT', 'PRIVATE_TRIP', 'TRIP_ALERT', 'GEAR_RENTAL', 'PRESS']),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().optional(),
  groupSize: z.number().optional(),
  preferredDatesStart: z.string().optional(),
  preferredDatesEnd: z.string().optional(),
  countriesOfInterest: z.array(z.string()).optional(),
  budgetEur: z.number().optional(),
  sourcePage: z.string().optional(),
});

const AUTO_REPLY_SUBJECTS: Record<string, string> = {
  CONTACT: "We got your message — Summit Balkans",
  PRIVATE_TRIP: "We'll design your Balkans route — Summit Balkans",
  TRIP_ALERT: "You're on the list — Summit Balkans",
  GEAR_RENTAL: "Gear rental enquiry received — Summit Balkans",
  PRESS: "Press enquiry received — Summit Balkans",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = inquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data', issues: parsed.error.issues }, { status: 400 });
    }

    const data = parsed.data;
    const userAgent = req.headers.get('user-agent') ?? undefined;
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] ?? undefined;

    const [result] = await db.insert(inquiries).values({
      type: data.type,
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      groupSize: data.groupSize,
      preferredDatesStart: data.preferredDatesStart ? new Date(data.preferredDatesStart) : undefined,
      preferredDatesEnd: data.preferredDatesEnd ? new Date(data.preferredDatesEnd) : undefined,
      countriesOfInterest: data.countriesOfInterest,
      budgetEur: data.budgetEur ? String(data.budgetEur) : undefined,
      sourcePage: data.sourcePage,
      userAgent,
      ipAddress,
      status: 'NEW',
    });

    const inquiryId = Number((result as unknown as { insertId: number }).insertId);

    // Send emails in parallel (non-blocking — don't fail the request if email fails)
    const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/admin/inquiries/${inquiryId}`;
    Promise.all([
      resend.emails.send({
        from: FROM,
        to: [data.email],
        subject: AUTO_REPLY_SUBJECTS[data.type] ?? "Enquiry received — Summit Balkans",
        text: `Hi ${data.name},\n\nThank you for reaching out. We've received your enquiry and will get back to you within 24 hours.\n\nBest regards,\nSummit Balkans`,
      }),
      resend.emails.send({
        from: FROM,
        to: [ADMIN_EMAIL],
        replyTo: data.email,
        subject: `New ${data.type.replace('_', ' ')} enquiry from ${data.name}`,
        text: `From: ${data.name} (${data.email})\nType: ${data.type}\n\n${data.message ?? ''}\n\nView: ${adminUrl}`,
      }),
    ]).catch((err) => console.error('[api/public/inquiries] email error:', err));

    return NextResponse.json({ ok: true, inquiryId });
  } catch (err) {
    console.error('[api/public/inquiries]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
