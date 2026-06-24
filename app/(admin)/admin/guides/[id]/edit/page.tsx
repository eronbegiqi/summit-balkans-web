import { notFound } from 'next/navigation';
import { getGuideById } from '@/lib/db/queries/guides';
import { saveGuide, toggleGuidePublished } from '@/lib/actions/content';
import { parseJsonField } from '@/lib/db/utils';
import { PublishToggle } from '@/components/admin/publish-toggle';
import { GuideDeleteButton } from '@/components/admin/guides/guide-delete-button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = { params: Promise<{ id: string }> };

export default async function GuideEditPage({ params }: Props) {
  const { id } = await params;
  const guide = await getGuideById(parseInt(id));
  if (!guide) notFound();

  const inputCls = 'w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500';
  const labelCls = 'mb-1.5 block text-sm font-medium text-gray-700';

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/guides" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-3.5 w-3.5" /> Guides
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit: {guide.name}</h1>
      </div>

      <form action={async (formData: FormData) => {
        'use server';
        const languages = (formData.get('languages') as string).split(',').map(s => s.trim()).filter(Boolean);
        const specialties = (formData.get('specialties') as string).split(',').map(s => s.trim()).filter(Boolean);
        await saveGuide(guide.id, {
          slug: formData.get('slug') as string,
          name: formData.get('name') as string,
          country: formData.get('country') as 'Albania' | 'Montenegro' | 'Kosovo',
          bio: (formData.get('bio') as string) || undefined,
          quote: (formData.get('quote') as string) || undefined,
          yearsExperience: parseInt(formData.get('yearsExperience') as string) || undefined,
          contactEmail: (formData.get('contactEmail') as string) || undefined,
          contactPhone: (formData.get('contactPhone') as string) || undefined,
          languages: languages.length ? languages : undefined,
          specialties: specialties.length ? specialties : undefined,
          published: guide.published,
          displayOrder: guide.displayOrder,
        });
      }} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Name</label><input name="name" defaultValue={guide.name} required className={inputCls} /></div>
            <div><label className={labelCls}>Slug</label><input name="slug" defaultValue={guide.slug} required className={`${inputCls} font-mono`} /></div>
          </div>
          <div>
            <label className={labelCls}>Country</label>
            <select name="country" defaultValue={guide.country} className={inputCls}>
              {['Albania', 'Montenegro', 'Kosovo'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div><label className={labelCls}>Bio</label><textarea name="bio" defaultValue={guide.bio ?? ''} rows={5} className={`${inputCls} resize-none`} /></div>
          <div><label className={labelCls}>Quote</label><input name="quote" defaultValue={guide.quote ?? ''} className={inputCls} /></div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className={labelCls}>Years experience</label><input type="number" name="yearsExperience" defaultValue={guide.yearsExperience ?? ''} className={inputCls} /></div>
            <div><label className={labelCls}>Email</label><input name="contactEmail" defaultValue={guide.contactEmail ?? ''} className={inputCls} /></div>
            <div><label className={labelCls}>Phone</label><input name="contactPhone" defaultValue={guide.contactPhone ?? ''} className={inputCls} /></div>
          </div>
          <div><label className={labelCls}>Languages (comma-separated)</label><input name="languages" defaultValue={parseJsonField<string[]>(guide.languages, []).join(', ')} className={inputCls} placeholder="English, Albanian, Shqip" /></div>
          <div><label className={labelCls}>Specialties (comma-separated)</label><input name="specialties" defaultValue={parseJsonField<string[]>(guide.specialties, []).join(', ')} className={inputCls} placeholder="Alpine trekking, Photography" /></div>
        </div>

        <div className="space-y-4">
          <PublishToggle
            published={guide.published ?? false}
            onToggle={async (p) => { 'use server'; await toggleGuidePublished(guide.id, p); }}
          />
          <button type="submit" className="w-full rounded-lg py-3 text-sm font-semibold text-white" style={{ backgroundColor: '#2e8a57' }}>Save guide</button>
          <GuideDeleteButton id={guide.id} />
        </div>
      </form>
    </div>
  );
}
