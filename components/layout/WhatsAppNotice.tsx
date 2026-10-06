"use client";

import { useEffect, useRef } from "react";
import { CONTACT } from "@/lib/constants";

const g = CONTACT.fallbackGuide;

// Temporary: our WhatsApp number is blocked. Shows a top bar and intercepts every
// wa.me link on the site (one listener, no per-link edits) with a notice dialog.
export function WhatsAppNotice() {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.("a[href*='wa.me']");
      if (!a) return;
      e.preventDefault();
      dialog.current?.showModal();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-[110] h-9 bg-ink text-white text-xs md:text-sm flex items-center justify-center px-3 text-center leading-tight">
        <span className="truncate">
          WhatsApp is temporarily unavailable. Call or text {g.name}:{" "}
          <a href={g.link} className="font-semibold underline">{g.phone}</a>
        </span>
      </div>

      <dialog
        ref={dialog}
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl p-6 backdrop:bg-black/60"
      >
        <h2 className="font-fraunces text-xl font-bold mb-2">WhatsApp is temporarily unavailable</h2>
        <p className="text-sm text-slate mb-4">
          Our WhatsApp number is currently blocked, so messages sent there won&apos;t reach us. The number
          still works for regular calls and SMS, and we reply quickly on social media. Please reach us here instead:
        </p>
        <div className="flex flex-col gap-2 text-sm">
          <a href={g.link} className="bg-brand text-white text-center py-3 rounded-xl font-semibold no-underline">
            Call or text {g.name} (guide): {g.phone}
          </a>
          <a href={CONTACT.phoneLink} className="border border-mist text-center py-3 rounded-xl no-underline">
            Call the office: {CONTACT.phone}
          </a>
          <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="border border-mist text-center py-3 rounded-xl no-underline">
            Instagram
          </a>
          <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" className="border border-mist text-center py-3 rounded-xl no-underline">
            Facebook
          </a>
        </div>
        <button onClick={() => dialog.current?.close()} className="mt-4 w-full text-sm text-slate underline">
          Close
        </button>
      </dialog>
    </>
  );
}
