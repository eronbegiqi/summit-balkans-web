import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getPublishedTourCards } from "@/lib/db/queries/tours";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85";

// Server-rendered links to every bookable route variant, so crawlers can reach
// /tours/[slug] from the flagship page (the /tours list itself renders client-side).
export async function RelatedTrips() {
  const routes = await getPublishedTourCards();

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-content mx-auto px-5 md:px-10">
        <div className="mb-10">
          <div className="text-[11px] font-medium tracking-[0.14em] uppercase text-terra mb-3">
            Choose your route
          </div>
          <h2 className="font-fraunces text-[clamp(2rem,4vw,2.8rem)] font-bold tracking-tight">
            Peaks of the Balkans tours
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {routes.map((tour) => (
            <Link
              key={tour.slug}
              href={`/tours/${tour.slug}`}
              className="group relative rounded-card-hero overflow-hidden border-2 border-divider no-underline block bg-bone"
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={tour.featuredImageUrl || FALLBACK_IMAGE}
                  alt={tour.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <span className="text-[10px] text-white/70 uppercase tracking-wider">
                    {tour.durationDays} days · {tour.tourType === "SELF_GUIDED" ? "Self-guided" : "Guided"}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-fraunces text-xl font-bold tracking-tight mb-1 group-hover:text-brand transition-colors">
                  {tour.title}
                </h3>
                {tour.excerpt && <p className="text-[13px] text-ink/55 mb-4 line-clamp-2">{tour.excerpt}</p>}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold text-ink">
                    From {formatPrice(Number(tour.pricePerPersonEur))}
                  </span>
                  <ArrowRight className="w-4 h-4 text-ink/30 group-hover:text-brand group-hover:translate-x-1 transition-all" strokeWidth={1.5} />
                </div>
              </div>
            </Link>
          ))}

          {/* Custom itinerary CTA */}
          <div className="rounded-card-hero border-2 border-dashed border-divider bg-bone p-6 flex flex-col justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.12em] text-terra mb-3">
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
