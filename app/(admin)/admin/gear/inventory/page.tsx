import Link from 'next/link';
import {
  getGearItemsWithStats,
  getGearUnitsWithRentals,
  getRentalsForCalendar,
  getLateRentals,
} from '@/lib/db/queries/inventory';
import { StatusBadge } from '@/components/admin/status-badge';
import { EmptyState } from '@/components/admin/empty-state';
import { UnitStatusSelect } from '@/components/admin/inventory/unit-status-select';
import { GearCalendarView } from '@/components/admin/inventory/calendar-view';
import { Backpack, AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  searchParams: Promise<{ view?: string; item?: string }>;
};

export default async function GearInventoryPage({ searchParams }: Props) {
  const params = await searchParams;
  const view = params.view ?? 'items';
  const filterItemId = params.item ? parseInt(params.item) : undefined;

  const [items, units, calendarRentals, lateRentals] = await Promise.all([
    getGearItemsWithStats(),
    view === 'units' ? getGearUnitsWithRentals(filterItemId) : Promise.resolve([]),
    view === 'calendar' ? getRentalsForCalendar(42) : Promise.resolve([]),
    getLateRentals(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Gear & Inventory</h1>
          <p className="mt-1 text-sm text-gray-500">{items.length} item types</p>
        </div>
      </div>

      {/* Late returns alert */}
      {lateRentals.length > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">{lateRentals.length} late return{lateRentals.length !== 1 ? 's' : ''}</p>
            <ul className="mt-1 space-y-0.5 text-xs text-red-700">
              {lateRentals.map((r) => (
                <li key={r.id}>
                  {r.unit_code} ({r.gear_item_name}) · {r.customer_name} · Due {r.expected_return_date}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* View toggle */}
      <div className="flex gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1 w-fit">
        {[
          { key: 'items', label: 'Items' },
          { key: 'units', label: 'Units' },
          { key: 'calendar', label: 'Calendar' },
        ].map(({ key, label }) => (
          <Link
            key={key}
            href={`/admin/gear/inventory?view=${key}`}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              view === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* VIEW: Items (card grid) */}
      {view === 'items' && (
        <>
          {items.length === 0 ? (
            <EmptyState icon={Backpack} title="No gear items" description="Add items to the catalog first." />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => {
                const pct = item.totalUnitsCount > 0 ? (item.rentedCount / item.totalUnitsCount) * 100 : 0;
                return (
                  <div key={item.id} className="rounded-xl border border-gray-200 bg-white p-5">
                    <div className="flex items-start gap-3">
                      {item.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.photoUrl} alt={item.name} className="h-14 w-14 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                          <Backpack className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                        <p className="text-xs text-gray-400">{item.category} · €{parseFloat(String(item.dayRateEur))}/day</p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                      <div>
                        <p className="text-lg font-bold text-emerald-700">{item.availableCount}</p>
                        <p className="text-xs text-gray-400">Available</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-blue-600">{item.rentedCount}</p>
                        <p className="text-xs text-gray-400">Rented</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-yellow-600">{item.maintenanceCount}</p>
                        <p className="text-xs text-gray-400">Maintenance</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="mb-1 flex justify-between text-xs text-gray-400">
                        <span>Utilisation</span>
                        <span>{Math.round(pct)}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(pct, 100)}%`,
                            backgroundColor: pct >= 90 ? '#ef4444' : pct >= 60 ? '#f59e0b' : '#2e8a57',
                          }}
                        />
                      </div>
                    </div>

                    <Link
                      href={`/admin/gear/inventory?view=units&item=${item.id}`}
                      className="mt-4 block text-center text-xs font-medium text-emerald-600 hover:underline"
                    >
                      View {item.totalUnitsCount} units →
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* VIEW: Units (table) */}
      {view === 'units' && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {units.length === 0 ? (
            <EmptyState icon={Backpack} title="No units" description="Units are auto-generated when you set total_units on an item." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Unit Code', 'Item', 'Size', 'Condition', 'Status', 'Current Rental', ''].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {units.map((unit) => (
                    <tr key={unit.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs font-bold text-gray-700">{unit.unitCode}</td>
                      <td className="px-4 py-3 text-gray-700">{unit.gearItem.name}</td>
                      <td className="px-4 py-3 text-gray-500">{unit.size ?? '—'}</td>
                      <td className="px-4 py-3"><StatusBadge status={unit.conditionStatus ?? 'GOOD'} /></td>
                      <td className="px-4 py-3">
                        <UnitStatusSelect unitId={unit.id} currentStatus={unit.status ?? 'AVAILABLE'} />
                      </td>
                      <td className="px-4 py-3">
                        {unit.activeRental ? (
                          <div>
                            <p className="text-xs font-mono text-gray-700">{unit.activeRental.bookingReference}</p>
                            <p className="text-xs text-gray-400">{unit.activeRental.customerName}</p>
                            <p className="text-xs text-gray-400">Due {unit.activeRental.rentalEndDate}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/gear/units/${unit.id}`} className="text-xs font-medium text-emerald-600 hover:underline">
                          Detail →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VIEW: Calendar */}
      {view === 'calendar' && (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">Rental Calendar — Next 6 Weeks</h2>
          <GearCalendarView rentals={calendarRentals} />
        </div>
      )}
    </div>
  );
}
