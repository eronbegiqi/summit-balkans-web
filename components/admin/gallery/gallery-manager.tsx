'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowUp, ImageIcon, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { GalleryUploader } from '@/components/admin/gallery/gallery-uploader';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { PublishToggle } from '@/components/admin/publish-toggle';
import { EmptyState } from '@/components/admin/empty-state';
import {
  createGalleryImages,
  deleteGalleryImage,
  reorderGalleryImages,
  updateGalleryImage,
} from '@/lib/actions/gallery';
import type { GalleryImageListItem } from '@/lib/db/queries/gallery';

type Props = {
  images: GalleryImageListItem[];
};

export function GalleryManager({ images: initialImages }: Props) {
  const [images, setImages] = useState(initialImages);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [, startTransition] = useTransition();
  const router = useRouter();

  // Re-sync local state when the server gives us a fresh list (e.g. after
  // router.refresh() picks up newly uploaded rows with their real ids).
  useEffect(() => setImages(initialImages), [initialImages]);

  async function handleUploaded(uploaded: { imageUrl: string }[]) {
    await createGalleryImages(uploaded);
    toast.success(`Added ${uploaded.length} image${uploaded.length === 1 ? '' : 's'}`);
    // createGalleryImages doesn't return the new rows' ids, so pull the fresh
    // list (with real ids/order) from the server instead of guessing them.
    router.refresh();
  }

  function moveImage(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;

    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    setImages(next);

    startTransition(async () => {
      await reorderGalleryImages(next.map((img) => img.id));
    });
  }

  function handleFieldBlur(id: number, field: 'title' | 'altText', value: string) {
    const trimmed = value.trim() || null;
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, [field]: trimmed } : img)));
    startTransition(async () => {
      await updateGalleryImage(id, { [field]: trimmed });
    });
  }

  function handleTogglePublished(id: number, published: boolean) {
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, published } : img)));
    return updateGalleryImage(id, { published });
  }

  function handleDelete(id: number) {
    startTransition(async () => {
      await deleteGalleryImage(id);
      setImages((prev) => prev.filter((img) => img.id !== id));
      setPendingDeleteId(null);
      toast.success('Image deleted');
    });
  }

  return (
    <div className="space-y-6">
      <GalleryUploader onUploaded={handleUploaded} />

      {images.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No gallery images yet"
          description="Upload photos above — they'll show up here and on the homepage/gallery page."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {images.map((img, index) => (
            <div key={img.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.imageUrl} alt={img.altText ?? ''} className="h-44 w-full object-cover" />

              <div className="space-y-2 p-4">
                <input
                  defaultValue={img.title ?? ''}
                  placeholder="Title (optional)"
                  onBlur={(e) => handleFieldBlur(img.id, 'title', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm text-gray-900 focus:border-emerald-400 focus:outline-none"
                />
                <input
                  defaultValue={img.altText ?? ''}
                  placeholder="Alt text (for accessibility & SEO)"
                  onBlur={(e) => handleFieldBlur(img.id, 'altText', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-500 focus:border-emerald-400 focus:outline-none"
                />

                <PublishToggle
                  published={img.published ?? false}
                  onToggle={(published) => handleTogglePublished(img.id, published)}
                  label="Published"
                />

                <div className="flex items-center justify-between pt-1">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveImage(index, -1)}
                      disabled={index === 0}
                      aria-label="Move earlier"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(index, 1)}
                      disabled={index === images.length - 1}
                      aria-label="Move later"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPendingDeleteId(img.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                    aria-label="Delete image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={pendingDeleteId !== null}
        onOpenChange={(open) => !open && setPendingDeleteId(null)}
        title="Delete this image?"
        description="This permanently removes the image from the gallery and deletes the file from storage."
        confirmLabel="Delete Image"
        variant="danger"
        onConfirm={() => { if (pendingDeleteId !== null) handleDelete(pendingDeleteId); }}
      />
    </div>
  );
}
