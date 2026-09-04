'use client';

import { useCallback, useRef, useState } from 'react';
import { ImageIcon, Loader2, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

type UploadedImage = {
  original: string;
  large: string;
  medium: string;
  thumb: string;
};

export type UploadResult = {
  succeeded: { imageUrl: string }[];
  failed: { name: string; error: string }[];
};

type Props = {
  onUploaded: (result: UploadResult) => void | Promise<void>;
  className?: string;
};

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB, matches the single-image uploader
// Sharp resize + 3 WebP variants + R2 upload per file is real server work, not
// instant — a handful in flight at once is faster than one-at-a-time for large
// batches, without piling every request onto the server simultaneously like a
// plain Promise.all over everything would. A fixed "batch every 10s" delay was
// considered and rejected: it either wastes time when the server keeps up, or
// isn't enough breathing room when it doesn't. A sliding concurrency window
// self-paces to whatever the server can actually handle.
const CONCURRENCY = 4;

type FileResult =
  | { ok: true; imageUrl: string }
  | { ok: false; name: string; error: string };

async function uploadOne(file: File): Promise<FileResult> {
  if (file.size > MAX_FILE_SIZE) {
    return { ok: false, name: file.name, error: 'Over 20 MB' };
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'gallery');
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.error ?? 'Upload failed');
    }
    const data: UploadedImage = await res.json();
    return { ok: true, imageUrl: data.large };
  } catch (err) {
    return { ok: false, name: file.name, error: err instanceof Error ? err.message : 'Upload failed' };
  }
}

export function GalleryUploader({ onUploaded, className }: Props) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
      if (files.length === 0) {
        setError('Please choose image files.');
        return;
      }

      setError(null);
      setUploading(true);
      setProgress({ done: 0, total: files.length });

      const results: FileResult[] = [];
      let nextIndex = 0;

      async function worker() {
        while (nextIndex < files.length) {
          const file = files[nextIndex++];
          results.push(await uploadOne(file));
          setProgress((p) => (p ? { ...p, done: p.done + 1 } : p));
        }
      }

      await Promise.all(
        Array.from({ length: Math.min(CONCURRENCY, files.length) }, () => worker())
      );

      setUploading(false);
      setProgress(null);

      await onUploaded({
        succeeded: results.filter((r): r is Extract<FileResult, { ok: true }> => r.ok).map((r) => ({ imageUrl: r.imageUrl })),
        failed: results.filter((r): r is Extract<FileResult, { ok: false }> => !r.ok).map((r) => ({ name: r.name, error: r.error })),
      });
    },
    [onUploaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
    },
    [uploadFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) uploadFiles(e.target.files);
      e.target.value = '';
    },
    [uploadFiles]
  );

  const pct = progress ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        disabled={uploading}
        className={cn(
          'flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 transition-colors',
          dragging ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white',
          uploading && 'cursor-not-allowed opacity-60'
        )}
      >
        {uploading ? (
          <Loader2 className="h-7 w-7 animate-spin text-gray-400" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            {dragging ? <Upload className="h-5 w-5 text-emerald-600" /> : <ImageIcon className="h-5 w-5 text-gray-400" />}
          </div>
        )}
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">
            {uploading && progress ? `Uploading ${progress.done} of ${progress.total}…` : 'Drop images or click to browse'}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">PNG, JPG, WebP — multiple files OK, converted to WebP automatically</p>
        </div>
      </button>

      {uploading && progress && (
        <div className="mt-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-[width] duration-200"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1.5 text-center text-xs text-gray-400">{pct}%</p>
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleChange} />
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
