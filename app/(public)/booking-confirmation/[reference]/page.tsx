export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db/client';
import { bookings, customers, tours, departures } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { Mountain, CheckCircle, Calendar, Users, Mail, Phone } from 'lucide-react';

type Props = { params: Promise<{ reference: string }> };

export default async function BookingConfirmationPage({ params }: Props) {
  const { reference } = await params;

  const [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.bookingReference, reference))
    .limit(1);

  if (!booking) notFound();

  const [customer] = await db.select().from(customers).where(eq(customers.id, booking.customerId)).limit(1);
  const [tour] = await db.select().from(tours).where(eq(tours.id, booking.tourId)).limit(1);

  let departure = null;
  if (booking.departureId) {
    const [dep] = await db.select().from(departures).where(eq(departures.id, booking.departureId)).limit(1);
    departure = dep ?? null;
  }

  const totalEur = parseFloat(booking.totalEur);
  const depositEur = booking.depositAmountEur ? parseFloat(booking.depositAmountEur) : totalEur * 0.2;
  const isDeposit = booking.paymentType === 'DEPOSIT';

  return (
    <div className="min-h-screen bg-[#F5F2EC]">
      {/* Header */}
      <header className="border-b-2 border-[#C9CFC8] bg-[#F5F2EC]">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2e8a57]">
              <Mountain className="h-4 w-4 text-white" strokeWidth={1.5} />
            </div>
            <span className="font-bold text-[#0E1310]" style={{ fontFamily: 'Georgia, serif' }}>
              Summit Balkans
            </span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        {/* Success badge */}
        <div className="mb-8 flex items-center gap-3">
          <CheckCircle className="h-8 w-8 text-[#2e8a57]" />
          <div>
            <h1 className="text-3xl font-bold text-[#0E1310]" style={{ fontFamily: 'Georgia, serif' }}>
              You&apos;re confirmed.
            </h1>
            <p className="text-[#0E1310]/60">
              A confirmation email has been sent to {customer?.email}
            </p>
          </div>
        </div>

        {/* Booking reference */}
        <div className="mb-6 rounded-2xl bg-[#0E1310] p-6">
          <p className="mb-1 font-mono text-xs uppercase tracking-widest text-amber-400">
            Booking Reference
          </p>
          <p className="font-mono text-3xl font-bold tracking-wider text-white">{reference}</p>
          <p className="mt-1 font-mono text-sm text-white/40">Keep this for your records</p>
        </div>

        {/* Details grid */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          {tour && (
            <div className="rounded-2xl border-2 border-[#C9CFC8] bg-white p-5">
              <div className="mb-3 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#2e8a57]">
                <Mountain className="h-3.5 w-3.5" /> Tour
              </div>
              <p className="font-bold text-[#0E1310]">{tour.title}</p>
              <p className="text-sm text-[#0E1310]/50">{tour.durationDays} days</p>
            </div>
          )}

          {departure && (
            <div className="rounded-2xl border-2 border-[#C9CFC8] bg-white p-5">
              <div className="mb-3 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#2e8a57]">
                <Calendar className="h-3.5 w-3.5" /> Dates
              </div>
              <p className="font-bold text-[#0E1310]">{String(departure.startDate).split('T')[0]}</p>
              <p className="text-sm text-[#0E1310]/50">to {String(departure.endDate).split('T')[0]}</p>
            </div>
          )}

          <div className="rounded-2xl border-2 border-[#C9CFC8] bg-white p-5">
            <div className="mb-3 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#2e8a57]">
              <Users className="h-3.5 w-3.5" /> Travellers
            </div>
            <p className="font-bold text-[#0E1310]">
              {booking.numAdults} adult{booking.numAdults !== 1 ? 's' : ''}
              {booking.numChildren ? ` + ${booking.numChildren} child${booking.numChildren !== 1 ? 'ren' : ''}` : ''}
            </p>
          </div>

          <div className="rounded-2xl border-2 border-[#C9CFC8] bg-white p-5">
            <div className="mb-3 text-xs font-mono uppercase tracking-wider text-[#2e8a57]">Payment</div>
            <p className="text-2xl font-bold text-[#0E1310]">
              €{isDeposit ? depositEur.toLocaleString() : totalEur.toLocaleString()}
            </p>
            <p className="text-sm text-[#0E1310]/50">
              {isDeposit ? `Deposit · €${totalEur.toLocaleString()} total` : 'Full payment'}
            </p>
          </div>
        </div>

        {/* What happens next */}
        <div className="mb-6 rounded-2xl border-2 border-[#C9CFC8] bg-white p-6">
          <h2 className="mb-4 text-base font-bold text-[#0E1310]">What happens next</h2>
          <ol className="space-y-3">
            {[
              "We'll send your full pre-trip information pack within 48 hours.",
              "Your guide will message you on WhatsApp to introduce themselves.",
              "Two weeks before departure you'll receive a final logistics briefing.",
              "Show up, walk, and let us handle the rest.",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#0E1310]/70">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3B4A2E] font-mono text-xs font-bold text-white">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Contact */}
        <div className="flex flex-wrap gap-3">
          <a
            href="mailto:info@summitbalkans.com"
            className="flex items-center gap-2 rounded-xl border-2 border-[#C9CFC8] bg-white px-5 py-3 text-sm font-medium text-[#0E1310] no-underline hover:border-[#2e8a57] transition-colors"
          >
            <Mail className="h-4 w-4 text-[#2e8a57]" /> info@summitbalkans.com
          </a>
          <a
            href="https://wa.me/38348300155"
            className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white no-underline"
            style={{ backgroundColor: '#25D366' }}
          >
            <Phone className="h-4 w-4" /> WhatsApp us
          </a>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl border-2 border-[#C9CFC8] bg-white px-5 py-3 text-sm font-medium text-[#0E1310] no-underline hover:border-[#2e8a57] transition-colors"
          >
            Back to homepage
          </Link>
        </div>
      </main>
    </div>
  );
}
