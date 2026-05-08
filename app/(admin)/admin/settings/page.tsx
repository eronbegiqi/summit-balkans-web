import { db } from '@/lib/db/client';
import { settings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SettingsPage() {
  let rows: typeof settings.$inferSelect[] = [];
  let error: string | null = null;

  try {
    rows = await db.select().from(settings).orderBy(settings.settingKey);
  } catch (e) {
    error = String(e);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Site-wide configuration values</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to load settings: {error}
        </div>
      )}

      <div className="space-y-3">
        {rows.length === 0 && !error && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-400">
            No settings found. Add rows to the <code className="font-mono">settings</code> table to configure site values.
          </div>
        )}
        {rows.map((row) => (
          <div key={row.id} className="rounded-xl border border-gray-200 bg-white p-5">
            <form action={async (fd: FormData) => {
              'use server';
              await db.update(settings)
                .set({ settingValue: fd.get('value') as string })
                .where(eq(settings.id, row.id));
              revalidatePath('/admin/settings');
            }}>
              <div className="flex items-start gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-sm font-mono font-semibold text-gray-900">{row.settingKey}</code>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{row.settingType}</span>
                  </div>
                  {row.description && <p className="text-xs text-gray-400 mb-2">{row.description}</p>}
                  {row.settingType === 'BOOLEAN' ? (
                    <select name="value" defaultValue={row.settingValue ?? 'false'}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500">
                      <option value="true">true</option>
                      <option value="false">false</option>
                    </select>
                  ) : (
                    <input
                      name="value"
                      defaultValue={row.settingValue ?? ''}
                      className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  )}
                </div>
                <button type="submit" className="shrink-0 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                  Save
                </button>
              </div>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
