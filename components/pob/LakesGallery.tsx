"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=85", caption: "Valbona Valley", country: "Albania" },
  { src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=85", caption: "Theth Valley", country: "Albania" },
  { src: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1400&q=85", caption: "Gjeravica Lakes", country: "Kosovo" },
  { src: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1400&q=85", caption: "Ropojana Lake", country: "Montenegro" },
  { src: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1400&q=85", caption: "Grebaja Valley", country: "Montenegro" },
  { src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1400&q=85", caption: "Plav Lake", country: "Montenegro" },
  { src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1400&q=85", caption: "Liqenat Lakes", country: "Kosovo" },
  { src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1400&q=85", caption: "Grunas Waterfall", country: "Albania" },
];

export function LakesGallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
  });

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="py-20 md:py-28 bg-bone overflow-hidden">
      <div className="max-w-content mx-auto px-5 md:px-10 mb-10">
        <div className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-terra mb-3">
          Lakes & Valleys
        </div>
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-fraunces text-[clamp(2rem,4vw,2.8rem)] font-bold tracking-tight">
            Water & wilderness
          </h2>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="w-10 h-10 rounded-full border-2 border-divider flex items-center justify-center text-ink/55 hover:border-ink hover:text-ink transition-all bg-white cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="w-10 h-10 rounded-full border-2 border-divider flex items-center justify-center text-ink/55 hover:border-ink hover:text-ink transition-all bg-white cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Edge-to-edge carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 pl-5 md:pl-10">
          {slides.map((slide) => (
            <div
              key={slide.caption}
              className="flex-shrink-0 w-[80vw] md:w-[560px] relative rounded-card-hero overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.src}
                alt={slide.caption}
                className="w-full h-[380px] md:h-[440px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/55 mb-1">
                  {slide.country}
                </div>
                <div className="font-fraunces text-xl font-bold text-white">{slide.caption}</div>
              </div>
            </div>
          ))}
          <div className="flex-shrink-0 w-5 md:w-10" />
        </div>
      </div>
    </section>
  );
}
