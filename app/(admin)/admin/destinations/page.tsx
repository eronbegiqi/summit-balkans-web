import Link from 'next/link';
import { getDestinations } from '@/lib/db/queries/destinations';
import { toggleDestinationPublished } from '@/lib/actions/content';
import { EmptyState } from '@/components/admin/empty-state';
import { Globe, Plus } from 'lucide-react';

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Destinations</h1>
        <Link href="/admin/destinations/new" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: '#2e8a57' }}>
          <Plus className="h-4 w-4" /> New destination
        </Link>
      </div>

      {destinations.length === 0 ? (
        <EmptyState icon={Globe} title="No destinations" description="Add destinations to show on the public site." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Name', 'Country', 'Slug', 'Status', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {destinations.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{d.name}</td>
                  <td className="px-4 py-3 text-gray-500">{d.country}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{d.slug}</td>
                  <td className="px-4 py-3">
                    <form action={async () => { 'use server'; await toggleDestinationPublished(d.id, !d.published); }}>
                      <button type="submit" className={`rounded-full px-2.5 py-1 text-xs font-medium ${d.published ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {d.published ? 'Live' : 'Draft'}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/destinations/${d.id}/edit`} className="text-xs font-medium text-emerald-600 hover:underline">Edit →</Link>
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
