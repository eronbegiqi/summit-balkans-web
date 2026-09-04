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

type Props = {
  onUploaded: (images: { imageUrl: string }[]) => void | Promise<void>;
  className?: string;
};

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

      const uploaded: { imageUrl: string }[] = [];
      // Sequential, not parallel — keeps the (single) /api/upload route from
      // being hit with a burst of large image-processing requests at once.
      for (const file of files) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('folder', 'gallery');
          const res = await fetch('/api/upload', { method: 'POST', body: formData });
          if (!res.ok) {
            const data = await res.json().catch(() => null);
            throw new Error(data?.error ?? `Upload failed for ${file.name}`);
          }
          const data: UploadedImage = await res.json();
          uploaded.push({ imageUrl: data.large });
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
        }
        setProgress((p) => (p ? { ...p, done: p.done + 1 } : p));
      }

      setUploading(false);
      setProgress(null);
      if (uploaded.length > 0) await onUploaded(uploaded);
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
            {uploading && progress ? `Uploading ${progress.done + 1} of ${progress.total}…` : 'Drop images or click to browse'}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">PNG, JPG, WebP — multiple files OK, converted to WebP automatically</p>
        </div>
      </button>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleChange} />
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
