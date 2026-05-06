import Link from 'next/link';
import { getReviews } from '@/lib/db/queries/reviews';
import { toggleReviewFeatured, toggleReviewPublished } from '@/lib/actions/content';
import { EmptyState } from '@/components/admin/empty-state';
import { Star, Plus } from 'lucide-react';

export default async function ReviewsPage() {
  const reviews = await getReviews();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Reviews</h1>
        <Link href="/admin/reviews/new" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: '#2e8a57' }}>
          <Plus className="h-4 w-4" /> Add review
        </Link>
      </div>

      {reviews.length === 0 ? (
        <EmptyState icon={Star} title="No reviews" description="Manually add reviews from offline channels." />
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="flex items-start gap-5 rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="font-semibold text-gray-900">{r.guestName}</p>
                  {r.guestCountry && <span className="text-xs text-gray-400">{r.guestCountry}</span>}
                  <span className="text-xs text-gray-300">·</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{String(r.date).split('T')[0]}</span>
                  <span className="text-xs text-gray-400">{r.source}</span>
                  {r.tour && <span className="text-xs font-medium text-emerald-600">{r.tour.title}</span>}
                </div>
                <p className="mt-1.5 text-sm text-gray-700 italic line-clamp-2">&ldquo;{r.quote}&rdquo;</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <form action={async () => { 'use server'; await toggleReviewFeatured(r.id, !r.featured); }}>
                  <button type="submit" className={`rounded-full px-2.5 py-1 text-xs font-medium ${r.featured ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                    {r.featured ? '★ Featured' : 'Not featured'}
                  </button>
                </form>
                <form action={async () => { 'use server'; await toggleReviewPublished(r.id, !r.published); }}>
                  <button type="submit" className={`rounded-full px-2.5 py-1 text-xs font-medium ${r.published ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {r.published ? 'Published' : 'Hidden'}
                  </button>
                </form>
                <Link href={`/admin/reviews/${r.id}/edit`} className="text-xs font-medium text-emerald-600 hover:underline">Edit →</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
