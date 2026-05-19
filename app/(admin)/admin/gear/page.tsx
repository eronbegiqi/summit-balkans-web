import Link from 'next/link';
import { getGearItemsWithStats } from '@/lib/db/queries/inventory';
import { EmptyState } from '@/components/admin/empty-state';
import { Backpack, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function GearCatalogPage() {
  const items = await getGearItemsWithStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Gear Catalog</h1>
          <p className="mt-1 text-sm text-gray-500">{items.length} items</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/gear/inventory" className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
            Inventory view
          </Link>
          <Link href="/admin/gear/new" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: '#2e8a57' }}>
            <Plus className="h-4 w-4" /> New item
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={Backpack} title="No gear items" description="Add rental equipment to your catalog." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Item', 'Category', 'Day Rate', 'Total Units', 'Available', 'Rented', 'Status', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.photoUrl} alt={item.name} className="h-10 w-10 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                          <Backpack className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs font-mono text-gray-400">{item.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{item.category}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">€{parseFloat(String(item.dayRateEur))}/day</td>
                  <td className="px-4 py-3 text-gray-500">{item.totalUnitsCount}</td>
                  <td className="px-4 py-3 text-emerald-700 font-medium">{item.availableCount}</td>
                  <td className="px-4 py-3 text-blue-600">{item.rentedCount}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.published ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {item.published ? 'Live' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/gear/${item.id}/edit`} className="text-xs font-medium text-emerald-600 hover:underline">Edit →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
