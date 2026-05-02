"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { reviews } from "@/data/reviews";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface Review { id: string; name: string; country: string; quote: string; avatarInitial: string; tour?: string; }

function TestiCard({ review }: { review: Review }) {
  return (
    <div className="flex-none border-2 border-divider rounded-card bg-white px-6 py-6 md:px-7 md:py-7">
      <div className="text-warning text-sm tracking-[2px] mb-3">★★★★★</div>
      <p className="text-[15px] leading-[1.65] text-ink/75 mb-5 italic">
        &ldquo;{review.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-forest flex items-center justify-center font-fraunces text-base font-bold text-white flex-shrink-0">
          {review.avatarInitial}
        </div>
        <div>
          <div className="text-sm font-semibold">{review.name}</div>
          <div className="text-xs text-ink/45 font-mono">
            {review.country}{review.tour ? ` · ${review.tour}` : ""}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileCarousel() {
  const autoplay = Autoplay({ delay: 6000, stopOnInteraction: true, stopOnMouseEnter: true });
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", slidesToScroll: 1 },
    [autoplay]
  );
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <div>
      <div ref={emblaRef} className="overflow-hidden px-4">
        <div className="flex gap-4">
          {reviews.map((r) => (
            <div key={r.id} className="flex-none w-[85vw] sm:w-[60vw]">
              <TestiCard review={r} />
            </div>
          ))}
        </div>
      </div>
      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Review slides">
        {reviews.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === selected}
            aria-label={`Review ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 border-none cursor-pointer ${
              i === selected ? "w-6 bg-brand" : "w-1.5 bg-mist"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function DesktopMarquee() {
  const doubled = [...reviews, ...reviews];
  return (
    <div className="relative overflow-hidden">
      <div
        className="flex gap-5 w-max"
        style={{ animation: "marquee 40s linear infinite" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = "paused"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = "running"; }}
        aria-live="off"
      >
        {doubled.map((r, i) => (
          <div key={`${r.id}-${i}`} className="flex-none w-[340px] md:w-[360px]">
            <TestiCard review={r} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-bone overflow-hidden border-t-2 border-divider">
      <div className="max-w-content mx-auto px-4 md:px-10 mb-10 md:mb-12">
        <SectionLabel>Traveller Reviews</SectionLabel>
        <h2 className="font-fraunces font-bold tracking-tight" style={{ fontSize: "clamp(28px, 4vw, 48px)" }}>
          From the trail
        </h2>
      </div>

      {/* Mobile (< 1024px): Embla carousel */}
      <div className="block lg:hidden">
        <MobileCarousel />
      </div>

      {/* Desktop (1024px+): infinite marquee */}
      <div className="hidden lg:block">
        <DesktopMarquee />
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          [style*="marquee"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
