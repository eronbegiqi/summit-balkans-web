import { getTours } from '@/lib/db/queries/tours';
import { saveReview } from '@/lib/actions/content';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function NewReviewPage() {
  const tours = await getTours();
  const inputCls = 'w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500';
  const labelCls = 'mb-1.5 block text-sm font-medium text-gray-700';

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/reviews" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"><ArrowLeft className="h-3.5 w-3.5" /> Reviews</Link>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Add Review</h1>
      </div>
      <form action={async (fd: FormData) => {
        'use server';
        await saveReview(null, {
          guestName: fd.get('guestName') as string,
          guestCountry: (fd.get('guestCountry') as string) || undefined,
          rating: parseInt(fd.get('rating') as string),
          quote: fd.get('quote') as string,
          fullReview: (fd.get('fullReview') as string) || undefined,
          date: new Date(fd.get('date') as string),
          source: (fd.get('source') as 'DIRECT' | 'GOOGLE' | 'TRIPADVISOR' | 'VIATOR' | 'OTHER') ?? 'DIRECT',
          tourId: fd.get('tourId') ? parseInt(fd.get('tourId') as string) : undefined,
          verified: fd.get('verified') === 'on',
          featured: false,
          published: true,
        });
        redirect('/admin/reviews');
      }} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Guest name</label><input name="guestName" required className={inputCls} /></div>
            <div><label className={labelCls}>Country</label><input name="guestCountry" className={inputCls} /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className={labelCls}>Rating</label><select name="rating" className={inputCls}>{[5,4,3,2,1].map((r) => <option key={r} value={r}>{'★'.repeat(r)}</option>)}</select></div>
            <div><label className={labelCls}>Date</label><input type="date" name="date" required className={inputCls} /></div>
            <div><label className={labelCls}>Source</label><select name="source" className={inputCls}>{['DIRECT','GOOGLE','TRIPADVISOR','VIATOR','OTHER'].map((s) => <option key={s}>{s}</option>)}</select></div>
          </div>
          <div><label className={labelCls}>Tour</label><select name="tourId" className={inputCls}><option value="">None</option>{tours.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}</select></div>
          <div><label className={labelCls}>Short quote *</label><textarea name="quote" rows={2} required className={`${inputCls} resize-none`} /></div>
          <div><label className={labelCls}>Full review</label><textarea name="fullReview" rows={4} className={`${inputCls} resize-none`} /></div>
          <label className="flex items-center gap-3"><input type="checkbox" name="verified" className="rounded" /><span className="text-sm text-gray-700">Verified booking</span></label>
        </div>
        <div><button type="submit" className="w-full rounded-lg py-3 text-sm font-semibold text-white" style={{ backgroundColor: '#2e8a57' }}>Add review</button></div>
      </form>
    </div>
  );
}
