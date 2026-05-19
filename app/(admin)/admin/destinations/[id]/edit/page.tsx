import { notFound } from 'next/navigation';
import { getDestinationById } from '@/lib/db/queries/destinations';
import { saveDestination, toggleDestinationPublished } from '@/lib/actions/content';
import { ImageUploader } from '@/components/admin/image-uploader';
import { PublishToggle } from '@/components/admin/publish-toggle';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = { params: Promise<{ id: string }> };

export default async function DestinationEditPage({ params }: Props) {
  const { id } = await params;
  const destination = await getDestinationById(parseInt(id));
  if (!destination) notFound();

  const inputCls = 'w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500';
  const labelCls = 'mb-1.5 block text-sm font-medium text-gray-700';

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/destinations" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-3.5 w-3.5" /> Destinations
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit: {destination.name}</h1>
      </div>

      <form action={async (formData: FormData) => {
        'use server';
        await saveDestination(destination.id, {
          slug: formData.get('slug') as string,
          name: formData.get('name') as string,
          country: formData.get('country') as 'Albania' | 'Montenegro' | 'Kosovo',
          description: (formData.get('description') as string) || undefined,
          geography: (formData.get('geography') as string) || undefined,
          bestSeason: (formData.get('bestSeason') as string) || undefined,
          visaRequirements: (formData.get('visaRequirements') as string) || undefined,
          currency: (formData.get('currency') as string) || undefined,
          language: (formData.get('language') as string) || undefined,
          weatherInfo: (formData.get('weatherInfo') as string) || undefined,
          safetyInfo: (formData.get('safetyInfo') as string) || undefined,
          seoTitle: (formData.get('seoTitle') as string) || undefined,
          seoDescription: (formData.get('seoDescription') as string) || undefined,
          published: destination.published,
          displayOrder: destination.displayOrder,
        });
      }} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Name</label>
                <input name="name" defaultValue={destination.name} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Slug</label>
                <input name="slug" defaultValue={destination.slug} required className={`${inputCls} font-mono`} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Country</label>
              <select name="country" defaultValue={destination.country} className={inputCls}>
                {['Albania', 'Montenegro', 'Kosovo'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <textarea name="description" defaultValue={destination.description ?? ''} rows={4} className={`${inputCls} resize-none`} />
            </div>
            <div>
              <label className={labelCls}>Geography</label>
              <textarea name="geography" defaultValue={destination.geography ?? ''} rows={3} className={`${inputCls} resize-none`} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelCls}>Best season</label><input name="bestSeason" defaultValue={destination.bestSeason ?? ''} className={inputCls} placeholder="June – October" /></div>
              <div><label className={labelCls}>Currency</label><input name="currency" defaultValue={destination.currency ?? ''} className={inputCls} placeholder="EUR / ALL" /></div>
              <div><label className={labelCls}>Language</label><input name="language" defaultValue={destination.language ?? ''} className={inputCls} placeholder="Albanian" /></div>
            </div>
            <div><label className={labelCls}>Visa requirements</label><textarea name="visaRequirements" defaultValue={destination.visaRequirements ?? ''} rows={2} className={`${inputCls} resize-none`} /></div>
            <div><label className={labelCls}>Weather info</label><textarea name="weatherInfo" defaultValue={destination.weatherInfo ?? ''} rows={2} className={`${inputCls} resize-none`} /></div>
            <div><label className={labelCls}>Safety info</label><textarea name="safetyInfo" defaultValue={destination.safetyInfo ?? ''} rows={2} className={`${inputCls} resize-none`} /></div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">SEO</h3>
            <div><label className={labelCls}>SEO title</label><input name="seoTitle" defaultValue={destination.seoTitle ?? ''} className={inputCls} maxLength={60} /></div>
            <div><label className={labelCls}>SEO description</label><textarea name="seoDescription" defaultValue={destination.seoDescription ?? ''} rows={2} className={`${inputCls} resize-none`} maxLength={160} /></div>
          </div>
        </div>

        <div className="space-y-4">
          <PublishToggle
            published={destination.published ?? false}
            onToggle={async (p) => { 'use server'; await toggleDestinationPublished(destination.id, p); }}
          />
          <button type="submit" className="w-full rounded-lg py-3 text-sm font-semibold text-white" style={{ backgroundColor: '#2e8a57' }}>
            Save destination
          </button>
        </div>
      </form>
    </div>
  );
}
