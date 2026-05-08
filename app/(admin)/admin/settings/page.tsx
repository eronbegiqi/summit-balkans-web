import { db } from '@/lib/db/client';
import { settings } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';

export default async function SettingsPage() {
  const rows = await db.select().from(settings).orderBy(asc(settings.settingKey));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Site-wide configuration values stored in the database</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {rows.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-gray-400">No settings configured yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Key', 'Value', 'Type', 'Description'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-700">{s.settingKey}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500 max-w-[300px] truncate">{s.settingValue ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{s.settingType}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{s.description ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
