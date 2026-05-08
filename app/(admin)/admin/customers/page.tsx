import { db } from '@/lib/db/client';
import { customers } from '@/lib/db/schema';
import { desc, sql } from 'drizzle-orm';
import { EmptyState } from '@/components/admin/empty-state';
import { Users } from 'lucide-react';

export default async function CustomersPage() {
  const items = await db.select().from(customers).orderBy(desc(customers.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Customers</h1>
        <p className="mt-1 text-sm text-gray-500">{items.length} total customers</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {items.length === 0 ? (
          <EmptyState icon={Users} title="No customers yet" description="Customers appear here after their first booking." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Name', 'Email', 'Country', 'Bookings', 'Total Spent', 'Joined'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{c.firstName} {c.lastName}</td>
                    <td className="px-4 py-3 text-gray-500">{c.email}</td>
                    <td className="px-4 py-3 text-gray-500">{c.country ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-700">{c.totalBookings ?? 0}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">€{parseFloat(c.totalSpentEur ?? '0').toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
