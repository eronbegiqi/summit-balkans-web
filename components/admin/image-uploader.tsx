'use client';

import { useCallback, useRef, useState } from 'react';
import { ImageIcon, Loader2, Trash2, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

type UploadedImage = {
  original: string;
  large: string;
  medium: string;
  thumb: string;
};

type Props = {
  value?: UploadedImage | null;
  onChange?: (image: UploadedImage | null) => void;
  folder?: string;
  className?: string;
};

export function ImageUploader({ value, onChange, folder = 'general', className }: Props) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file.');
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        setError('Image must be under 20 MB.');
        return;
      }

      setError(null);
      setUploading(true);

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error ?? 'Upload failed');
        }
        const data: UploadedImage = await res.json();
        onChange?.(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Upload failed. Please try again.');
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) upload(file);
    },
    [upload]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) upload(file);
    },
    [upload]
  );

  if (value) {
    return (
      <div className={cn('relative overflow-hidden rounded-xl border border-gray-200', className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={value.medium} alt="Uploaded" className="w-full object-cover" style={{ maxHeight: 280 }} />
        <button
          type="button"
          onClick={() => onChange?.(null)}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-600 shadow-sm transition-colors hover:bg-white"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    );
  }

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
            {uploading ? 'Uploading…' : 'Drop an image or click to browse'}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">PNG, JPG, WebP — max 20 MB</p>
        </div>
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
