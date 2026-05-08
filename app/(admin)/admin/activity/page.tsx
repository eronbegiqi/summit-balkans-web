import { db } from '@/lib/db/client';
import { activityLog, adminUsers } from '@/lib/db/schema';
import { desc, eq, inArray } from 'drizzle-orm';
import { EmptyState } from '@/components/admin/empty-state';
import { Activity } from 'lucide-react';

export default async function ActivityLogPage() {
  const entries = await db.select().from(activityLog).orderBy(desc(activityLog.createdAt)).limit(200);

  const adminIds = [...new Set(entries.map((e) => e.adminUserId).filter((id): id is number => id !== null))];
  const admins = adminIds.length
    ? await db.select({ id: adminUsers.id, name: adminUsers.name }).from(adminUsers).where(inArray(adminUsers.id, adminIds))
    : [];
  const adminMap = new Map(admins.map((a) => [a.id, a.name]));

  const actionColor: Record<string, string> = {
    CREATE: 'bg-emerald-50 text-emerald-700',
    UPDATE: 'bg-blue-50 text-blue-700',
    DELETE: 'bg-red-50 text-red-700',
    LOGIN: 'bg-purple-50 text-purple-700',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Activity Log</h1>
        <p className="mt-1 text-sm text-gray-500">Last 200 admin actions</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {entries.length === 0 ? (
          <EmptyState icon={Activity} title="No activity yet" description="Admin actions will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Time', 'Admin', 'Action', 'Entity', 'ID'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {entries.map((e) => {
                  const color = actionColor[e.action] ?? 'bg-gray-100 text-gray-600';
                  return (
                    <tr key={e.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                        {new Date(e.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{e.adminUserId ? (adminMap.get(e.adminUserId) ?? `#${e.adminUserId}`) : '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${color}`}>{e.action}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{e.entityType}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">{e.entityId}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
