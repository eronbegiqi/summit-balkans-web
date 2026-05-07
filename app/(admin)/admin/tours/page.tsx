import Link from 'next/link';
import { getTours } from '@/lib/db/queries/tours';
import { toggleTourPublished, deleteTour } from '@/lib/actions/tours';
import { EmptyState } from '@/components/admin/empty-state';
import { Mountain, Plus, Star } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DIFFICULTY_LABELS = ['', 'Easy', 'Moderate', 'Challenging', 'Hard', 'Expert'];
const DIFFICULTY_COLORS = ['', 'text-green-600', 'text-yellow-600', 'text-orange-500', 'text-red-500', 'text-red-700'];

export default async function ToursPage() {
  const tours = await getTours();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tours</h1>
          <p className="mt-1 text-sm text-gray-500">{tours.length} tours</p>
        </div>
        <Link
          href="/admin/tours/new"
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: '#2e8a57' }}
        >
          <Plus className="h-4 w-4" /> New tour
        </Link>
      </div>

      {tours.length === 0 ? (
        <EmptyState
          icon={Mountain}
          title="No tours yet"
          description="Create your first tour to get started."
          action={<Link href="/admin/tours/new" className="rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: '#2e8a57' }}>New tour</Link>}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Tour', 'Country', 'Duration', 'Difficulty', 'Price', 'Departures', 'Status', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tours.map((tour) => (
                <tr key={tour.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {tour.isFlagship && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                      <span className="font-medium text-gray-900">{tour.title}</span>
                    </div>
                    <p className="text-xs text-gray-400 font-mono">{tour.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{tour.country ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{tour.durationDays}d</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${DIFFICULTY_COLORS[tour.difficulty] ?? ''}`}>
                      {DIFFICULTY_LABELS[tour.difficulty] ?? tour.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    €{parseFloat(tour.pricePerPersonEur).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{tour.departureCount}</td>
                  <td className="px-4 py-3">
                    <form action={async () => {
                      'use server';
                      await toggleTourPublished(tour.id, !tour.published);
                    }}>
                      <button type="submit" className={`rounded-full px-2.5 py-1 text-xs font-medium ${tour.published ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {tour.published ? 'Live' : 'Draft'}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/tours/${tour.id}/edit`} className="text-xs font-medium text-emerald-600 hover:underline">
                      Edit →
                    </Link>
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
