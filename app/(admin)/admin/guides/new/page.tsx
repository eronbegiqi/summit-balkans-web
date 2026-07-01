import { saveGuide } from '@/lib/actions/content';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function NewGuidePage() {
  const inputCls = 'w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500';
  const labelCls = 'mb-1.5 block text-sm font-medium text-gray-700';
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/guides" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500"><ArrowLeft className="h-3.5 w-3.5" /> Guides</Link>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">New Guide</h1>
      </div>
      <form action={async (fd: FormData) => {
        'use server';
        await saveGuide(null, {
          slug: fd.get('slug') as string,
          name: fd.get('name') as string,
          country: fd.get('country') as 'Albania' | 'Montenegro' | 'Kosovo',
          bio: (fd.get('bio') as string) || undefined,
          quote: (fd.get('quote') as string) || undefined,
          yearsExperience: parseInt(fd.get('yearsExperience') as string) || undefined,
          contactEmail: (fd.get('contactEmail') as string) || undefined,
          published: fd.get('published') === 'on',
          displayOrder: 0,
        });
        redirect('/admin/guides');
      }} className="max-w-2xl rounded-xl border border-gray-200 bg-white p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>Name *</label><input name="name" required className={inputCls} /></div>
          <div><label className={labelCls}>Slug *</label><input name="slug" required className={`${inputCls} font-mono`} /></div>
        </div>
        <div><label className={labelCls}>Country</label><select name="country" className={inputCls}>{['Albania','Montenegro','Kosovo'].map((c) => <option key={c}>{c}</option>)}</select></div>
        <div><label className={labelCls}>Bio</label><textarea name="bio" rows={4} className={`${inputCls} resize-none`} /></div>
        <div><label className={labelCls}>Quote</label><input name="quote" className={inputCls} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>Years experience</label><input type="number" name="yearsExperience" className={inputCls} /></div>
          <div><label className={labelCls}>Email</label><input name="contactEmail" className={inputCls} /></div>
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input type="checkbox" name="published" className="h-4 w-4 rounded border-gray-300" />
          Publish immediately
        </label>
        <button type="submit" className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white" style={{ backgroundColor: '#2e8a57' }}>Create guide</button>
      </form>
    </div>
  );
}
