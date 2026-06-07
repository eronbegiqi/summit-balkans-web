"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Users, ArrowRight, Mountain } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { DifficultyDots } from "@/components/ui/DifficultyDots";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/utils";

type TourType = "ALL" | "GUIDED" | "SELF_GUIDED";
type TourVariant = "ALL" | "QUICK" | "REGULAR" | "CLASSIC";

const FALLBACK_IMAGES: Record<string, string> = {
  "peaks-of-the-balkans-quick":          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  "peaks-of-the-balkans-regular":        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
  "peaks-of-the-balkans-classic":        "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800&q=80",
  "peaks-of-the-balkans-quick-self-guided":   "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80",
  "peaks-of-the-balkans-regular-self-guided": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
  "peaks-of-the-balkans-classic-self-guided": "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800&q=80",
  _guided:    "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
  _selfguided: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  _default:   "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
};

function getTourImage(tour: Tour): string {
  if (tour.featuredImageUrl) return tour.featuredImageUrl;
  if (FALLBACK_IMAGES[tour.slug]) return FALLBACK_IMAGES[tour.slug];
  if (tour.tourType === "SELF_GUIDED") return FALLBACK_IMAGES._selfguided;
  return FALLBACK_IMAGES._guided;
}

interface Tour {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  featuredImageUrl: string | null;
  country: string | null;
  durationDays: number;
  difficulty: number;
  pricePerPersonEur: string;
  selfGuidedPriceEur: string | null;
  minParticipants: number | null;
  groupSizeMax: number | null;
  tourType: "GUIDED" | "SELF_GUIDED" | null;
  tourVariant: "QUICK" | "REGULAR" | "CLASSIC" | "OTHER" | null;
  isFlagship: boolean | null;
  bestSeasonStart: string | null;
  bestSeasonEnd: string | null;
  totalDistanceKm: string | null;
  maxElevationM: number | null;
  nextDeparture?: string;
  spotsLeft?: number;
}

const VARIANT_LABELS: Record<string, string> = {
  QUICK: "Quick",
  REGULAR: "Regular",
  CLASSIC: "Classic",
  OTHER: "",
};

