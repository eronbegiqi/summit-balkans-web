"use client";

import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

const countryFlags: Record<string, string> = {
  Albania: "🇦🇱",
  Montenegro: "🇲🇪",
  Kosovo: "🇽🇰",
};

const TOUR_IMAGES: Record<string, string> = {
  default: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
  guided: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80",
  quick: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
  regular: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80",
  classic: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=600&q=80",
  selfguided: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=600&q=80",
};

interface Departure {
  id: number;
  startDate: string;
  endDate: string;
  capacity: number;
  spotsLeft: number;
  pricePerPersonEur: string | null;
  tourId: number;
  tourSlug: string;
  tourTitle: string;
  tourCountry: string | null;
  tourFeaturedImageUrl: string | null;
  tourVariant: string | null;
  tourType: string | null;
  guidedPriceEur: string;
}

function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const endOpts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  return `${s.toLocaleDateString("en-GB", opts)} – ${e.toLocaleDateString("en-GB", endOpts)}`;
}

function getTourImage(dep: Departure): string {
  if (dep.tourFeaturedImageUrl) return dep.tourFeaturedImageUrl;
  const variant = dep.tourVariant?.toLowerCase() ?? "";
  const type = dep.tourType?.toLowerCase() ?? "";
  if (type === "self_guided") return TOUR_IMAGES.selfguided;
  if (variant === "quick") return TOUR_IMAGES.quick;
  if (variant === "regular") return TOUR_IMAGES.regular;
  if (variant === "classic") return TOUR_IMAGES.classic;
  return TOUR_IMAGES.default;
}

export function UpcomingDepartures() {
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const CARD_W = 300 + 20;

  useEffect(() => {
    fetch("/api/public/departures?limit=8")
      .then((r) => r.json())
      .then((data) => {
        setDepartures(Array.isArray(data) ? data : (data.departures ?? []));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
  }, [checkScroll, departures]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -CARD_W : CARD_W, behavior: "smooth" });
  };

  return (
    <section className="bg-bone py-16 md:py-20 border-t-2 border-divider">
      <div className="max-w-content mx-auto px-4 md:px-10 mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-fraunces text-2xl md:text-3xl font-bold tracking-tight">
            Join a scheduled group
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className={cn(
              "w-12 h-12 rounded-full bg-bone/90 backdrop-blur-sm border-2 border-mist flex items-center justify-center transition-[border-color,color]",
              canScrollLeft ? "text-ink hover:border-ink cursor-pointer" : "text-mist cursor-not-allowed opacity-40"
            )}
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className={cn(
              "w-12 h-12 rounded-full bg-bone/90 backdrop-blur-sm border-2 border-mist flex items-center justify-center transition-[border-color,color]",
              canScrollRight ? "text-ink hover:border-ink cursor-pointer" : "text-mist cursor-not-allowed opacity-40"
            )}
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth scroll-pl-4 md:scroll-pl-[max(2.5rem,_calc((100vw_-_1320px)_/_2_+_2.5rem))]"
        style={{ scrollbarWidth: "none" }}
        role="list"
        aria-label="Upcoming tour departures"
      >
        <div className="shrink-0 w-4 md:w-[max(2.5rem,_calc((100vw_-_1320px)_/_2_+_2.5rem))]" aria-hidden="true" />

        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex-none w-[260px] md:w-[300px] rounded-card border-2 border-divider bg-white overflow-hidden snap-start animate-pulse"
            >
              <div className="w-full h-[160px] md:h-[168px] bg-ink/8" />
              <div className="px-4 py-4 space-y-2">
                <div className="h-3 bg-ink/8 rounded w-3/4" />
                <div className="h-4 bg-ink/8 rounded w-full" />
                <div className="h-3 bg-ink/8 rounded w-1/2" />
              </div>
            </div>
          ))
        ) : departures.length === 0 ? (
          <div className="flex-none w-[260px] md:w-[300px] flex items-center justify-center rounded-card border-2 border-divider bg-white h-[280px] snap-start">
            <p className="text-sm text-ink/40 text-center px-6">No upcoming departures. <Link href="/contact" className="text-brand underline">Contact us</Link> for availability.</p>
          </div>
        ) : (
          departures.map((dep) => {
            const urgent = dep.spotsLeft <= 3;
            const price = dep.pricePerPersonEur ?? dep.guidedPriceEur;
            const country = dep.tourCountry ?? "";
            const countries = country.split(",").map((c) => c.trim()).filter(Boolean);
            const imgSrc = getTourImage(dep);

            return (
              <div
                key={dep.id}
                role="listitem"
                className="flex-none w-[260px] md:w-[300px] rounded-card border-2 border-divider bg-white overflow-hidden snap-start hover:border-brand hover:-translate-y-0.5 active:scale-[0.98] transition-[border-color,transform] duration-200"
              >
                <div className="relative w-full h-[160px] md:h-[168px]">
                  <Image
                    src={imgSrc}
                    alt={dep.tourTitle}
                    fill
                    sizes="(min-width: 768px) 300px, 100vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="px-4 md:px-5 py-4 md:py-[18px]">
                  <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
                    {countries.map((c) => (
                      <span
                        key={c}
                        className="font-mono text-[10px] md:text-xs font-medium px-2 py-0.5 rounded border border-mist tracking-[0.06em] uppercase"
                      >
                        {countryFlags[c] ?? ""} {c.slice(0, 3).toUpperCase()}
                      </span>
                    ))}
                    <span
                      className={cn(
                        "font-mono text-[10px] md:text-xs font-medium px-2 py-0.5 rounded ml-auto tracking-[0.04em]",
                        urgent ? "bg-warning text-ink" : "bg-ink/7 text-ink"
                      )}
                    >
                      {dep.spotsLeft}/{dep.capacity} spots
                    </span>
                  </div>

                  <div className="font-fraunces text-base md:text-lg font-semibold mb-1 tracking-tight line-clamp-1">
                    {dep.tourTitle}
                  </div>
                  <div className="font-mono text-sm text-ink/50 mb-3.5">
                    {formatDateRange(dep.startDate, dep.endDate)}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="font-fraunces text-lg md:text-[22px] font-bold leading-none">
                      {formatPrice(Number(price))}{" "}
                      <span className="font-inter text-xs font-normal text-ink/45">/ person</span>
                    </div>
                    <Link
                      href={`/tours/${dep.tourSlug}`}
                      className="flex items-center gap-1 text-[13px] font-semibold text-brand no-underline border-2 border-brand px-3 py-1.5 rounded-lg hover:bg-brand hover:text-white transition-[background-color,color] whitespace-nowrap"
                      aria-label={`Book ${dep.tourTitle}`}
                    >
                      Book
                      <ArrowRight className="w-3 h-3" strokeWidth={2} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}

        <div className="shrink-0 w-4 md:w-10" aria-hidden="true" />
      </div>
    </section>
  );
}
