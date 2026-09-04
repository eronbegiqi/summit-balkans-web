'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowUp, ImageIcon, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { GalleryUploader, type UploadResult } from '@/components/admin/gallery/gallery-uploader';
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
  const [deleting, setDeleting] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  // Re-sync local state when the server gives us a fresh list (e.g. after
  // router.refresh() picks up newly uploaded rows with their real ids).
  useEffect(() => setImages(initialImages), [initialImages]);

  async function handleUploaded({ succeeded, failed }: UploadResult) {
    if (succeeded.length > 0) {
      try {
        await createGalleryImages(succeeded);
        router.refresh();
      } catch (err) {
        console.error('[gallery] failed to save uploaded images', err);
        toast.error(
          `${succeeded.length} photo${succeeded.length === 1 ? '' : 's'} uploaded but couldn't be saved to the gallery`,
          { description: 'Please try again — nothing was added.' }
        );
        return;
      }
    }

    if (failed.length === 0) {
      toast.success(`Added ${succeeded.length} image${succeeded.length === 1 ? '' : 's'}`);
    } else if (succeeded.length > 0) {
      toast.warning(`Added ${succeeded.length} image${succeeded.length === 1 ? '' : 's'}, ${failed.length} failed`, {
        description: failed.map((f) => `${f.name}: ${f.error}`).join('; '),
      });
    } else {
      toast.error(`All ${failed.length} upload${failed.length === 1 ? '' : 's'} failed`, {
        description: failed.map((f) => `${f.name}: ${f.error}`).join('; '),
      });
    }
  }

  function moveImage(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;

    const previous = images;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    setImages(next);

    startTransition(async () => {
      try {
        await reorderGalleryImages(next.map((img) => img.id));
      } catch (err) {
        console.error('[gallery] reorder failed', err);
        setImages(previous);
        toast.error('Could not save the new order — please try again.');
      }
    });
  }

  function handleFieldBlur(id: number, field: 'title' | 'altText', value: string) {
    const trimmed = value.trim() || null;
    const previous = images;
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, [field]: trimmed } : img)));

    startTransition(async () => {
      try {
        await updateGalleryImage(id, { [field]: trimmed });
      } catch (err) {
        console.error('[gallery] field update failed', err);
        setImages(previous);
        toast.error(`Could not save the ${field === 'title' ? 'title' : 'alt text'} — please try again.`);
      }
    });
  }

  async function handleTogglePublished(id: number, published: boolean) {
    const previous = images;
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, published } : img)));
    try {
      await updateGalleryImage(id, { published });
    } catch (err) {
      console.error('[gallery] publish toggle failed', err);
      setImages(previous);
      toast.error('Could not update the published status — please try again.');
      throw err; // let PublishToggle know it failed so it won't show its own success toast
    }
  }

  function handleDelete(id: number) {
    setDeleting(true);
    startTransition(async () => {
      try {
        await deleteGalleryImage(id);
        setImages((prev) => prev.filter((img) => img.id !== id));
        setPendingDeleteId(null);
        toast.success('Image deleted');
      } catch (err) {
        console.error('[gallery] delete failed', err);
        toast.error('Could not delete the image — please try again.');
      } finally {
        setDeleting(false);
      }
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
        loading={deleting}
        onConfirm={() => { if (pendingDeleteId !== null) handleDelete(pendingDeleteId); }}
      />
    </div>
  );
}
