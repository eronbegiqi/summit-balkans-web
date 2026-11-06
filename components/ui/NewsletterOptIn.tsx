"use client";

/** Optional, unticked-by-default newsletter consent. Keep separate from required consents. */
export function NewsletterOptIn({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 w-4 h-4 accent-brand flex-shrink-0"
      />
      <span className="text-sm text-ink/70">
        (Optional) Send me occasional trip news and new dates by email. You can unsubscribe at any time.
      </span>
    </label>
  );
}
