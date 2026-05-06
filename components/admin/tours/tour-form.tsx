'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import * as Tabs from '@radix-ui/react-tabs';
import { saveTour, toggleTourPublished, deleteTour } from '@/lib/actions/tours';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { RepeaterField, StringListField } from '@/components/admin/repeater-field';
import { ImageUploader } from '@/components/admin/image-uploader';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import type { TourWithGuide } from '@/lib/db/queries/tours';
import type { GuideListItem } from '@/lib/db/queries/guides';

type Props = {
  tour: TourWithGuide | null;
  guides: GuideListItem[];
};

const TABS = [
  'Basics', 'Location', 'Logistics', 'Pricing', 'Itinerary',
  'What\'s Included', 'Kit Lists', 'Media', 'Guide', 'FAQ', 'SEO',
];

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function TourForm({ tour, guides }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState(tour?.title ?? '');
  const [slug, setSlug] = useState(tour?.slug ?? '');
  const [excerpt, setExcerpt] = useState(tour?.excerpt ?? '');
  const [description, setDescription] = useState(tour?.description ?? '');
  const [country, setCountry] = useState(tour?.country ?? '');
  const [region, setRegion] = useState(tour?.region ?? '');
  const [meetingPoint, setMeetingPoint] = useState(tour?.meetingPoint ?? '');
  const [endPoint, setEndPoint] = useState(tour?.endPoint ?? '');
  const [durationDays, setDurationDays] = useState(String(tour?.durationDays ?? 7));
  const [groupSizeMin, setGroupSizeMin] = useState(String(tour?.groupSizeMin ?? 2));
  const [groupSizeMax, setGroupSizeMax] = useState(String(tour?.groupSizeMax ?? 12));
  const [totalDistanceKm, setTotalDistanceKm] = useState(String(tour?.totalDistanceKm ?? ''));
  const [maxElevationM, setMaxElevationM] = useState(String(tour?.maxElevationM ?? ''));
  const [bestSeasonStart, setBestSeasonStart] = useState(tour?.bestSeasonStart ?? '');
  const [bestSeasonEnd, setBestSeasonEnd] = useState(tour?.bestSeasonEnd ?? '');
  const [accommodationType, setAccommodationType] = useState(tour?.accommodationType ?? '');
  const [mealsIncluded, setMealsIncluded] = useState(tour?.mealsIncluded ?? '');
  const [transportInfo, setTransportInfo] = useState(tour?.transportInfo ?? '');
  const [pricePerPersonEur, setPricePerPersonEur] = useState(String(tour?.pricePerPersonEur ?? ''));
  const [difficulty, setDifficulty] = useState(String(tour?.difficulty ?? 2));
  const [isFlagship, setIsFlagship] = useState(tour?.isFlagship ?? false);
  const [assignedGuideId, setAssignedGuideId] = useState(String(tour?.assignedGuideId ?? ''));
  const [seoTitle, setSeoTitle] = useState(tour?.seoTitle ?? '');
  const [seoDescription, setSeoDescription] = useState(tour?.seoDescription ?? '');
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string | null>(tour?.featuredImageUrl ?? null);
  const [published, setPublished] = useState(tour?.published ?? false);

  const [itinerary, setItinerary] = useState<Array<{ day: string; title: string; description: string; distanceKm: string; accommodation: string }>>(
    ((tour?.itinerary ?? []) as Array<{ day: number; title: string; description: string; distanceKm?: number; accommodation?: string }>).map((d) => ({
      day: String(d.day),
      title: d.title,
      description: d.description,
      distanceKm: String(d.distanceKm ?? ''),
      accommodation: d.accommodation ?? '',
    }))
  );
  const [included, setIncluded] = useState<string[]>((tour?.includedItems ?? []) as string[]);
  const [notIncluded, setNotIncluded] = useState<string[]>((tour?.notIncludedItems ?? []) as string[]);
  const [kitEssential, setKitEssential] = useState<string[]>((tour?.kitEssential ?? []) as string[]);
  const [kitRecommended, setKitRecommended] = useState<string[]>((tour?.kitRecommended ?? []) as string[]);
  const [kitProvided, setKitProvided] = useState<string[]>((tour?.kitProvided ?? []) as string[]);
  const [faq, setFaq] = useState<Array<{ question: string; answer: string }>>(
    ((tour?.faq ?? []) as Array<{ question: string; answer: string }>)
  );

  function buildPayload() {
    return {
      slug,
      title,
      excerpt: excerpt || undefined,
      description: description || undefined,
      featuredImageUrl: featuredImageUrl || undefined,
      country: country || undefined,
      region: region || undefined,
      meetingPoint: meetingPoint || undefined,
      endPoint: endPoint || undefined,
      durationDays: parseInt(durationDays),
      difficulty: parseInt(difficulty) as 1 | 2 | 3 | 4 | 5,
      pricePerPersonEur,
      groupSizeMin: parseInt(groupSizeMin),
      groupSizeMax: parseInt(groupSizeMax),
      totalDistanceKm: totalDistanceKm ? totalDistanceKm : undefined,
      maxElevationM: maxElevationM ? parseInt(maxElevationM) : undefined,
      isFlagship,
      bestSeasonStart: bestSeasonStart || undefined,
      bestSeasonEnd: bestSeasonEnd || undefined,
      accommodationType: accommodationType || undefined,
      mealsIncluded: mealsIncluded || undefined,
      transportInfo: transportInfo || undefined,
      assignedGuideId: assignedGuideId ? parseInt(assignedGuideId) : undefined,
      itinerary: itinerary.map((d) => ({ day: parseInt(d.day), title: d.title, description: d.description, distanceKm: d.distanceKm ? parseFloat(d.distanceKm) : undefined, accommodation: d.accommodation || undefined })),
      includedItems: included,
      notIncludedItems: notIncluded,
      kitEssential,
      kitRecommended,
      kitProvided,
      faq,
      seoTitle: seoTitle || undefined,
      seoDescription: seoDescription || undefined,
      published,
    };
  }

  function save() {
    if (!title || !slug || !pricePerPersonEur) {
      toast.error('Title, slug, and price are required');
      return;
    }
    startTransition(async () => {
      await saveTour(tour?.id ?? null, buildPayload() as Parameters<typeof saveTour>[1]);
      toast.success('Tour saved');
    });
  }

  function handleDelete() {
    if (!tour) return;
    startTransition(async () => {
      await deleteTour(tour.id);
    });
  }

  const inputCls = 'w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500';
  const labelCls = 'mb-1.5 block text-sm font-medium text-gray-700';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {tour ? `Edit: ${tour.title}` : 'New Tour'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {tour && (
            <button
              onClick={() => setDeleteOpen(true)}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          )}
          <button
            onClick={save}
            disabled={pending}
            className="rounded-lg px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
            style={{ backgroundColor: '#2e8a57' }}
          >
            {pending ? 'Saving…' : 'Save tour'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Main form */}
        <div className="lg:col-span-3">
          <Tabs.Root defaultValue="Basics">
            <Tabs.List className="flex flex-wrap gap-0.5 rounded-xl border border-gray-200 bg-gray-50 p-1 mb-6">
              {TABS.map((tab) => (
                <Tabs.Trigger
                  key={tab}
                  value={tab}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                >
                  {tab}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {/* Basics */}
            <Tabs.Content value="Basics" className="space-y-4">
              <div>
                <label className={labelCls}>Title *</label>
                <input value={title} onChange={(e) => { setTitle(e.target.value); if (!tour) setSlug(slugify(e.target.value)); }} className={inputCls} placeholder="Peaks of the Balkans Trek" />
              </div>
              <div>
                <label className={labelCls}>Slug *</label>
                <input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} className={`${inputCls} font-mono`} placeholder="peaks-of-the-balkans" />
              </div>
              <div>
                <label className={labelCls}>Excerpt</label>
                <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} className={`${inputCls} resize-none`} placeholder="One-paragraph summary shown in listings…" />
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <RichTextEditor value={description} onChange={setDescription} placeholder="Full tour description…" />
              </div>
            </Tabs.Content>

            {/* Location */}
            <Tabs.Content value="Location" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Country</label>
                  <select value={country} onChange={(e) => setCountry(e.target.value)} className={inputCls}>
                    <option value="">Select…</option>
                    {['Albania', 'Montenegro', 'Kosovo', 'Multi-country'].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Region</label>
                  <input value={region} onChange={(e) => setRegion(e.target.value)} className={inputCls} placeholder="Albanian Alps" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Meeting Point</label>
                <input value={meetingPoint} onChange={(e) => setMeetingPoint(e.target.value)} className={inputCls} placeholder="e.g. Shkodër city centre" />
              </div>
              <div>
                <label className={labelCls}>End Point</label>
                <input value={endPoint} onChange={(e) => setEndPoint(e.target.value)} className={inputCls} placeholder="e.g. Gjakova bus station" />
              </div>
            </Tabs.Content>

            {/* Logistics */}
            <Tabs.Content value="Logistics" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Duration (days)</label>
                  <input type="number" min="1" value={durationDays} onChange={(e) => setDurationDays(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Min group</label>
                  <input type="number" min="1" value={groupSizeMin} onChange={(e) => setGroupSizeMin(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Max group</label>
                  <input type="number" min="1" value={groupSizeMax} onChange={(e) => setGroupSizeMax(e.target.value)} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Total distance (km)</label>
                  <input type="number" value={totalDistanceKm} onChange={(e) => setTotalDistanceKm(e.target.value)} className={inputCls} placeholder="120" />
                </div>
                <div>
                  <label className={labelCls}>Max elevation (m)</label>
                  <input type="number" value={maxElevationM} onChange={(e) => setMaxElevationM(e.target.value)} className={inputCls} placeholder="2694" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Season start</label>
                  <input value={bestSeasonStart} onChange={(e) => setBestSeasonStart(e.target.value)} className={inputCls} placeholder="June" />
                </div>
                <div>
                  <label className={labelCls}>Season end</label>
                  <input value={bestSeasonEnd} onChange={(e) => setBestSeasonEnd(e.target.value)} className={inputCls} placeholder="October" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Accommodation type</label>
                <input value={accommodationType} onChange={(e) => setAccommodationType(e.target.value)} className={inputCls} placeholder="Mountain huts & guesthouses" />
              </div>
              <div>
                <label className={labelCls}>Meals included</label>
                <input value={mealsIncluded} onChange={(e) => setMealsIncluded(e.target.value)} className={inputCls} placeholder="Breakfast & dinner" />
              </div>
              <div>
                <label className={labelCls}>Transport info</label>
                <input value={transportInfo} onChange={(e) => setTransportInfo(e.target.value)} className={inputCls} placeholder="Private transfer from Shkodër" />
              </div>
            </Tabs.Content>

            {/* Pricing */}
            <Tabs.Content value="Pricing" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Price per person (€) *</label>
                  <input type="number" value={pricePerPersonEur} onChange={(e) => setPricePerPersonEur(e.target.value)} className={inputCls} placeholder="990" />
                </div>
                <div>
                  <label className={labelCls}>Difficulty *</label>
                  <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={inputCls}>
                    {[1, 2, 3, 4, 5].map((d) => <option key={d} value={d}>{d} — {['', 'Easy', 'Moderate', 'Challenging', 'Hard', 'Expert'][d]}</option>)}
                  </select>
                </div>
              </div>
              <label className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 cursor-pointer">
                <input type="checkbox" checked={isFlagship} onChange={(e) => setIsFlagship(e.target.checked)} className="rounded" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Flagship tour</p>
                  <p className="text-xs text-gray-400">Highlights this tour on the homepage and in navigation</p>
                </div>
              </label>
            </Tabs.Content>

            {/* Itinerary */}
            <Tabs.Content value="Itinerary">
              <RepeaterField
                label="Day-by-day itinerary"
                value={itinerary}
                onChange={setItinerary}
                template={{ day: String(itinerary.length + 1), title: '', description: '', distanceKm: '', accommodation: '' }}
                fields={[
                  { key: 'day', label: 'Day #', placeholder: '1' },
                  { key: 'title', label: 'Title', placeholder: 'Arrival in Shkodër' },
                  { key: 'distanceKm', label: 'Distance (km)', placeholder: '18' },
                  { key: 'accommodation', label: 'Accommodation', placeholder: 'Guesthouse Çelja' },
                  { key: 'description', label: 'Description', placeholder: 'Detailed day description…', multiline: true },
                ]}
                addLabel="Add day"
              />
            </Tabs.Content>

            {/* What's Included */}
            <Tabs.Content value="What's Included" className="space-y-6">
              <StringListField label="What's included" value={included} onChange={setIncluded} placeholder="e.g. Professional mountain guide" />
              <StringListField label="What's NOT included" value={notIncluded} onChange={setNotIncluded} placeholder="e.g. International flights" />
            </Tabs.Content>

            {/* Kit Lists */}
            <Tabs.Content value="Kit Lists" className="space-y-6">
              <StringListField label="Essential kit" value={kitEssential} onChange={setKitEssential} placeholder="e.g. Hiking boots (waterproof)" />
              <StringListField label="Recommended kit" value={kitRecommended} onChange={setKitRecommended} placeholder="e.g. Trekking poles" />
              <StringListField label="Provided by us" value={kitProvided} onChange={setKitProvided} placeholder="e.g. Sleeping bag liner" />
            </Tabs.Content>

            {/* Media */}
            <Tabs.Content value="Media" className="space-y-4">
              <div>
                <label className={labelCls}>Featured image</label>
                <ImageUploader
                  value={featuredImageUrl ? { original: featuredImageUrl, large: featuredImageUrl, medium: featuredImageUrl, thumb: featuredImageUrl } : null}
                  onChange={(img) => setFeaturedImageUrl(img?.large ?? null)}
                  folder="tours"
                />
              </div>
            </Tabs.Content>

            {/* Guide */}
            <Tabs.Content value="Guide" className="space-y-4">
              <div>
                <label className={labelCls}>Assigned guide</label>
                <select value={assignedGuideId} onChange={(e) => setAssignedGuideId(e.target.value)} className={inputCls}>
                  <option value="">None assigned</option>
                  {guides.map((g) => (
                    <option key={g.id} value={g.id}>{g.name} ({g.country})</option>
                  ))}
                </select>
              </div>
            </Tabs.Content>

            {/* FAQ */}
            <Tabs.Content value="FAQ">
              <RepeaterField
                label="Frequently asked questions"
                value={faq}
                onChange={setFaq}
                template={{ question: '', answer: '' }}
                fields={[
                  { key: 'question', label: 'Question', placeholder: 'What is the fitness level required?' },
                  { key: 'answer', label: 'Answer', placeholder: 'This tour requires…', multiline: true },
                ]}
                addLabel="Add FAQ"
              />
            </Tabs.Content>

            {/* SEO */}
            <Tabs.Content value="SEO" className="space-y-4">
              <div>
                <label className={labelCls}>SEO title</label>
                <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className={inputCls} placeholder="Peaks of the Balkans Trek | Summit Balkans" maxLength={60} />
                <p className="mt-1 text-xs text-gray-400">{seoTitle.length}/60</p>
              </div>
              <div>
                <label className={labelCls}>SEO description</label>
                <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={3} className={`${inputCls} resize-none`} placeholder="Hike the legendary Peaks of the Balkans trail…" maxLength={160} />
                <p className="mt-1 text-xs text-gray-400">{seoDescription.length}/160</p>
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Visibility</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">{published ? 'Published (live)' : 'Draft (hidden)'}</span>
            </label>
          </div>

          <button
            onClick={save}
            disabled={pending}
            className="w-full rounded-lg py-3 text-sm font-semibold text-white disabled:opacity-60"
            style={{ backgroundColor: '#2e8a57' }}
          >
            {pending ? 'Saving…' : 'Save tour'}
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this tour?"
        description="This will permanently delete the tour and all its departures. Bookings linked to this tour will remain but lose their tour reference."
        confirmLabel="Delete Tour"
        variant="danger"
        onConfirm={handleDelete}
        loading={pending}
      />
    </div>
  );
}
