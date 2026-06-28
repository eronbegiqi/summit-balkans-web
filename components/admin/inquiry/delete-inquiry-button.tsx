'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteInquiry } from '@/lib/actions/inquiries';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';

type Props = {
  inquiryId: number;
  title: string;
  redirectTo?: string;
  className?: string;
};

export function DeleteInquiryButton({ inquiryId, title, redirectTo, className }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function confirmDelete() {
    startTransition(async () => {
      try {
        await deleteInquiry(inquiryId);
        toast.success('Inquiry deleted');
        setOpen(false);
        if (redirectTo) {
          router.push(redirectTo);
          return;
        }
        router.refresh();
      } catch {
        toast.error('Could not delete inquiry');
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 ${className ?? ''}`.trim()}
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete this inquiry?"
        description={`This will permanently remove the inquiry from “${title}”. This action cannot be undone.`}
        confirmLabel="Delete Inquiry"
        variant="danger"
        onConfirm={confirmDelete}
        loading={pending}
      />
    </>
  );
}
