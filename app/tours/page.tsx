import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { tours } from "@/data/tours";
import { formatPrice } from "@/lib/utils";
import { DifficultyDots } from "@/components/ui/DifficultyDots";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "Guided Tours — Peaks, Via Ferrata & More",
  description: "Browse all Summit Balkans guided tours in Albania, Montenegro and Kosovo. Small groups, local guides.",
};

export default function ToursPage() {
  return (
    <>
      <section className="bg-bone border-b-2 border-divider pt-[72px]">
        <div className="max-w-content mx-auto px-10 py-16">
          <SectionLabel>All Tours</SectionLabel>
          <h1
            className="font-fraunces font-bold tracking-tight leading-[1.05] max-w-[680px]"
            style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
          >
            Guided tours across the Balkans.
          </h1>
          <p className="text-xl text-ink/55 mt-4 max-w-[520px]">
            Small groups, local guides, fixed-departure schedules. Pick your trail.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-content mx-auto px-10 flex flex-col gap-12">
          {tours.map((tour, i) => (
            <Link
              key={tour.slug}
              href={`/tours/${tour.slug}`}
              className="grid grid-cols-[400px_1fr] gap-10 border-2 border-divider rounded-card-hero overflow-hidden bg-white no-underline hover:border-terra hover:-translate-y-0.5 transition-all duration-200 group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${tour.coverImage}&w=600`}
                alt={tour.name}
                className="w-full h-full object-cover block"
                style={{ maxHeight: 280 }}
                loading={i === 0 ? "eager" : "lazy"}
              />
              <div className="py-8 pr-8 flex flex-col justify-center">
                <DifficultyDots level={tour.difficulty} className="mb-4" />
                <h2 className="font-fraunces text-4xl font-bold tracking-tight mb-3">{tour.name}</h2>
                <p className="text-base text-ink/60 leading-relaxed mb-6 max-w-[520px]">{tour.tagline}</p>

                <div className="flex gap-6 mb-6 text-sm text-ink/50">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" strokeWidth={1.5} />
                    {tour.duration} days
                  </div>
                  <div>{tour.country.join(" · ")}</div>
                  <div className="font-mono text-xs">Max {tour.spotsTotal} travellers</div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="font-fraunces text-3xl font-bold">
                    {formatPrice(tour.priceFrom)}
                    <span className="font-inter text-sm font-normal text-ink/45"> from / person</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-terra font-semibold text-sm group-hover:gap-2.5 transition-all">
                    View Tour <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {/* Private trips teaser */}
          <div className="border-2 border-divider rounded-card-hero overflow-hidden bg-dark p-12 text-center">
            <div className="font-mono text-[11px] text-gold tracking-[0.12em] uppercase mb-4">Don&apos;t see the right trip?</div>
            <h2 className="font-fraunces text-4xl font-bold text-white tracking-tight mb-4">Design your own.</h2>
            <p className="text-base text-white/55 max-w-md mx-auto mb-8">
              Private trips from 2 people, any duration, any destination in the region. We reply within 24 hours.
            </p>
            <Link href="/private-trips" className="inline-flex items-center gap-2 bg-terra text-white px-7 py-4 rounded-xl font-semibold no-underline hover:opacity-90">
              Plan a Private Trip <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
