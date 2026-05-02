import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { tours } from "@/data/tours";
import { formatPrice, isLowAvailability } from "@/lib/utils";
import { DifficultyIndicator } from "@/components/ui/DifficultyIndicator";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function FeaturedTrips() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-4 md:px-10">
        <div className="mb-12 md:mb-16">
          <SectionLabel>Featured Routes</SectionLabel>
          <h2
            className="font-fraunces font-bold tracking-tight leading-[1.1]"
            style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
          >
            Trips worth the journey
          </h2>
        </div>

        <div className="flex flex-col gap-12 md:gap-16">
          {tours.map((tour, i) => {
            const urgent = isLowAvailability(tour.spotsLeft);
            return (
              <div key={tour.slug}>
                {/* ── Mobile: vertical card ────────────────────────────────── */}
                <div className="block md:hidden border-2 border-divider rounded-card-hero overflow-hidden bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${tour.coverImage}&w=800`}
                    alt={tour.name}
                    className="w-full h-[220px] object-cover block"
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                  <div className="p-5">
                    <DifficultyIndicator level={tour.difficulty} className="mb-3" animate />
                    <h3 className="font-fraunces text-2xl font-bold tracking-tight mb-2">{tour.name}</h3>
                    <div className="flex gap-4 mb-3 text-sm text-ink/50">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" strokeWidth={1.5} />{tour.duration} days</span>
                      <span>{tour.country.join(" · ")}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-ink/65 mb-4">{tour.tagline}</p>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <div className="font-fraunces text-2xl font-bold">
                          {formatPrice(tour.priceFrom)}
                          <span className="font-inter text-xs font-normal text-ink/45"> from/person</span>
                        </div>
                        <span className={`font-mono text-[10px] font-medium px-2 py-0.5 rounded mt-1 inline-block ${urgent ? "bg-warning text-ink" : "bg-ink/7 text-ink"}`}>
                          {tour.spotsLeft}/{tour.spotsTotal} spots
                        </span>
                      </div>
                      <Link href={`/tours/${tour.slug}`} className="flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-xl font-semibold text-sm no-underline hover:bg-brand-700">
                        View Trip <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* ── Desktop: alternating layout ──────────────────────────── */}
                <div
                  className={`hidden md:grid grid-cols-2 gap-16 items-center ${i % 2 === 1 ? "[direction:rtl]" : ""}`}
                >
                  <div className={`rounded-card-hero overflow-hidden border-2 border-divider aspect-[4/3] ${i % 2 === 1 ? "[direction:ltr]" : ""}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`${tour.coverImage}&w=800`}
                      alt={tour.name}
                      className="w-full h-full object-cover block"
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  </div>
                  <div className={i % 2 === 1 ? "[direction:ltr]" : ""}>
                    <DifficultyIndicator level={tour.difficulty} className="mb-4" animate />
                    <h3 className="font-fraunces font-bold tracking-tight leading-[1.1] mb-4" style={{ fontSize: "clamp(28px, 3vw, 42px)" }}>
                      {tour.name}
                    </h3>
                    <div className="flex gap-5 mb-5">
                      <div className="flex items-center gap-1.5 text-sm text-ink/55">
                        <Clock className="w-4 h-4" strokeWidth={1.5} />
                        {tour.duration} days
                      </div>
                      <div className="text-sm text-ink/55">{tour.country.join(" · ")}</div>
                    </div>
                    <p className="text-base leading-[1.65] text-ink/68 mb-7">{tour.tagline}</p>
                    <div className="flex items-center gap-5 flex-wrap">
                      <div className="font-fraunces text-4xl font-bold">
                        {formatPrice(tour.priceFrom)}{" "}
                        <span className="font-inter text-sm font-normal text-ink/45">from / person</span>
                      </div>
                      <span className={`font-mono text-xs font-medium px-2.5 py-1 rounded ${urgent ? "bg-warning text-ink" : "bg-ink/7 text-ink"}`}>
                        {tour.spotsLeft}/{tour.spotsTotal} spots · {new Date(tour.nextDeparture).toLocaleString("en-GB", { month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <Link href={`/tours/${tour.slug}`} className="mt-6 inline-flex items-center gap-2 bg-brand text-white px-7 py-3.5 rounded-xl font-semibold text-[15px] no-underline hover:bg-brand-700 transition-colors">
                      View Trip <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
