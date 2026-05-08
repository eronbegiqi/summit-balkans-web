import Link from 'next/link';
import { getGuides } from '@/lib/db/queries/guides';
import { toggleGuidePublished } from '@/lib/actions/content';
import { EmptyState } from '@/components/admin/empty-state';
import { Users, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function GuidesPage() {
  const guides = await getGuides();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Guides</h1>
        <Link href="/admin/guides/new" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: '#2e8a57' }}>
          <Plus className="h-4 w-4" /> New guide
        </Link>
      </div>

      {guides.length === 0 ? (
        <EmptyState icon={Users} title="No guides" description="Add your team of mountain guides." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {guides.map((g) => (
            <div key={g.id} className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5">
              {g.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={g.photoUrl} alt={g.name} className="h-14 w-14 rounded-full object-cover shrink-0" />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400 font-bold text-lg">
                  {g.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900 truncate">{g.name}</p>
                  <form action={async () => { 'use server'; await toggleGuidePublished(g.id, !g.published); }}>
                    <button type="submit" className={`rounded-full px-2 py-0.5 text-xs font-medium ${g.published ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {g.published ? 'Live' : 'Draft'}
                    </button>
                  </form>
                </div>
                <p className="text-xs text-gray-400">{g.country} · {g.yearsExperience ?? 0}y exp</p>
                <Link href={`/admin/guides/${g.id}/edit`} className="mt-2 inline-block text-xs font-medium text-emerald-600 hover:underline">Edit →</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
