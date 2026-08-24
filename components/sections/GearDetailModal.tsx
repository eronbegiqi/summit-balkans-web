"use client";

import { useState, useEffect, useRef } from "react";
import { X, ArrowRight, Mountain } from "lucide-react";
import type { GearItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function GearDetailModal({ item }: { item: GearItem }) {
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState(3);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalTitleId = `gear-modal-${item.name.replace(/\s+/g, "-").toLowerCase()}`;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <>
      {/* Card */}
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={`View details for ${item.name}`}
        className="w-full text-left bg-white border-2 border-divider rounded-2xl overflow-hidden cursor-pointer hover:border-terra hover:-translate-y-0.5 transition-[border-color,transform] duration-200 group"
      >
        <div className="overflow-hidden h-[200px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${item.image}&w=400`}
            alt={item.name}
            className="w-full h-full object-cover block transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
        <div className="px-5 py-[18px]">
          <span className="inline-block font-mono text-[11px] font-medium bg-gold text-ink px-2 py-0.5 rounded-md tracking-[0.04em] mb-2.5">
            €{item.dayRate}/day
          </span>
          <div className="font-fraunces text-lg font-bold mb-1 tracking-tight">{item.name}</div>
          <p className="text-[13px] text-ink/55 leading-[1.5] mb-3.5">{item.description.slice(0, 60)}…</p>
          <div className="flex gap-2 flex-wrap mb-4">
            {item.tags.map((tag) => (
              <span key={tag} className="font-mono text-[10px] px-2 py-0.5 rounded border border-divider text-ink/45 tracking-[0.05em] uppercase">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between pt-3.5 border-t border-divider">
            <div className="text-xs text-ink/40">Deposit: {formatPrice(item.deposit)}</div>
            <div className="flex items-center gap-1 text-[13px] font-semibold text-terra group-hover:gap-2 transition-[gap]">
              View details
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[300] flex items-stretch sm:items-center justify-center sm:p-5 bg-dark/65 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-bone w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-[860px] sm:rounded-2xl overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
            {/* Header */}
            <div className="sticky top-0 z-10 bg-bone flex items-center justify-between px-5 sm:px-7 py-4 sm:py-6 border-b-2 border-divider">
              <div className="flex items-center gap-2">
                <Mountain className="w-5 h-5 text-forest" strokeWidth={1.5} />
                <span className="font-semibold text-sm">Gear details</span>
              </div>
              <button
                onClick={handleClose}
                aria-label="Close gear details"
                className="w-9 h-9 border-2 border-divider rounded-lg flex items-center justify-center cursor-pointer bg-transparent hover:border-ink transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_320px]">
              {/* Gallery */}
              <div className="p-5 sm:p-7">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${item.image}&w=700`}
                  alt={item.name}
                  className="w-full rounded-xl border-2 border-divider object-cover h-[220px] sm:h-[260px] block mb-2.5"
                />
                {item.sizes && (
                  <div className="flex gap-2 flex-wrap mt-4">
                    <span className="text-sm text-ink/50 mr-1">Sizes:</span>
                    {item.sizes.map((s) => (
                      <span key={s} className="font-mono text-xs px-2 py-0.5 border border-divider rounded">{s}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="px-5 sm:px-7 py-5 sm:py-7 border-t-2 md:border-t-0 md:border-l-2 border-divider">
                <span className="inline-block font-mono text-xs bg-gold text-ink px-2.5 py-1 rounded-md mb-3">
                  €{item.dayRate}/day
                </span>
                <h2 className="font-fraunces font-bold tracking-tight mb-2.5" style={{ fontSize: "clamp(24px, 7vw, 28px)" }}>
                  {item.name}
                </h2>
                <p className="text-sm leading-[1.7] text-ink/65 mb-5">{item.description}</p>

                {/* Specs */}
                <div className="mb-5">
                  <div className="font-mono text-[11px] text-ink/40 tracking-[0.1em] uppercase mb-2.5">Specs</div>
                  {Object.entries(item.specs).map(([k, v]) => (
                    <div key={k} className="flex justify-between py-2 border-b border-divider last:border-0 text-[13px]">
                      <span className="text-ink/50">{k}</span>
                      <span className="font-medium font-mono text-xs">{v}</span>
                    </div>
                  ))}
                </div>

                {/* Day rate calculator */}
                <div className="bg-white border-2 border-divider rounded-xl p-4 sm:p-5 mt-5">
                  <div className="font-mono text-[11px] text-ink/40 tracking-[0.1em] uppercase mb-3.5">Day Rate Calculator</div>
                  <div className="flex items-center gap-3 mb-3.5">
                    <span className="text-sm flex-1">Number of days</span>
                    <div className="flex items-center border-2 border-divider rounded-lg overflow-hidden">
                      <button
                        onClick={() => setDays((d) => Math.max(1, d - 1))}
                        aria-label="Decrease days"
                        className="w-9 h-9 bg-transparent border-none text-lg flex items-center justify-center cursor-pointer hover:bg-ink/5"
                      >
                        −
                      </button>
                      <span className="w-10 text-center font-mono text-base font-medium border-x border-divider leading-[36px]" aria-live="polite" aria-atomic="true">
                        {days}
                      </span>
                      <button
                        onClick={() => setDays((d) => d + 1)}
                        aria-label="Increase days"
                        className="w-9 h-9 bg-transparent border-none text-lg flex items-center justify-center cursor-pointer hover:bg-ink/5"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline pt-3 border-t-2 border-ink">
                    <span className="text-sm font-semibold">Total</span>
                    <span className="font-fraunces text-[24px] sm:text-[28px] font-bold">{formatPrice(days * item.dayRate)}</span>
                  </div>
                  <div className="text-xs text-ink/40 text-right mt-1.5">
                    + {formatPrice(item.deposit)} deposit (refunded)
                  </div>
                  <a
                    href="https://wa.me/38348300155"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-brand text-white py-3.5 rounded-xl font-semibold text-sm text-center no-underline hover:opacity-88 transition-opacity mt-3.5"
                  >
                    Add to Booking
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
