'use client';

import { useState, useTransition } from 'react';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { deleteGuide } from '@/lib/actions/content';

export function GuideDeleteButton({ id }: { id: number }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteGuide(id);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-lg border border-red-200 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Delete guide
      </button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete this guide?"
        description="This will permanently delete the guide. Any tours or departures that reference this guide will lose their guide assignment."
        confirmLabel="Delete Guide"
        variant="danger"
        onConfirm={handleDelete}
        loading={pending}
      />
    </>
  );
}
