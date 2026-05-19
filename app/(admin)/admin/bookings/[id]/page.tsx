import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBookingById } from '@/lib/db/queries/bookings';
import { parseJsonField } from '@/lib/db/utils';
import { StatusBadge } from '@/components/admin/status-badge';
import { BookingStatusControls } from '@/components/admin/booking/status-controls';
import { NotesEditor } from '@/components/admin/booking/notes-editor';
import { ArrowLeft, Mail, Phone, User } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = { params: Promise<{ id: string }> };

export default async function BookingDetailPage({ params }: Props) {
  const { id } = await params;
  const booking = await getBookingById(parseInt(id));
  if (!booking) notFound();

  const { customer, tour, departure, gearRentals, paymentTransactions } = booking;
  const totalEur = parseFloat(booking.totalEur);
  const paidAmountEur = parseFloat(booking.paidAmountEur ?? '0');
  const depositAmountEur = booking.depositAmountEur ? parseFloat(booking.depositAmountEur) : null;

  const travelers = parseJsonField<Array<{
    firstName: string; lastName: string; email?: string; phone?: string; dietary?: string; fitnessLevel?: string;
  }>>(booking.travelersData, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/admin/bookings" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to bookings
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-mono text-2xl font-bold text-gray-900">{booking.bookingReference}</h1>
              <StatusBadge status={booking.status ?? 'NEW'} />
              <StatusBadge status={booking.paymentStatus ?? 'PENDING'} />
            </div>
            <p className="mt-1 text-sm text-gray-400">
              Created {new Date(booking.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Customer */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <User className="h-4 w-4 text-gray-400" /> Customer
            </h2>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-900">{customer.firstName} {customer.lastName}</p>
                <p className="text-sm text-gray-500">{customer.email}</p>
                {customer.phone && <p className="text-sm text-gray-500">{customer.phone}</p>}
                {customer.country && <p className="text-sm text-gray-400">{customer.country}</p>}
              </div>
              <Link href={`mailto:${customer.email}`} className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
                <Mail className="h-3.5 w-3.5" /> Email
              </Link>
            </div>
            {customer.emergencyContactName && (
              <div className="mt-3 rounded-lg bg-gray-50 px-4 py-3 text-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-1">Emergency Contact</p>
                <p className="text-gray-700">{customer.emergencyContactName}</p>
                {customer.emergencyContactPhone && <p className="text-gray-500">{customer.emergencyContactPhone}</p>}
              </div>
            )}
          </div>

          {/* Tour & Departure */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-gray-900">Tour & Departure</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Tour</p>
                <p className="font-semibold text-gray-900">{tour.title}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Duration</p>
                <p className="text-gray-700">{tour.durationDays} days</p>
              </div>
              {departure && (
                <>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Departure</p>
                    <p className="text-gray-700">{String(departure.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Return</p>
                    <p className="text-gray-700">{String(departure.endDate)}</p>
                  </div>
                </>
              )}
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Group Size</p>
                <p className="text-gray-700">
                  {booking.numAdults} adult{booking.numAdults !== 1 ? 's' : ''}
                  {booking.numChildren ? ` + ${booking.numChildren} child${booking.numChildren !== 1 ? 'ren' : ''}` : ''}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Source</p>
                <p className="text-gray-700">{booking.bookingSource}</p>
              </div>
            </div>
          </div>

          {/* Travelers */}
          {travelers.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="mb-4 text-sm font-semibold text-gray-900">Travelers ({travelers.length})</h2>
              <div className="space-y-3">
                {travelers.map((t, i) => (
                  <div key={i} className="rounded-lg bg-gray-50 px-4 py-3 text-sm">
                    <p className="font-medium text-gray-900">{t.firstName} {t.lastName}</p>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500">
                      {t.email && <span>{t.email}</span>}
                      {t.phone && <span>{t.phone}</span>}
                      {t.dietary && <span>Dietary: {t.dietary}</span>}
                      {t.fitnessLevel && <span>Fitness: {t.fitnessLevel}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gear Rentals */}
          {gearRentals.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="mb-4 text-sm font-semibold text-gray-900">Gear Rentals</h2>
              <div className="space-y-2">
                {gearRentals.map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{r.gearUnit.gearItem.name}</p>
                      <p className="text-xs text-gray-400">Unit: {r.gearUnit.unitCode} · {r.totalDays} days</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">€{parseFloat(r.totalEur).toLocaleString()}</p>
                      <StatusBadge status={r.status ?? 'RESERVED'} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment history */}
          {paymentTransactions.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="mb-4 text-sm font-semibold text-gray-900">Payment History</h2>
              <div className="space-y-2">
                {paymentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between py-2 text-sm border-b border-gray-50 last:border-0">
                    <div>
                      <p className="font-medium text-gray-700">{tx.transactionType?.replace('_', ' ')} · {tx.paymentMethod}</p>
                      <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleDateString('en-GB')}</p>
                      {tx.externalReference && <p className="text-xs font-mono text-gray-400">{tx.externalReference}</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">€{parseFloat(tx.amountEur).toLocaleString()}</p>
                      <StatusBadge status={tx.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Internal Notes */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-gray-900">Internal Notes</h2>
            <NotesEditor bookingId={booking.id} initialNotes={booking.internalNotes} />
          </div>
        </div>

        {/* Right: actions */}
        <div>
          <BookingStatusControls
            bookingId={booking.id}
            currentStatus={booking.status as 'NEW' | 'CONFIRMED' | 'PRE_TRIP' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'}
            currentPaymentStatus={booking.paymentStatus ?? 'PENDING'}
            totalEur={totalEur}
            paidAmountEur={paidAmountEur}
            depositAmountEur={depositAmountEur}
          />
        </div>
      </div>
    </div>
  );
}
