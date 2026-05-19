import { db } from '@/lib/db/client';
import { activityLog, adminUsers } from '@/lib/db/schema';
import { desc, eq, inArray, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = { searchParams: Promise<{ page?: string }> };

export default async function ActivityPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = page ? parseInt(page) : 1;
  const pageSize = 50;
  const offset = (currentPage - 1) * pageSize;

  let rows: typeof activityLog.$inferSelect[] = [];
  let total = 0;
  let adminMap: Record<number, string> = {};
  let error: string | null = null;

  try {
    const [logRows, countRows] = await Promise.all([
      db.select().from(activityLog).orderBy(desc(activityLog.createdAt)).limit(pageSize).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(activityLog),
    ]);

    rows = logRows;
    total = Number(countRows[0]?.count ?? 0);

    const adminIds = [...new Set(logRows.map((r) => r.adminUserId).filter((id): id is number => id !== null))];
    if (adminIds.length) {
      const admins = await db.select({ id: adminUsers.id, name: adminUsers.name }).from(adminUsers).where(inArray(adminUsers.id, adminIds));
      adminMap = Object.fromEntries(admins.map((a) => [a.id, a.name]));
    }
  } catch (e) {
    error = String(e);
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Activity Log</h1>
        <p className="text-sm text-gray-500">{total} entries</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to load activity log: {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3 text-left">Timestamp</th>
              <th className="px-4 py-3 text-left">Admin</th>
              <th className="px-4 py-3 text-left">Action</th>
              <th className="px-4 py-3 text-left">Entity Type</th>
              <th className="px-4 py-3 text-right">Entity ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">No activity recorded yet</td></tr>
            )}
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-500">
                  {new Date(row.createdAt).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'medium' })}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {row.adminUserId ? (adminMap[row.adminUserId] ?? `#${row.adminUserId}`) : '—'}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">{row.action}</span>
                </td>
                <td className="px-4 py-3 text-gray-600">{row.entityType}</td>
                <td className="px-4 py-3 text-right font-mono text-gray-500">{row.entityId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {currentPage > 1 && (
            <a href={`?page=${currentPage - 1}`} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">Previous</a>
          )}
          <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
          {currentPage < totalPages && (
            <a href={`?page=${currentPage + 1}`} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">Next</a>
          )}
        </div>
      )}
    </div>
  );
}
