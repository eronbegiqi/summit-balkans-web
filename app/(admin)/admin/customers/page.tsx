import Link from 'next/link';
import { getCustomers } from '@/lib/db/queries/customers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = { searchParams: Promise<{ search?: string; page?: string }> };

export default async function CustomersPage({ searchParams }: Props) {
  const { search, page } = await searchParams;
  const { items, total, totalPages, page: currentPage } = await getCustomers({
    search,
    page: page ? parseInt(page) : 1,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500">{total} total</p>
        </div>
      </div>

      {/* Search */}
      <form method="get" className="flex gap-3">
        <input
          name="search"
          defaultValue={search}
          placeholder="Search by name or email…"
          className="w-72 rounded-lg border border-gray-200 px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">Search</button>
        {search && <Link href="/admin/customers" className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Clear</Link>}
      </form>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Country</th>
              <th className="px-4 py-3 text-right">Bookings</th>
              <th className="px-4 py-3 text-right">Total Spent</th>
              <th className="px-4 py-3 text-left">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">No customers found</td></tr>
            )}
            {items.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/admin/customers/${c.id}`} className="font-medium text-gray-900 hover:text-emerald-700">
                    {c.firstName} {c.lastName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-600">{c.email}</td>
                <td className="px-4 py-3 text-gray-500">{c.phone ?? '—'}</td>
                <td className="px-4 py-3 text-gray-500">{c.country ?? '—'}</td>
                <td className="px-4 py-3 text-right tabular-nums text-gray-700">{c.totalBookings}</td>
                <td className="px-4 py-3 text-right tabular-nums font-semibold text-gray-900">€{parseFloat(c.totalSpentEur).toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-400">{new Date(c.createdAt).toLocaleDateString('en-GB')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {currentPage > 1 && (
            <Link href={`?${new URLSearchParams({ ...(search ? { search } : {}), page: String(currentPage - 1) })}`}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">Previous</Link>
          )}
          <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
          {currentPage < totalPages && (
            <Link href={`?${new URLSearchParams({ ...(search ? { search } : {}), page: String(currentPage + 1) })}`}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">Next</Link>
          )}
        </div>
      )}
    </div>
  );
}
