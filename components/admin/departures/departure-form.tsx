'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { saveDeparture, deleteDeparture } from '@/lib/actions/departures';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { toDateInputValue } from '@/lib/db/utils';
import type { DepartureWithTour } from '@/lib/db/queries/departures';
import type { TourListItem } from '@/lib/db/queries/tours';
import type { GuideListItem } from '@/lib/db/queries/guides';

type Props = {
  departure: DepartureWithTour | null;
  tours: TourListItem[];
  guides: GuideListItem[];
};

const STATUSES = ['AVAILABLE', 'LIMITED', 'SOLD_OUT', 'CANCELLED'] as const;

export function DepartureForm({ departure, tours, guides }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [tourId, setTourId] = useState(String(departure?.tourId ?? tours[0]?.id ?? ''));
  const [startDate, setStartDate] = useState(toDateInputValue(departure?.startDate));
  const [endDate, setEndDate] = useState(toDateInputValue(departure?.endDate));
  const [capacity, setCapacity] = useState(String(departure?.capacity ?? 12));
  const [bookedCount, setBookedCount] = useState(String(departure?.bookedCount ?? 0));
  const [pricePerPersonEur, setPricePerPersonEur] = useState(String(departure?.pricePerPersonEur ?? ''));
  const [language, setLanguage] = useState(departure?.language ?? 'English');
  const [guideId, setGuideId] = useState(String(departure?.guideId ?? ''));
  const [status, setStatus] = useState<(typeof STATUSES)[number]>(departure?.status ?? 'AVAILABLE');
  const [notes, setNotes] = useState(departure?.notes ?? '');

  function buildPayload() {
    return {
      tourId: parseInt(tourId),
      startDate,
      endDate,
      capacity: parseInt(capacity),
      bookedCount: bookedCount ? parseInt(bookedCount) : 0,
      pricePerPersonEur: pricePerPersonEur || undefined,
      language: language || undefined,
      guideId: guideId ? parseInt(guideId) : undefined,
      status,
      notes: notes || undefined,
    };
  }

  function save() {
    if (!tourId) {
      toast.error('Please select a tour');
      return;
    }
    if (!startDate || !endDate) {
      toast.error('Start and end dates are required');
      return;
    }
    if (endDate < startDate) {
      toast.error('End date must be on or after the start date');
      return;
    }
    if (!capacity || parseInt(capacity) < 1) {
      toast.error('Capacity must be at least 1');
      return;
    }
    startTransition(async () => {
      try {
        const result = await saveDeparture(departure?.id ?? null, buildPayload() as unknown as Parameters<typeof saveDeparture>[1]);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        toast.success('Departure saved');
        if (!departure) {
          router.push(`/admin/departures/${result.id}`);
        } else {
          router.refresh();
        }
      } catch {
        toast.error('Could not save departure. Please try again.');
      }
    });
  }

  function handleDelete() {
    if (!departure) return;
    startTransition(async () => {
      await deleteDeparture(departure.id);
    });
  }

  const inputCls = 'w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500';
  const labelCls = 'mb-1.5 block text-sm font-medium text-gray-700';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-center text-gray-900">
            {departure ? `Edit departure` : 'New departure'}
          </h1>
          {departure && (
            <p className="mt-1 text-sm text-gray-500">{departure.tour.title}</p>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4 rounded-xl border border-gray-200 bg-white p-6">
        <div>
          <label className={labelCls}>Tour *</label>
          <select value={tourId} onChange={(e) => setTourId(e.target.value)} className={inputCls}>
            <option value="">Select a tour…</option>
            {tours.map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Start date *</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>End date *</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputCls} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Capacity *</label>
            <input type="number" min="1" value={capacity} onChange={(e) => setCapacity(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Booked count</label>
            <input type="number" min="0" value={bookedCount} onChange={(e) => setBookedCount(e.target.value)} className={inputCls} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Price per person (€)</label>
            <input type="number" value={pricePerPersonEur} onChange={(e) => setPricePerPersonEur(e.target.value)} className={inputCls} placeholder="Defaults to tour price" />
          </div>
          <div>
            <label className={labelCls}>Language</label>
            <input value={language} onChange={(e) => setLanguage(e.target.value)} className={inputCls} placeholder="English" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Guide</label>
            <select value={guideId} onChange={(e) => setGuideId(e.target.value)} className={inputCls}>
              <option value="">None assigned</option>
              {guides.map((g) => (
                <option key={g.id} value={g.id}>{g.name} ({g.country})</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as (typeof STATUSES)[number])} className={inputCls}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelCls}>Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={`${inputCls} resize-none`} placeholder="Internal notes about this departure…" />
        </div>
        <div className="flex items-center justify-end gap-3">
          {departure && (
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
            {pending ? 'Saving…' : 'Save departure'}
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this departure?"
        description="This will permanently delete the departure. Bookings linked to it may be affected."
        confirmLabel="Delete Departure"
        variant="danger"
        onConfirm={handleDelete}
        loading={pending}
      />
    </div>
  );
}
