import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { z } from "zod";
import { saveSubmission } from "@/lib/airtable";
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

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const FROM = process.env.RESEND_FROM ?? "Summit Balkans <info@summitbalkans.com>";
  const ADMIN = process.env.ADMIN_EMAIL ?? "info@summitbalkans.com";
  try {
    const body = await req.json();
    const result = bookingSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid data", issues: result.error.issues }, { status: 400 });
    }

    const data = result.data;
    const bookingRef = generateRef();
    const fullName = `${data.firstName} ${data.lastName}`;

    await Promise.all([
      resend.emails.send({
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
      resend.emails.send({
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
      saveSubmission("booking", {
        Name: fullName,
        Email: data.email,
        Phone: data.phone ?? "",
        Subject: data.tourName,
        Message: `Ref: ${bookingRef} | ${data.departureDate} | ${data.adults}A ${data.children}C | €${data.totalPrice}`,
        BookingRef: bookingRef,
      }),
    ]);

    return NextResponse.json({ ok: true, bookingRef });
  } catch (err) {
    console.error("[api/book]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
