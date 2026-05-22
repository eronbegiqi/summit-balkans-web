"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { getUpcomingDepartures } from "@/data/tours";
import { formatDateRange, formatPrice, isLowAvailability } from "@/lib/utils";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/utils";

const countryFlags: Record<string, string> = {
  Albania: "🇦🇱",
  Montenegro: "🇲🇪",
  Kosovo: "🇽🇰",
};

export function UpcomingDepartures() {
  const departures = getUpcomingDepartures(6);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const CARD_W = 300 + 20; // card width + gap

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -CARD_W : CARD_W, behavior: "smooth" });
  };

  return (
    <section className="bg-bone py-16 md:py-20 border-t-2 border-divider">
      <div className="max-w-content mx-auto px-4 md:px-10 mb-6 flex items-end justify-between gap-4">
        <div>
          <SectionLabel>Next Departures</SectionLabel>
          <h2 className="font-fraunces text-2xl md:text-3xl font-bold tracking-tight">
            Join a scheduled group
          </h2>
        </div>
        {/* Arrow buttons — desktop only */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className={cn(
              "w-12 h-12 rounded-full bg-bone/90 backdrop-blur-sm border-2 border-mist flex items-center justify-center transition-all",
              canScrollLeft
                ? "text-ink hover:border-ink cursor-pointer"
                : "text-mist cursor-not-allowed opacity-40"
            )}
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className={cn(
              "w-12 h-12 rounded-full bg-bone/90 backdrop-blur-sm border-2 border-mist flex items-center justify-center transition-all",
              canScrollRight
                ? "text-ink hover:border-ink cursor-pointer"
                : "text-mist cursor-not-allowed opacity-40"
            )}
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth scroll-pl-4 md:scroll-pl-[max(2.5rem,_calc((100vw_-_1320px)_/_2_+_2.5rem))]"
        style={{ scrollbarWidth: "none" }}
        role="list"
        aria-label="Upcoming tour departures"
      >
        {/* Leading spacer — aligns first card with section heading on all viewport widths */}
        <div className="shrink-0 w-4 md:w-[max(2.5rem,_calc((100vw_-_1320px)_/_2_+_2.5rem))]" aria-hidden="true" />
        {departures.map((dep) => {
          const urgent = isLowAvailability(dep.spotsLeft);
          return (
            <div
              key={dep.id}
              role="listitem"
              className="flex-none w-[260px] md:w-[300px] rounded-card border-2 border-divider bg-white overflow-hidden snap-start hover:border-brand hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${dep.tour.coverImage}&w=400`}
                alt={dep.tour.name}
                className="w-full h-[160px] md:h-[168px] object-cover block"
                loading="lazy"
              />
              <div className="px-4 md:px-5 py-4 md:py-[18px]">
                <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
                  {dep.tour.country.map((c) => (
                    <span
                      key={c}
                      className="font-mono text-[10px] md:text-xs font-medium px-2 py-0.5 rounded border border-mist tracking-[0.06em] uppercase"
                    >
                      {countryFlags[c]} {c.slice(0, 3).toUpperCase()}
                    </span>
                  ))}
                  <span
                    className={cn(
                      "font-mono text-[10px] md:text-xs font-medium px-2 py-0.5 rounded ml-auto tracking-[0.04em]",
                      urgent ? "bg-warning text-ink" : "bg-ink/7 text-ink"
                    )}
                  >
                    {dep.spotsLeft}/{dep.spotsTotal} spots
                  </span>
                </div>

                <div className="font-fraunces text-base md:text-lg font-semibold mb-1 tracking-tight line-clamp-1">
                  {dep.tour.name}
                </div>
                <div className="font-mono text-sm text-ink/50 mb-3.5">
                  {formatDateRange(dep.startDate, dep.endDate)}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="font-fraunces text-lg md:text-[22px] font-bold leading-none">
                    {formatPrice(dep.price)}{" "}
                    <span className="font-inter text-xs font-normal text-ink/45">/ person</span>
                  </div>
                  <Link
                    href={`/tours/${dep.tourSlug}`}
                    className="flex items-center gap-1 text-[13px] font-semibold text-brand no-underline border-2 border-brand px-3 py-1.5 rounded-lg hover:bg-brand hover:text-white transition-all whitespace-nowrap"
                    aria-label={`Book ${dep.tour.name}`}
                  >
                    Book
                    <ArrowRight className="w-3 h-3" strokeWidth={2} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
        {/* Trailing spacer */}
        <div className="shrink-0 w-4 md:w-10" aria-hidden="true" />
      </div>
    </section>
  );
}
