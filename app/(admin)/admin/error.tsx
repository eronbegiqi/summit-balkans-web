'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Admin error]', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <AlertTriangle className="h-6 w-6 text-red-600" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Something went wrong</h2>
        <p className="mt-1 text-sm text-gray-500">{error.message || 'An unexpected error occurred.'}</p>
        {error.digest && (
          <p className="mt-1 font-mono text-xs text-gray-400">Digest: {error.digest}</p>
        )}
      </div>
      <button
        onClick={reset}
        className="rounded-lg px-4 py-2 text-sm font-medium text-white"
        style={{ backgroundColor: '#2e8a57' }}
      >
        Try again
      </button>
    </div>
  );
}
