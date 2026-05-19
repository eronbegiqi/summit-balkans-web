"use client";

import { useState } from "react";
import { X, ArrowRight, Mountain, ChevronLeft, ChevronRight, MessageCircle, CalendarDays } from "lucide-react";
import type { GearItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { CONTACT } from "@/lib/constants";

function ImageSlider({ images, name }: { images: string[]; name: string }) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  if (images.length === 1) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`${images[0]}&w=700`}
        alt={name}
        className="w-full rounded-xl border-2 border-divider object-cover h-[260px] block"
      />
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden border-2 border-divider h-[260px] group">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${images[current]}&w=700`}
        alt={`${name} — image ${current + 1}`}
        className="w-full h-full object-cover transition-opacity duration-300"
      />

      {/* Prev / next */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-4 h-4 text-ink" strokeWidth={2} />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none"
        aria-label="Next image"
      >
        <ChevronRight className="w-4 h-4 text-ink" strokeWidth={2} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer border-none p-0 ${
              i === current ? "bg-white w-4" : "bg-white/50"
            }`}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm rounded-md px-2 py-0.5">
        <span className="font-mono text-[10px] text-white">
          {current + 1}/{images.length}
        </span>
      </div>
    </div>
  );
}

export function GearDetailModal({ item }: { item: GearItem }) {
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState(3);

  const images = item.images?.length ? item.images : [item.image];
  const total = days * item.dayRate;

  const whatsappMessage = encodeURIComponent(
    `Hi! I'd like to rent the *${item.name}* for *${days} day${days !== 1 ? "s" : ""}* (total: €${total} + €${item.deposit} deposit). Can you help me book this?`
  );
  const whatsappUrl = `${CONTACT.whatsapp}?text=${whatsappMessage}`;

  return (
    <>
      {/* Card */}
      <div
        onClick={() => setOpen(true)}
        className="bg-white border-2 border-divider rounded-2xl overflow-hidden cursor-pointer hover:border-terra hover:-translate-y-0.5 transition-all duration-200 group"
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
            <div className="flex items-center gap-1 text-[13px] font-semibold text-terra group-hover:gap-2 transition-all">
              View details
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-dark/65 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-bone rounded-2xl max-w-[900px] w-full max-h-[92vh] overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b-2 border-divider">
              <div className="flex items-center gap-2">
                <Mountain className="w-5 h-5 text-forest" strokeWidth={1.5} />
                <span className="font-semibold text-sm">Gear details</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-9 h-9 border-2 border-divider rounded-lg flex items-center justify-center cursor-pointer bg-transparent hover:border-ink transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            {/* Body — stacks on mobile, side-by-side on md+ */}
            <div className="flex flex-col md:grid md:[grid-template-columns:1fr_300px]">
              {/* Gallery + specs */}
              <div className="p-6">
                <ImageSlider images={images} name={item.name} />

                {item.sizes && (
                  <div className="flex gap-2 flex-wrap mt-5">
                    <span className="text-sm text-ink/50 mr-1 self-center">Sizes:</span>
                    {item.sizes.map((s) => (
                      <span key={s} className="font-mono text-xs px-2 py-0.5 border border-divider rounded">{s}</span>
                    ))}
                  </div>
                )}

                {/* Specs — shown below image on mobile */}
                <div className="mt-6 md:hidden">
                  <div className="font-mono text-[11px] text-ink/40 tracking-[0.1em] uppercase mb-2.5">Specs</div>
                  {Object.entries(item.specs).map(([k, v]) => (
                    <div key={k} className="flex justify-between py-2 border-b border-divider last:border-0 text-[13px]">
                      <span className="text-ink/50">{k}</span>
                      <span className="font-medium font-mono text-xs">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info panel */}
              <div className="px-6 py-6 border-t-2 md:border-t-0 md:border-l-2 border-divider">
                <span className="inline-block font-mono text-xs bg-gold text-ink px-2.5 py-1 rounded-md mb-3">
                  €{item.dayRate}/day
                </span>
                <h2 className="font-fraunces text-[26px] font-bold tracking-tight mb-2.5">{item.name}</h2>
                <p className="text-sm leading-[1.7] text-ink/65 mb-5">{item.description}</p>

                {/* Specs — desktop */}
                <div className="mb-5 hidden md:block">
                  <div className="font-mono text-[11px] text-ink/40 tracking-[0.1em] uppercase mb-2.5">Specs</div>
                  {Object.entries(item.specs).map(([k, v]) => (
                    <div key={k} className="flex justify-between py-2 border-b border-divider last:border-0 text-[13px]">
                      <span className="text-ink/50">{k}</span>
                      <span className="font-medium font-mono text-xs">{v}</span>
                    </div>
                  ))}
                </div>

                {/* Day rate calculator */}
                <div className="bg-white border-2 border-divider rounded-xl p-5">
                  <div className="font-mono text-[11px] text-ink/40 tracking-[0.1em] uppercase mb-3.5">
                    Rental Calculator
                  </div>
                  <div className="flex items-center gap-3 mb-3.5">
                    <span className="text-sm flex-1">Number of days</span>
                    <div className="flex items-center border-2 border-divider rounded-lg overflow-hidden">
                      <button
                        onClick={() => setDays((d) => Math.max(1, d - 1))}
                        className="w-9 h-9 bg-transparent border-none text-lg flex items-center justify-center cursor-pointer hover:bg-ink/5"
                      >
                        −
                      </button>
                      <span className="w-10 text-center font-mono text-base font-medium border-x border-divider leading-[36px]">
                        {days}
                      </span>
                      <button
                        onClick={() => setDays((d) => d + 1)}
                        className="w-9 h-9 bg-transparent border-none text-lg flex items-center justify-center cursor-pointer hover:bg-ink/5"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline pt-3 border-t-2 border-ink mb-1">
                    <span className="text-sm font-semibold">Rental total</span>
                    <span className="font-fraunces text-[26px] font-bold">{formatPrice(total)}</span>
                  </div>
                  <div className="text-xs text-ink/40 text-right mb-4">
                    + {formatPrice(item.deposit)} refundable deposit
                  </div>

                  {/* How to book note */}
                  <div className="bg-bone rounded-lg p-3 mb-3 flex items-start gap-2.5">
                    <CalendarDays className="w-4 h-4 text-terra mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <p className="text-[12px] text-ink/55 leading-relaxed">
                      Gear-only rentals are confirmed via WhatsApp. Tell us your rental dates and pickup location.
                    </p>
                  </div>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white border-2 border-[#25D366] py-3.5 rounded-xl font-semibold text-sm text-center no-underline hover:bg-[#1ebe5d] hover:border-[#1ebe5d] transition-colors mt-1"
                  >
                    <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                    Book via WhatsApp
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
