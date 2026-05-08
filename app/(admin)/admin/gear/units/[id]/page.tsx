import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getGearUnitById } from '@/lib/db/queries/inventory';
import { StatusBadge } from '@/components/admin/status-badge';
import { UnitStatusSelect } from '@/components/admin/inventory/unit-status-select';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = { params: Promise<{ id: string }> };

export default async function GearUnitDetailPage({ params }: Props) {
  const { id } = await params;
  const unit = await getGearUnitById(parseInt(id));
  if (!unit) notFound();

  const { gearItem, rentals } = unit as typeof unit & {
    gearItem: { name: string; category: string };
    rentals: Array<{
      id: number;
      bookingId: number;
      rentalStartDate: string;
      rentalEndDate: string;
      totalEur: string;
      status: string;
      returnCondition: string | null;
      damageNotes: string | null;
    }>;
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/gear/inventory?view=units" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to inventory
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="font-mono text-2xl font-bold text-gray-900">{unit.unitCode}</h1>
          <StatusBadge status={unit.status ?? 'AVAILABLE'} />
          <StatusBadge status={unit.conditionStatus ?? 'GOOD'} />
        </div>
        <p className="mt-1 text-sm text-gray-500">{gearItem.name} · {gearItem.category}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          {/* Unit info */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-gray-900">Unit Information</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {[
                ['Unit Code', unit.unitCode],
                ['Size', unit.size ?? '—'],
                ['Purchased', unit.purchasedDate ? String(unit.purchasedDate) : '—'],
                ['Available From', unit.availableFrom ? String(unit.availableFrom) : 'Now'],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</dt>
                  <dd className="mt-0.5 text-gray-800">{String(value)}</dd>
                </div>
              ))}
            </dl>
            {unit.notes && (
              <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                <p className="text-xs font-medium text-gray-400 uppercase mb-1">Notes</p>
                {unit.notes}
              </div>
            )}
            {unit.damageNotes && (
              <div className="mt-3 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                <p className="text-xs font-medium text-red-500 uppercase mb-1">Damage Notes</p>
                {unit.damageNotes}
              </div>
            )}
          </div>

          {/* Rental history */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-gray-900">Rental History ({rentals?.length ?? 0})</h2>
            {!rentals?.length ? (
              <p className="text-sm text-gray-400">No rentals yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Booking', 'Start', 'End', 'Total', 'Status', 'Condition'].map((h) => (
                        <th key={h} className="pb-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {rentals.map((r) => (
                      <tr key={r.id}>
                        <td className="py-2 pr-4">
                          <Link href={`/admin/bookings/${r.bookingId}`} className="font-mono text-xs font-medium text-emerald-600 hover:underline">
                            #{r.bookingId}
                          </Link>
                        </td>
                        <td className="py-2 pr-4 text-gray-600">{r.rentalStartDate ? String(r.rentalStartDate).split('T')[0] : '—'}</td>
                        <td className="py-2 pr-4 text-gray-600">{r.rentalEndDate ? String(r.rentalEndDate).split('T')[0] : '—'}</td>
                        <td className="py-2 pr-4 font-medium text-gray-900">€{parseFloat(r.totalEur).toLocaleString()}</td>
                        <td className="py-2 pr-4"><StatusBadge status={r.status ?? 'RESERVED'} /></td>
                        <td className="py-2">{r.returnCondition ? <StatusBadge status={r.returnCondition} /> : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Change Status</h3>
            <UnitStatusSelect unitId={unit.id} currentStatus={unit.status ?? 'AVAILABLE'} />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="mb-2 text-sm font-semibold text-gray-900">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href={`/admin/gear/inventory?view=units&item=${unit.gearItemId}`}
                className="block w-full rounded-lg border border-gray-200 px-4 py-2 text-center text-sm text-gray-600 hover:bg-gray-50"
              >
                View all units of this item
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
