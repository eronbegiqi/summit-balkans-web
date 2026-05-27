export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { bookings, customers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { BookingConfirmation } from "@/emails/BookingConfirmation";
import { AdminBookingAlert } from "@/emails/AdminBookingAlert";

const bookingSchema = z.object({
  departureId: z.string(),
  departureDate: z.string(),
  returnDate: z.string(),
  guide: z.string(),
  tourName: z.string(),
  adults: z.number().min(1),
  children: z.number().min(0),
  addOns: z.array(z.string()),
  totalPrice: z.number(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  dietary: z.string().optional(),
  fitness: z.string().optional(),
  emergencyName: z.string().optional(),
  emergencyPhone: z.string().optional(),
});

function generateRef(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let ref = "SB-";
  for (let i = 0; i < 8; i++) ref += chars[Math.floor(Math.random() * chars.length)];
  return ref;
}

const getResend = () => new Resend(process.env.RESEND_API_KEY ?? '');
const FROM = process.env.RESEND_FROM ?? "Summit Balkans <info@summitbalkans.com>";
const ADMIN = process.env.ADMIN_EMAIL ?? "info@summitbalkans.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = bookingSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid data", issues: result.error.issues }, { status: 400 });
    }

    const data = result.data;
    const bookingRef = generateRef();
    const fullName = `${data.firstName} ${data.lastName}`;

    // Upsert customer
    let [customer] = await db.select().from(customers).where(eq(customers.email, data.email)).limit(1);
    if (!customer) {
      await db.insert(customers).values({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone ?? undefined,
        dietaryRequirements: data.dietary ?? undefined,
        emergencyContactName: data.emergencyName ?? undefined,
        emergencyContactPhone: data.emergencyPhone ?? undefined,
      });
      [customer] = await db.select().from(customers).where(eq(customers.email, data.email)).limit(1);
    }

    // Save booking to DB — tourId 1 as placeholder (wizard doesn't pass DB tour ID yet)
    await db.insert(bookings).values({
      bookingReference: bookingRef,
      customerId: customer.id,
      tourId: 1,
      numAdults: data.adults,
      numChildren: data.children,
      travelersData: [{ firstName: data.firstName, lastName: data.lastName, email: data.email, phone: data.phone }],
      basePriceEur: String(data.totalPrice),
      totalEur: String(data.totalPrice),
      paymentType: "DEPOSIT",
      depositAmountEur: String(Math.ceil(data.totalPrice * 0.2)),
      paidAmountEur: "0",
      paymentStatus: "PENDING",
      bookingSource: "DIRECT",
      status: "NEW",
      internalNotes: `Add-ons: ${data.addOns.join(", ")} | Dep: ${data.departureId} | Guide: ${data.guide}`,
      termsAcceptedAt: new Date(),
    });

    await Promise.all([
      getResend().emails.send({
        from: FROM,
        to: data.email,
        subject: `Booking confirmed — ${data.tourName} · ${bookingRef}`,
        html: await render(BookingConfirmation({
          bookingRef,
          firstName: data.firstName,
          tourName: data.tourName,
          departureDate: data.departureDate,
          returnDate: data.returnDate,
          guide: data.guide,
          adults: data.adults,
          children: data.children,
          addOns: data.addOns,
          totalPrice: data.totalPrice,
        })),
      }),
      getResend().emails.send({
        from: FROM,
        to: ADMIN,
        replyTo: data.email,
        subject: `New booking ${bookingRef} — ${fullName} · ${data.tourName}`,
        html: await render(AdminBookingAlert({
          bookingRef,
          firstName: fullName,
          email: data.email,
          phone: data.phone,
          tourName: data.tourName,
          departureDate: data.departureDate,
          returnDate: data.returnDate,
          guide: data.guide,
          adults: data.adults,
          children: data.children,
          addOns: data.addOns,
          totalPrice: data.totalPrice,
          dietary: data.dietary,
          fitness: data.fitness,
          emergencyName: data.emergencyName,
          emergencyPhone: data.emergencyPhone,
        })),
      }),
    ]);

    return NextResponse.json({ ok: true, bookingRef });
  } catch (err) {
    console.error("[api/book]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
