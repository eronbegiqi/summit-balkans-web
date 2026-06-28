import Link from 'next/link';
import { getDepartures } from '@/lib/db/queries/departures';
import { StatusBadge } from '@/components/admin/status-badge';
import { EmptyState } from '@/components/admin/empty-state';
import { toDateInputValue } from '@/lib/db/utils';
import { CalendarDays, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DeparturesPage() {
  const departures = await getDepartures();
  const upcoming = departures.filter((d) => d.status !== 'CANCELLED');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Departures</h1>
          <p className="mt-1 text-sm text-gray-500">{upcoming.length} active departures</p>
        </div>
        <Link href="/admin/departures/new" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: '#2e8a57' }}>
          <Plus className="h-4 w-4" /> New departure
        </Link>
      </div>

      {departures.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No departures" description="Schedule your first tour departure." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Tour', 'Dates', 'Capacity', 'Booked', 'Spots left', 'Guide', 'Status', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {departures.map((d) => {
                const spotsLeft = d.capacity - (d.bookedCount ?? 0);
                return (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-[180px] truncate">{d.tour.title}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {toDateInputValue(d.startDate)} → {toDateInputValue(d.endDate)}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{d.capacity}</td>
                    <td className="px-4 py-3 text-gray-500">{d.bookedCount ?? 0}</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${spotsLeft === 0 ? 'text-red-600' : spotsLeft <= 3 ? 'text-orange-500' : 'text-emerald-700'}`}>
                        {spotsLeft}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{d.guide?.name ?? '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={d.status ?? 'AVAILABLE'} /></td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/departures/${d.id}`} className="text-xs font-medium text-emerald-600 hover:underline">Edit →</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
