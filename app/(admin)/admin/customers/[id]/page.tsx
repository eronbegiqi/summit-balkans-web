import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCustomerById } from '@/lib/db/queries/customers';
import { StatusBadge } from '@/components/admin/status-badge';
import { ArrowLeft, Mail, Phone } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = { params: Promise<{ id: string }> };

export default async function CustomerDetailPage({ params }: Props) {
  const { id } = await params;
  const customer = await getCustomerById(parseInt(id));
  if (!customer) notFound();

  const totalSpent = parseFloat(customer.totalSpentEur ?? '0');

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/customers" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-3.5 w-3.5" /> Customers
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {customer.firstName} {customer.lastName}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          {/* Info card */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-gray-900">Customer Info</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Email</p>
                <a href={`mailto:${customer.email}`} className="flex items-center gap-1.5 text-emerald-700 hover:underline">
                  <Mail className="h-3.5 w-3.5" /> {customer.email}
                </a>
              </div>
              {customer.phone && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Phone</p>
                  <a href={`tel:${customer.phone}`} className="flex items-center gap-1.5 text-gray-700">
                    <Phone className="h-3.5 w-3.5" /> {customer.phone}
                  </a>
                </div>
              )}
              {customer.country && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Country</p>
                  <p className="text-gray-700">{customer.country}</p>
                </div>
              )}
              {customer.fitnessLevel && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Fitness Level</p>
                  <p className="text-gray-700">{customer.fitnessLevel}</p>
                </div>
              )}
              {customer.dietaryRequirements && (
                <div className="col-span-2">
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Dietary Requirements</p>
                  <p className="text-gray-700">{customer.dietaryRequirements}</p>
                </div>
              )}
              {customer.emergencyContactName && (
                <div className="col-span-2">
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Emergency Contact</p>
                  <p className="text-gray-700">{customer.emergencyContactName} {customer.emergencyContactPhone ? `· ${customer.emergencyContactPhone}` : ''}</p>
                </div>
              )}
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Joined</p>
                <p className="text-gray-700">{new Date(customer.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </div>

          {/* Bookings */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-gray-900">Bookings ({customer.bookings.length})</h2>
            {customer.bookings.length === 0 ? (
              <p className="text-sm text-gray-400">No bookings yet.</p>
            ) : (
              <div className="space-y-2">
                {customer.bookings.map((b) => (
                  <Link
                    key={b.id}
                    href={`/admin/bookings/${b.id}`}
                    className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-mono font-semibold text-gray-900">{b.bookingReference}</p>
                      <p className="text-xs text-gray-500">{b.tourTitle}</p>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      <StatusBadge status={b.status} />
                      <StatusBadge status={b.paymentStatus} />
                      <span className="font-semibold text-gray-900">€{parseFloat(b.totalEur).toLocaleString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          {customer.notes && (
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="mb-3 text-sm font-semibold text-gray-900">Notes</h2>
              <p className="whitespace-pre-wrap text-sm text-gray-700">{customer.notes}</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Total Bookings</p>
            <p className="text-3xl font-bold text-gray-900">{customer.totalBookings}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Total Spent</p>
            <p className="text-3xl font-bold text-gray-900">€{totalSpent.toLocaleString()}</p>
          </div>
          {customer.marketingConsent && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
              Marketing consent given
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
