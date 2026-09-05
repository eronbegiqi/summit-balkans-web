"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImageListItem } from "@/lib/db/queries/gallery";

type Props = {
  images: GalleryImageListItem[];
  startIndex: number;
  onClose: () => void;
};

export function Lightbox({ images, startIndex, onClose }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, startIndex });
  const [selected, setSelected] = useState(startIndex);
  const [visible, setVisible] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<Element | null>(null);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  // Entrance transition + focus management, matching the hand-rolled modal
  // convention used elsewhere (GearDetailModal): capture focus, restore on
  // close, Escape to dismiss.
  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => setVisible(true));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      if (previouslyFocused.current instanceof HTMLElement) previouslyFocused.current.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = images[selected];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={current?.title ?? "Photo"}
      className="fixed inset-0 z-[600] flex flex-col bg-ink/95 backdrop-blur-sm transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 shrink-0">
        <span className="font-mono text-xs text-white/50 tracking-[0.08em]">
          {selected + 1} / {images.length}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close fullscreen view"
          className="w-10 h-10 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>

      {/* Slides */}
      <div className="relative flex-1 min-h-0 flex items-center">
        <div className="overflow-hidden w-full h-full" ref={emblaRef}>
          <div className="flex h-full">
            {images.map((img) => (
              <div key={img.id} className="relative flex-[0_0_100%] h-full">
                <Image
                  src={img.imageUrl}
                  alt={img.altText ?? img.title ?? "Gallery photo"}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Previous photo"
              className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Next photo"
              className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>

      {/* Caption */}
      {current?.title && (
        <div className="px-5 py-4 text-center text-sm text-white/60 shrink-0">{current.title}</div>
      )}
    </div>
  );
}
