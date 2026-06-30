import Link from 'next/link';
import { getInquiries, getInquiryCountsByType } from '@/lib/db/queries/inquiries';
import { StatusBadge } from '@/components/admin/status-badge';
import { EmptyState } from '@/components/admin/empty-state';
import { DeleteInquiryButton } from '@/components/admin/inquiry/delete-inquiry-button';
import { Inbox } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const TYPES = ['', 'CONTACT', 'PRIVATE_TRIP', 'TRIP_ALERT', 'GEAR_RENTAL', 'PRESS'] as const;
const TYPE_LABELS: Record<string, string> = {
  '': 'All',
  CONTACT: 'Contact',
  PRIVATE_TRIP: 'Private Trip',
  TRIP_ALERT: 'Trip Alert',
  GEAR_RENTAL: 'Gear Rental',
  PRESS: 'Press',
};

type Props = {
  searchParams: Promise<{ type?: string; status?: string; page?: string }>;
};

export default async function InquiriesPage({ searchParams }: Props) {
  const params = await searchParams;
  const { type, status, page } = params;

  const [{ items, total, totalPages, page: currentPage }, counts] = await Promise.all([
    getInquiries({ type, status, page: page ? parseInt(page) : 1 }),
    getInquiryCountsByType(),
  ]);

  // Build new-count per type for tabs
  const newByType: Record<string, number> = {};
  counts.forEach((c) => {
    if (c.status === 'NEW') {
      newByType[c.type] = (newByType[c.type] ?? 0) + Number(c.count);
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Inquiries</h1>
        <p className="mt-1 text-sm text-gray-500">{total} total</p>
      </div>

      {/* Type tabs */}
      <div className="flex flex-wrap gap-1 border-b border-gray-200 pb-0">
        {TYPES.map((t) => {
          const active = (type ?? '') === t;
          const newCount = t === '' ? Object.values(newByType).reduce((a, b) => a + b, 0) : (newByType[t] ?? 0);
          return (
            <Link
              key={t}
              href={`/admin/inquiries${t ? `?type=${t}` : ''}`}
              className={`flex items-center gap-1.5 rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors -mb-px border-b-2 ${
                active
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {TYPE_LABELS[t]}
              {newCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-100 px-1.5 text-[11px] font-bold text-emerald-700">
                  {newCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {items.length === 0 ? (
          <EmptyState icon={Inbox} title="No inquiries" description="Inquiries will appear here once submitted." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Date', 'Name', 'Email', 'Type', 'Subject', 'Status', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((inq) => (
                  <tr key={inq.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(inq.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{inq.name}</td>
                    <td className="px-4 py-3 text-gray-500">{inq.email}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-gray-600">{TYPE_LABELS[inq.type] ?? inq.type}</span>
                    </td>
                    <td className="px-4 py-3 max-w-[200px] truncate text-gray-500">{inq.subject ?? inq.message?.slice(0, 50) ?? '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={inq.status ?? 'NEW'} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/admin/inquiries/${inq.id}`} className="text-xs font-medium text-emerald-600 hover:underline">
                          View →
                        </Link>
                        <DeleteInquiryButton inquiryId={inq.id} title={inq.subject ?? inq.name} redirectTo="/admin/inquiries" className="px-2 py-1 text-xs" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between text-sm text-gray-500">
          <span>Page {currentPage} of {totalPages}</span>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link href={`?${new URLSearchParams({ ...(type ? { type } : {}), page: String(currentPage - 1) })}`} className="rounded-lg border border-gray-200 px-3 py-1.5 hover:bg-gray-50">← Prev</Link>
            )}
            {currentPage < totalPages && (
              <Link href={`?${new URLSearchParams({ ...(type ? { type } : {}), page: String(currentPage + 1) })}`} className="rounded-lg border border-gray-200 px-3 py-1.5 hover:bg-gray-50">Next →</Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
