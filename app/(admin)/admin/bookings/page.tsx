import Link from 'next/link';
import { getBookings } from '@/lib/db/queries/bookings';
import { StatusBadge } from '@/components/admin/status-badge';
import { EmptyState } from '@/components/admin/empty-state';
import { Calendar } from 'lucide-react';

const BOOKING_STATUSES = ['NEW', 'CONFIRMED', 'PRE_TRIP', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
const PAYMENT_STATUSES = ['PENDING', 'DEPOSIT_PAID', 'PAID', 'REFUNDED', 'FAILED'];

type Props = {
  searchParams: Promise<{ status?: string; payment?: string; q?: string; page?: string }>;
};

export default async function BookingsPage({ searchParams }: Props) {
  const params = await searchParams;
  const { status, payment, q: search, page } = params;

  const { items, total, totalPages, page: currentPage } = await getBookings({
    status,
    paymentStatus: payment,
    search,
    page: page ? parseInt(page) : 1,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Bookings</h1>
          <p className="mt-1 text-sm text-gray-500">{total} total bookings</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <form method="get" className="flex flex-wrap gap-3 w-full">
          <input
            name="q"
            defaultValue={search}
            placeholder="Search reference, email, name…"
            className="rounded-lg border border-gray-200 px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 w-64"
          />
          <select
            name="status"
            defaultValue={status ?? ''}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All statuses</option>
            {BOOKING_STATUSES.map((s) => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
          <select
            name="payment"
            defaultValue={payment ?? ''}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All payments</option>
            {PAYMENT_STATUSES.map((s) => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: '#2e8a57' }}
          >
            Filter
          </button>
          {(status || payment || search) && (
            <Link href="/admin/bookings" className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
              Clear
            </Link>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {items.length === 0 ? (
          <EmptyState icon={Calendar} title="No bookings found" description="Try adjusting your filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Reference', 'Customer', 'Tour', 'Departure', 'Total', 'Payment', 'Status', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-bold text-emerald-700">{b.bookingReference}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{b.customerName}</div>
                      <div className="text-xs text-gray-400">{b.customerEmail}</div>
                    </td>
                    <td className="px-4 py-3 max-w-[200px] truncate text-gray-600">{b.tourTitle}</td>
                    <td className="px-4 py-3 text-gray-500">{b.departureDate ?? '—'}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      €{parseFloat(String(b.totalEur)).toLocaleString()}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={b.paymentStatus} /></td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="text-xs font-medium text-emerald-600 hover:underline"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Page {currentPage} of {totalPages}</span>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link
                href={`?${new URLSearchParams({ ...(status ? { status } : {}), ...(payment ? { payment } : {}), ...(search ? { q: search } : {}), page: String(currentPage - 1) })}`}
                className="rounded-lg border border-gray-200 px-3 py-1.5 hover:bg-gray-50"
              >
                ← Prev
              </Link>
            )}
            {currentPage < totalPages && (
              <Link
                href={`?${new URLSearchParams({ ...(status ? { status } : {}), ...(payment ? { payment } : {}), ...(search ? { q: search } : {}), page: String(currentPage + 1) })}`}
                className="rounded-lg border border-gray-200 px-3 py-1.5 hover:bg-gray-50"
              >
                Next →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
