'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { deleteBlogPost } from '@/lib/actions/content';

type Props = {
  postId: number;
  title: string;
  redirectTo?: string;
};

export function DeleteBlogPostButton({ postId, title, redirectTo }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function confirmDelete() {
    startTransition(async () => {
      try {
        await deleteBlogPost(postId);
        toast.success('Blog post deleted');
        setOpen(false);
        if (redirectTo) {
          router.push(redirectTo);
        }
        router.refresh();
      } catch {
        toast.error('Could not delete blog post');
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Delete
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-gray-950/45 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget && !pending) setOpen(false);
          }}
        >
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-base font-semibold text-gray-900">Delete blog post?</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={pending}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 px-5 py-5">
              <p className="text-sm leading-6 text-gray-600">
                This will permanently delete <span className="font-semibold text-gray-900">&ldquo;{title}&rdquo;</span>.
                This action cannot be undone.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-gray-100 px-5 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={pending}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={pending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
              >
                {pending ? 'Deleting...' : 'Delete post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
