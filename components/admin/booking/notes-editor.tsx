'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { saveInternalNotes } from '@/lib/actions/bookings';

export function NotesEditor({ bookingId, initialNotes }: { bookingId: number; initialNotes: string | null }) {
  const [notes, setNotes] = useState(initialNotes ?? '');
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      await saveInternalNotes(bookingId, notes);
      toast.success('Notes saved');
    });
  }

  return (
    <div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={5}
        placeholder="Internal notes visible only to admins…"
        className="w-full rounded-lg border border-gray-200 px-3.5 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
      />
      <button
        onClick={save}
        disabled={pending}
        className="mt-2 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        style={{ backgroundColor: '#2e8a57' }}
      >
        {pending ? 'Saving…' : 'Save notes'}
      </button>
    </div>
  );
}
