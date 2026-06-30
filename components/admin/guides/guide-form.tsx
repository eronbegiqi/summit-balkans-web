'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { saveGuide, toggleGuidePublished } from '@/lib/actions/content';
import { ImageUploader } from '@/components/admin/image-uploader';
import { PublishToggle } from '@/components/admin/publish-toggle';
import { GuideDeleteButton } from '@/components/admin/guides/guide-delete-button';
import type { GuideListItem } from '@/lib/db/queries/guides';
import { parseJsonField } from '@/lib/db/utils';

type Props = {
  guide?: GuideListItem | null;
};

export function GuideForm({ guide }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [name, setName] = useState(guide?.name ?? '');
  const [slug, setSlug] = useState(guide?.slug ?? '');
  const [country, setCountry] = useState<'Albania' | 'Montenegro' | 'Kosovo'>(
    (guide?.country as 'Albania' | 'Montenegro' | 'Kosovo') ?? 'Albania'
  );
  const [bio, setBio] = useState(guide?.bio ?? '');
  const [quote, setQuote] = useState(guide?.quote ?? '');
  const [yearsExperience, setYearsExperience] = useState(guide?.yearsExperience?.toString() ?? '');
  const [contactEmail, setContactEmail] = useState(guide?.contactEmail ?? '');
  const [contactPhone, setContactPhone] = useState(guide?.contactPhone ?? '');
  const [languages, setLanguages] = useState(parseJsonField<string[]>(guide?.languages, []).join(', '));
  const [specialties, setSpecialties] = useState(parseJsonField<string[]>(guide?.specialties, []).join(', '));
  const [photoUrl, setPhotoUrl] = useState<string | null>(guide?.photoUrl ?? null);
  const [published, setPublished] = useState(guide?.published ?? false);

  const inputCls = 'w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500';
  const labelCls = 'mb-1.5 block text-sm font-medium text-gray-700';

  function slugify(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function save() {
    if (!name || !slug) {
      toast.error('Name and slug are required');
      return;
    }
    startTransition(async () => {
      const parsedLanguages = languages.split(',').map((s) => s.trim()).filter(Boolean);
      const parsedSpecialties = specialties.split(',').map((s) => s.trim()).filter(Boolean);
      await saveGuide(guide?.id ?? null, {
        name,
        slug,
        country,
        bio: bio || undefined,
        quote: quote || undefined,
        yearsExperience: parseInt(yearsExperience) || undefined,
        contactEmail: contactEmail || undefined,
        contactPhone: contactPhone || undefined,
        languages: parsedLanguages.length ? parsedLanguages : undefined,
        specialties: parsedSpecialties.length ? parsedSpecialties : undefined,
        photoUrl: photoUrl || undefined,
        published: guide ? published : false,
        displayOrder: guide?.displayOrder ?? 0,
      });
      toast.success(guide ? 'Guide saved' : 'Guide created');
      if (!guide) router.push('/admin/guides');
    });
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Name *</label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!guide) setSlug(slugify(e.target.value));
              }}
              required
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Slug *</label>
            <input
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              required
              className={`${inputCls} font-mono`}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Country</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value as 'Albania' | 'Montenegro' | 'Kosovo')}
            className={inputCls}
          >
            {['Albania', 'Montenegro', 'Kosovo'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={5}
            className={`${inputCls} resize-none`}
          />
        </div>

        <div>
          <label className={labelCls}>Quote</label>
          <input value={quote} onChange={(e) => setQuote(e.target.value)} className={inputCls} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Years experience</label>
            <input
              type="number"
              value={yearsExperience}
              onChange={(e) => setYearsExperience(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className={inputCls} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Languages (comma-separated)</label>
          <input
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
            placeholder="English, Albanian, Shqip"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Specialties (comma-separated)</label>
          <input
            value={specialties}
            onChange={(e) => setSpecialties(e.target.value)}
            placeholder="Alpine trekking, Photography"
            className={inputCls}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <label className="mb-3 block text-sm font-semibold text-gray-900">Photo</label>
          <ImageUploader
            value={photoUrl ? { original: photoUrl, large: photoUrl, medium: photoUrl, thumb: photoUrl } : null}
            onChange={(img) => setPhotoUrl(img?.large ?? null)}
            folder="guides"
          />
        </div>

        {guide && (
          <PublishToggle
            published={published}
            onToggle={async (p) => {
              setPublished(p);
              await toggleGuidePublished(guide.id, p);
            }}
          />
        )}

        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="w-full rounded-lg py-3 text-sm font-semibold text-white disabled:opacity-60"
          style={{ backgroundColor: '#2e8a57' }}
        >
          {pending ? 'Saving…' : guide ? 'Save guide' : 'Create guide'}
        </button>

        {guide && <GuideDeleteButton id={guide.id} />}
      </div>
    </div>
  );
}
