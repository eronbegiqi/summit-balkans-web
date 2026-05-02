import { tours } from "@/data/tours";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export function RelatedTrips() {
  const related = tours.filter((t) => t.slug !== "peaks-of-the-balkans").slice(0, 2);

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-content mx-auto px-5 md:px-10">
        <div className="mb-10">
          <div className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-terra mb-3">
            Also Consider
          </div>
          <h2 className="font-fraunces text-[clamp(2rem,4vw,2.8rem)] font-bold tracking-tight">
            Related trips
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {related.map((tour) => (
            <Link
              key={tour.slug}
              href={`/tours/${tour.slug}`}
              className="group relative rounded-card-hero overflow-hidden border-2 border-divider no-underline block bg-bone"
            >
              <div className="relative h-52 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tour.coverImage}
                  alt={tour.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <span className="font-mono text-[10px] text-white/60 uppercase tracking-wider">
                    {tour.country.join(" · ")}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-fraunces text-xl font-bold tracking-tight mb-1 group-hover:text-brand transition-colors">
                  {tour.name}
                </h3>
                <p className="text-[13px] text-ink/55 mb-4">{tour.tagline}</p>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold text-ink">
                    From {formatPrice(tour.priceFrom)}
                  </span>
                  <ArrowRight className="w-4 h-4 text-ink/30 group-hover:text-brand group-hover:translate-x-1 transition-all" strokeWidth={1.5} />
                </div>
              </div>
            </Link>
          ))}

          {/* Custom itinerary CTA */}
          <div className="rounded-card-hero border-2 border-dashed border-divider bg-bone p-6 flex flex-col justify-between">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-terra mb-3">
                Custom Option
              </div>
              <h3 className="font-fraunces text-xl font-bold tracking-tight mb-3">
                Plan a private group trip
              </h3>
              <p className="text-[14px] text-ink/60 leading-relaxed">
                Prefer your own dates, pace, or a shorter section of the trail? We design private
                trips for groups of 2–20 from scratch.
              </p>
            </div>
            <Link
              href="/private-trips"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand no-underline hover:gap-3 transition-all"
            >
              Plan a Private Trip
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
