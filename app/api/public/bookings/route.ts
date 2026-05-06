import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { bookings, customers, departures, tours } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { BookingConfirmation } from '@/emails/BookingConfirmation';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = `Summit Balkans <${process.env.RESEND_FROM_EMAIL ?? 'info@summitbalkans.com'}>`;

const bookingSchema = z.object({
  tourSlug: z.string(),
  departureId: z.number(),
  paymentType: z.enum(['DEPOSIT', 'FULL']).default('DEPOSIT'),
  numAdults: z.number().min(1),
  numChildren: z.number().min(0).default(0),
  travelers: z.array(z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    dietary: z.string().optional(),
    fitnessLevel: z.string().optional(),
  })).min(1),
  termsAccepted: z.boolean().refine((v) => v, { message: 'Terms must be accepted' }),
});

function generateRef(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'SB-';
  for (let i = 0; i < 8; i++) ref += chars[Math.floor(Math.random() * chars.length)];
  return ref;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data', issues: parsed.error.issues }, { status: 400 });
    }

    const data = parsed.data;
    const lead = data.travelers[0];

    // Get tour and departure
    const [tour] = await db.select().from(tours).where(eq(tours.slug, data.tourSlug)).limit(1);
    if (!tour) return NextResponse.json({ error: 'Tour not found' }, { status: 404 });

    const [departure] = await db.select().from(departures).where(eq(departures.id, data.departureId)).limit(1);
    if (!departure) return NextResponse.json({ error: 'Departure not found' }, { status: 404 });
    if ((departure.capacity - (departure.bookedCount ?? 0)) < data.numAdults + data.numChildren) {
      return NextResponse.json({ error: 'Not enough spots available' }, { status: 409 });
    }

    // Upsert customer
    let [customer] = await db.select().from(customers).where(eq(customers.email, lead.email ?? '')).limit(1);
    if (!customer) {
      const [ins] = await db.insert(customers).values({
        email: lead.email ?? `${Date.now()}@unknown.com`,
        firstName: lead.firstName,
        lastName: lead.lastName,
        phone: lead.phone,
      });
      [customer] = await db.select().from(customers).where(eq(customers.email, lead.email ?? '')).limit(1);
    }

    // Calc price
    const pricePerPerson = parseFloat(String(departure.pricePerPersonEur ?? tour.pricePerPersonEur));
    const basePrice = pricePerPerson * data.numAdults;
    const total = basePrice;
    const depositAmount = Math.ceil(total * 0.2);
    const amountDue = data.paymentType === 'DEPOSIT' ? depositAmount : total;

    const ref = generateRef();

    await db.insert(bookings).values({
      bookingReference: ref,
      customerId: customer.id,
      tourId: tour.id,
      departureId: departure.id,
      numAdults: data.numAdults,
      numChildren: data.numChildren,
      travelersData: data.travelers,
      basePriceEur: String(basePrice),
      totalEur: String(total),
      paymentType: data.paymentType,
      depositAmountEur: String(depositAmount),
      paidAmountEur: '0',
      paymentStatus: 'PENDING',
      bookingSource: 'DIRECT',
      status: 'NEW',
      termsAcceptedAt: new Date(),
    });

    // Update booked count
    await db.update(departures)
      .set({ bookedCount: (departure.bookedCount ?? 0) + data.numAdults + data.numChildren })
      .where(eq(departures.id, departure.id));

    // Send confirmation email (non-blocking)
    if (lead.email) {
      Promise.all([
        resend.emails.send({
          from: FROM,
          to: [lead.email],
          subject: `Booking confirmed — ${tour.title} · ${ref}`,
          html: await render(BookingConfirmation({
            bookingRef: ref,
            firstName: lead.firstName,
            tourName: tour.title,
            departureDate: String(departure.startDate),
            returnDate: String(departure.endDate),
            guide: 'TBC',
            adults: data.numAdults,
            children: data.numChildren,
            addOns: [],
            totalPrice: total,
          })),
        }),
        resend.emails.send({
          from: FROM,
          to: ['info@summitbalkans.com'],
          subject: `New booking: ${ref} — ${lead.firstName} ${lead.lastName}`,
          text: `New booking ${ref}\nTour: ${tour.title}\nDeparture: ${String(departure.startDate)}\nCustomer: ${lead.firstName} ${lead.lastName} (${lead.email})\nTotal: €${total}`,
        }),
      ]).catch((e) => console.error('[api/public/bookings] email error:', e));
    }

    return NextResponse.json({
      ok: true,
      bookingReference: ref,
      redirectUrl: `/booking-confirmation/${ref}`,
      amountDue,
      paymentType: data.paymentType,
    });
  } catch (err) {
    console.error('[api/public/bookings]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
