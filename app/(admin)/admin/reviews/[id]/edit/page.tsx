import { notFound } from 'next/navigation';
import { getReviewById } from '@/lib/db/queries/reviews';
import { getTours } from '@/lib/db/queries/tours';
import { saveReview } from '@/lib/actions/content';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type Props = { params: Promise<{ id: string }> };

export default async function ReviewEditPage({ params }: Props) {
  const { id } = await params;
  const [review, tours] = await Promise.all([getReviewById(parseInt(id)), getTours()]);
  if (!review) notFound();

  const inputCls = 'w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500';
  const labelCls = 'mb-1.5 block text-sm font-medium text-gray-700';

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/reviews" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-3.5 w-3.5" /> Reviews
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit Review</h1>
      </div>

      <form action={async (fd: FormData) => {
        'use server';
        await saveReview(review.id, {
          guestName: fd.get('guestName') as string,
          guestCountry: (fd.get('guestCountry') as string) || undefined,
          rating: parseInt(fd.get('rating') as string),
          quote: fd.get('quote') as string,
          fullReview: (fd.get('fullReview') as string) || undefined,
          date: new Date(fd.get('date') as string),
          source: fd.get('source') as typeof review['source'],
          tourId: fd.get('tourId') ? parseInt(fd.get('tourId') as string) : undefined,
          verified: fd.get('verified') === 'on',
          featured: review.featured ?? false,
          published: review.published ?? true,
        });
      }} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Guest name</label><input name="guestName" defaultValue={review.guestName} required className={inputCls} /></div>
            <div><label className={labelCls}>Country</label><input name="guestCountry" defaultValue={review.guestCountry ?? ''} className={inputCls} placeholder="United Kingdom" /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Rating</label>
              <select name="rating" defaultValue={review.rating} className={inputCls}>
                {[5,4,3,2,1].map((r) => <option key={r} value={r}>{'★'.repeat(r)} ({r})</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Date</label>
              <input type="date" name="date" defaultValue={String(review.date).split('T')[0]} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Source</label>
              <select name="source" defaultValue={review.source ?? 'DIRECT'} className={inputCls}>
                {['DIRECT', 'GOOGLE', 'TRIPADVISOR', 'VIATOR', 'OTHER'].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Tour (optional)</label>
            <select name="tourId" defaultValue={review.tourId ?? ''} className={inputCls}>
              <option value="">No tour linked</option>
              {tours.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          </div>
          <div><label className={labelCls}>Short quote (shown publicly)</label><textarea name="quote" defaultValue={review.quote} rows={2} required className={`${inputCls} resize-none`} /></div>
          <div><label className={labelCls}>Full review (optional)</label><textarea name="fullReview" defaultValue={review.fullReview ?? ''} rows={4} className={`${inputCls} resize-none`} /></div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="verified" defaultChecked={review.verified ?? false} className="rounded" />
            <span className="text-sm text-gray-700">Verified booking</span>
          </label>
        </div>
        <div>
          <button type="submit" className="w-full rounded-lg py-3 text-sm font-semibold text-white" style={{ backgroundColor: '#2e8a57' }}>Save review</button>
        </div>
      </form>
    </div>
  );
}