const VARIANT_DESCRIPTIONS: Record<string, string> = {
  QUICK: "7 days",
  REGULAR: "11 days",
  CLASSIC: "16 days",
};

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<TourType>("ALL");
  const [variantFilter, setVariantFilter] = useState<TourVariant>("ALL");

  useEffect(() => {
    const params = new URLSearchParams();
    if (typeFilter !== "ALL") params.set("type", typeFilter);
    if (variantFilter !== "ALL") params.set("variant", variantFilter);
    fetch(`/api/public/tours?${params}`)
      .then((r) => r.json())
      .then((data: Tour[]) => { setTours(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [typeFilter, variantFilter]);

  const guided = tours.filter((t) => t.tourType === "GUIDED" || !t.tourType);
  const selfGuided = tours.filter((t) => t.tourType === "SELF_GUIDED");
  const showGrouped = typeFilter === "ALL";

  return (
    <>
      {/* Hero */}
      <section className="bg-bone border-b-2 border-divider pt-[72px]">
        <div className="max-w-content mx-auto px-6 md:px-10 py-16">
          <SectionLabel>All Tours</SectionLabel>
          <h1
            className="font-fraunces font-bold tracking-tight leading-[1.05] max-w-[680px]"
            style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
          >
            Guided & self-guided tours across the Balkans.
          </h1>
          <p className="text-xl text-ink/55 mt-4 max-w-[540px]">
            Small groups, local guides, fixed-departure schedules. Pick your trail and style.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 bg-bone/95 backdrop-blur border-b-2 border-divider">
        <div className="max-w-content mx-auto px-6 md:px-10 py-3 flex flex-wrap items-center gap-3">
          {/* Type toggle */}
          <div className="flex items-center gap-1 bg-ink/5 rounded-xl p-1">
            {(["ALL", "GUIDED", "SELF_GUIDED"] as TourType[]).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                  typeFilter === t
                    ? "bg-white text-ink shadow-sm font-semibold"
                    : "text-ink/50 hover:text-ink"
                )}
              >
                {t === "ALL" ? "All" : t === "GUIDED" ? "Guided" : "Self-Guided"}
              </button>
            ))}
          </div>

          {/* Variant pills */}
          <div className="flex items-center gap-1.5">
            {(["ALL", "QUICK", "REGULAR", "CLASSIC"] as TourVariant[]).map((v) => (
              <button
                key={v}
                onClick={() => setVariantFilter(v)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm border-2 transition-all",
                  variantFilter === v
                    ? "border-brand bg-brand text-white font-semibold"
                    : "border-divider text-ink/55 hover:border-ink/40"
                )}
              >
                {v === "ALL" ? "Any length" : `${VARIANT_LABELS[v]} (${VARIANT_DESCRIPTIONS[v]})`}
              </button>
            ))}
          </div>

          {!loading && (
            <span className="ml-auto font-mono text-xs text-ink/35">
              {tours.length} tour{tours.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </section>

      {/* Tour cards */}
      <section className="py-16 md:py-20">
        <div className="max-w-content mx-auto px-6 md:px-10">
          {loading ? (
            <div className="flex flex-col gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[280px] rounded-card-hero bg-ink/5 animate-pulse" />
              ))}
            </div>
          ) : tours.length === 0 ? (
            <div className="text-center py-24 text-ink/40">
              <Mountain className="w-10 h-10 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No tours match this filter.</p>
              <button
                onClick={() => { setTypeFilter("ALL"); setVariantFilter("ALL"); }}
                className="mt-4 text-brand underline text-sm"
              >
                Clear filters
              </button>
            </div>
          ) : showGrouped ? (
            <div className="flex flex-col gap-16">
              {guided.length > 0 && (
                <div>
                  <SectionLabel>Guided Tours</SectionLabel>
                  <div className="flex flex-col gap-8 mt-4">
                    {guided.map((tour, i) => <TourCard key={tour.id} tour={tour} priority={i === 0} />)}
                  </div>
                </div>
              )}
              {selfGuided.length > 0 && (
                <div>
                  <SectionLabel>Self-Guided Tours</SectionLabel>
                  <div className="flex flex-col gap-8 mt-4">
                    {selfGuided.map((tour) => <TourCard key={tour.id} tour={tour} />)}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {tours.map((tour, i) => <TourCard key={tour.id} tour={tour} priority={i === 0} />)}
            </div>
          )}

          {/* Private trips teaser */}
          <div className="mt-16 border-2 border-divider rounded-card-hero overflow-hidden bg-dark p-8 md:p-12 text-center">
            <div className="font-mono text-[11px] text-gold tracking-[0.12em] uppercase mb-4">Don&apos;t see the right trip?</div>
            <h2 className="font-fraunces text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">Design your own.</h2>
            <p className="text-base text-white/55 max-w-md mx-auto mb-8">
              Private trips from 2 people, any duration, any destination in the region. We reply within 24 hours.
            </p>
            <Link href="/private-trips" className="inline-flex items-center gap-2 bg-brand text-white px-7 py-4 rounded-xl font-semibold no-underline hover:opacity-90 transition-opacity">
              Plan a Private Trip <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function TourCard({ tour, priority = false }: { tour: Tour; priority?: boolean }) {
  const isGuided = tour.tourType !== "SELF_GUIDED";
  const variant = tour.tourVariant && tour.tourVariant !== "OTHER" ? VARIANT_LABELS[tour.tourVariant] : null;
  const price = isGuided ? tour.pricePerPersonEur : (tour.selfGuidedPriceEur ?? tour.pricePerPersonEur);

  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="grid grid-cols-1 md:grid-cols-[420px_1fr] border-2 border-divider rounded-card-hero overflow-hidden bg-white no-underline hover:border-brand hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getTourImage(tour)}
          alt={tour.title}
          className="w-full h-[240px] md:h-[300px] object-cover block"
          loading={priority ? "eager" : "lazy"}
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={cn(
            "font-mono text-[10px] font-semibold px-2 py-1 rounded tracking-[0.06em] uppercase",
            isGuided ? "bg-brand text-white" : "bg-accent text-ink"
          )}>
            {isGuided ? "Guided" : "Self-Guided"}
          </span>
          {variant && (
            <span className="font-mono text-[10px] font-medium px-2 py-1 rounded tracking-[0.06em] uppercase bg-ink/70 text-white">
              {variant}
            </span>
          )}
          {tour.isFlagship && (
            <span className="font-mono text-[10px] font-medium px-2 py-1 rounded tracking-[0.06em] uppercase bg-gold text-ink">
              Popular
            </span>
          )}
        </div>
      </div>

      <div className="p-6 md:py-8 md:pr-8 md:pl-0 flex flex-col justify-center">
        <DifficultyDots level={tour.difficulty as 1 | 2 | 3 | 4 | 5} className="mb-3" />
        <h2 className="font-fraunces text-2xl md:text-3xl font-bold tracking-tight mb-2">{tour.title}</h2>
        {tour.excerpt && (
          <p className="text-sm md:text-base text-ink/60 leading-relaxed mb-5 line-clamp-2">{tour.excerpt}</p>
        )}

        <div className="flex flex-wrap gap-4 mb-5 text-sm text-ink/50">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
            {tour.durationDays} days
          </div>
          {tour.totalDistanceKm && (
            <div className="flex items-center gap-1.5">
              <Mountain className="w-3.5 h-3.5" strokeWidth={1.5} />
              {Number(tour.totalDistanceKm).toFixed(0)} km
            </div>
          )}
          {tour.minParticipants && (
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
              Min. {tour.minParticipants} pax
            </div>
          )}
          {tour.bestSeasonStart && tour.bestSeasonEnd && (
            <span className="font-mono text-xs">{tour.bestSeasonStart}–{tour.bestSeasonEnd}</span>
          )}
        </div>

        {/* Guided vs self-guided price comparison */}
        {tour.selfGuidedPriceEur && tour.tourType === "GUIDED" && (
          <div className="flex gap-3 mb-4 text-xs text-ink/50">
            <span className="text-ink font-semibold">Guided from {formatPrice(Number(tour.pricePerPersonEur))}</span>
            <span>·</span>
            <span>Self-guided from {formatPrice(Number(tour.selfGuidedPriceEur))}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
          <div className="font-fraunces text-2xl md:text-3xl font-bold">
            {formatPrice(Number(price))}
            <span className="font-inter text-xs md:text-sm font-normal text-ink/45"> from / person</span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-brand font-semibold text-sm group-hover:gap-2.5 transition-all">
            View Tour <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
          </span>
        </div>

        {tour.nextDeparture && (
          <p className="mt-3 font-mono text-[11px] text-ink/40">
            Next departure: <span className="text-brand font-semibold">{tour.nextDeparture}</span>
            {tour.spotsLeft !== undefined && ` · ${tour.spotsLeft} spots left`}
          </p>
        )}
      </div>
    </Link>
  );
}
