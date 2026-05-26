import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, MapPin, Users, Mountain, Check, X, ArrowRight, Calendar } from "lucide-react";
import { getTourBySlug } from "@/lib/db/queries/tours";
import { getDeparturesByTour } from "@/lib/db/queries/departures";
import { ItineraryAccordion } from "@/components/tour/ItineraryAccordion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { formatPrice, formatDateRange, spotsLabel, isLowAvailability } from "@/lib/utils";
import { TourFAQ } from "./TourFAQ";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour || !tour.published) return {};
  return {
    title: tour.seoTitle ?? `${tour.title} — Summit Balkans`,
    description: tour.seoDescription ?? tour.excerpt ?? undefined,
    openGraph: tour.featuredImageUrl
      ? { images: [tour.featuredImageUrl] }
      : undefined,
  };
}

export default async function TourPage({ params }: Props) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);

  if (!tour || !tour.published) notFound();

  const today = new Date().toISOString().split("T")[0];
  const allDepartures = await getDeparturesByTour(tour.id);
  const upcomingDepartures = allDepartures.filter(
    (d) => String(d.startDate) >= today && d.status !== "CANCELLED"
  );

  const itineraryDays = (tour.itinerary ?? []).map((day) => ({
    day: day.day,
    title: day.title,
    description: day.description,
    distance: day.distanceKm ?? 0,
    elevation: day.elevationGainM ?? 0,
    accommodation: day.accommodation ?? "",
  }));

  const priceFrom = parseFloat(tour.pricePerPersonEur);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-dark pt-[72px] overflow-hidden">
        {tour.featuredImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={tour.featuredImageUrl}
            alt={tour.title}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        )}
        <div className="relative z-10 max-w-content mx-auto px-6 md:px-10 py-20 md:py-28">
          <h1
            className="font-fraunces font-bold text-white tracking-tight leading-[1.05] max-w-[720px] mb-5"
            style={{ fontSize: "clamp(36px, 5vw, 68px)" }}
          >
            {tour.title}
          </h1>
          {tour.excerpt && (
            <p className="text-xl text-white/65 max-w-[560px] mb-10 leading-relaxed">
              {tour.excerpt}
            </p>
          )}

          <div className="flex flex-wrap gap-5 mb-10">
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Clock className="w-4 h-4" strokeWidth={1.5} />
              {tour.durationDays} days
            </div>
            {tour.country && (
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <MapPin className="w-4 h-4" strokeWidth={1.5} />
                {tour.country}
              </div>
            )}
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Users className="w-4 h-4" strokeWidth={1.5} />
              Max {tour.groupSizeMax} travellers
            </div>
            {tour.maxElevationM && (
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Mountain className="w-4 h-4" strokeWidth={1.5} />
                Up to {tour.maxElevationM.toLocaleString()}m
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="font-fraunces text-4xl font-bold text-white">
              {formatPrice(priceFrom)}
              <span className="font-inter text-sm font-normal text-white/45"> from / person</span>
            </div>
            <Link
              href="/tours/book"
              className="inline-flex items-center gap-2 bg-terra text-white px-7 py-4 rounded-xl font-semibold no-underline hover:opacity-90 transition-opacity"
            >
              Book This Tour <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-content mx-auto px-6 md:px-10 py-20 md:py-28 flex flex-col gap-20 md:gap-28">

        {/* Description */}
        {tour.description && (
          <section>
            <SectionLabel>About this tour</SectionLabel>
            <div className="grid md:grid-cols-[1fr_340px] gap-10 mt-8">
              <div
                className="prose prose-lg max-w-none text-ink/75 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: tour.description }}
              />
              <div className="bg-bone border-2 border-divider rounded-2xl p-7 self-start">
                <div className="text-xs font-mono text-ink/40 tracking-[0.1em] uppercase mb-5">Quick facts</div>
                <div className="flex flex-col gap-4">
                  {[
                    { label: "Duration", value: `${tour.durationDays} days` },
                    { label: "Difficulty", value: ["", "Easy", "Moderate", "Moderate+", "Challenging", "Expert"][tour.difficulty] },
                    { label: "Group size", value: `${tour.groupSizeMin}–${tour.groupSizeMax} people` },
                    tour.totalDistanceKm ? { label: "Total distance", value: `${tour.totalDistanceKm} km` } : null,
                    tour.maxElevationM ? { label: "Max elevation", value: `${tour.maxElevationM.toLocaleString()} m` } : null,
                    tour.accommodationType ? { label: "Accommodation", value: tour.accommodationType } : null,
                    tour.mealsIncluded ? { label: "Meals", value: tour.mealsIncluded } : null,
                    tour.bestSeasonStart ? { label: "Best season", value: `${tour.bestSeasonStart} – ${tour.bestSeasonEnd ?? ""}` } : null,
                  ].filter(Boolean).map((item) => (
                    <div key={item!.label} className="flex justify-between gap-4 text-sm border-b border-divider pb-3 last:border-0 last:pb-0">
                      <span className="text-ink/45">{item!.label}</span>
                      <span className="font-medium text-right">{item!.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Departures */}
        {upcomingDepartures.length > 0 && (
          <section id="departures">
            <SectionLabel>Upcoming departures</SectionLabel>
            <h2 className="font-fraunces text-3xl md:text-4xl font-bold tracking-tight mt-3 mb-8">
              Choose your dates
            </h2>
            <div className="flex flex-col gap-3">
              {upcomingDepartures.map((dep) => {
                const spotsLeft = dep.capacity - (dep.bookedCount ?? 0);
                const low = isLowAvailability(spotsLeft);
                const soldOut = spotsLeft === 0;
                const depPrice = dep.pricePerPersonEur ? parseFloat(dep.pricePerPersonEur) : priceFrom;
                return (
                  <div
                    key={dep.id}
                    className="flex flex-wrap items-center justify-between gap-4 p-5 bg-white border-2 border-divider rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-ink/35 flex-shrink-0" strokeWidth={1.5} />
                      <div>
                        <div className="font-mono text-sm font-medium">
                          {formatDateRange(String(dep.startDate), String(dep.endDate))}
                        </div>
                        <div className="text-[13px] text-ink/45 mt-0.5">
                          {spotsLabel(spotsLeft, dep.capacity)}
                          {low && !soldOut && (
                            <span className="ml-2 font-mono text-[10px] bg-gold text-ink px-2 py-0.5 rounded font-medium">
                              Low
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      <div className="font-fraunces text-2xl font-bold">
                        {formatPrice(depPrice)}
                        <span className="font-inter text-xs font-normal text-ink/45"> / person</span>
                      </div>
                      {soldOut ? (
                        <span className="text-sm font-medium text-ink/35">Sold out</span>
                      ) : (
                        <Link
                          href="/tours/book"
                          className="inline-flex items-center gap-1.5 bg-terra text-white px-5 py-2.5 rounded-lg text-sm font-semibold no-underline hover:opacity-90 transition-opacity"
                        >
                          Book <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Itinerary */}
        {itineraryDays.length > 0 && (
          <section id="itinerary">
            <SectionLabel>Day by day</SectionLabel>
            <h2 className="font-fraunces text-3xl md:text-4xl font-bold tracking-tight mt-3 mb-8">
              Itinerary
            </h2>
            <ItineraryAccordion days={itineraryDays} />
          </section>
        )}

        {/* Included / Not included */}
        {((tour.includedItems?.length ?? 0) > 0 || (tour.notIncludedItems?.length ?? 0) > 0) && (
          <section id="whats-included">
            <SectionLabel>What&apos;s included</SectionLabel>
            <h2 className="font-fraunces text-3xl md:text-4xl font-bold tracking-tight mt-3 mb-8">
              Included &amp; not included
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {(tour.includedItems?.length ?? 0) > 0 && (
                <div>
                  <div className="text-sm font-semibold text-forest mb-4 flex items-center gap-2">
                    <Check className="w-4 h-4" strokeWidth={2} /> Included
                  </div>
                  <ul className="flex flex-col gap-2.5">
                    {tour.includedItems!.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-[15px] text-ink/75">
                        <Check className="w-4 h-4 text-forest mt-0.5 flex-shrink-0" strokeWidth={2} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {(tour.notIncludedItems?.length ?? 0) > 0 && (
                <div>
                  <div className="text-sm font-semibold text-ink/45 mb-4 flex items-center gap-2">
                    <X className="w-4 h-4" strokeWidth={2} /> Not included
                  </div>
                  <ul className="flex flex-col gap-2.5">
                    {tour.notIncludedItems!.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-[15px] text-ink/55">
                        <X className="w-4 h-4 text-ink/30 mt-0.5 flex-shrink-0" strokeWidth={2} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* FAQ */}
        {(tour.faq?.length ?? 0) > 0 && (
          <section id="faq">
            <SectionLabel>Questions</SectionLabel>
            <h2 className="font-fraunces text-3xl md:text-4xl font-bold tracking-tight mt-3 mb-8">
              Frequently asked
            </h2>
            <TourFAQ items={tour.faq!} />
          </section>
        )}

        {/* CTA band */}
        <section className="bg-dark rounded-card-hero p-10 md:p-16 text-center">
          <div className="font-mono text-[11px] text-gold tracking-[0.12em] uppercase mb-4">Ready to go?</div>
          <h2 className="font-fraunces text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            {tour.title}
          </h2>
          <p className="text-white/55 mb-8 max-w-md mx-auto leading-relaxed">
            Small groups, local guides, and mountain landscapes that stay with you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/tours/book"
              className="inline-flex items-center gap-2 bg-terra text-white px-8 py-4 rounded-xl font-semibold no-underline hover:opacity-90 transition-opacity"
            >
              Book Now — {formatPrice(priceFrom)} <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
            <a
              href="https://wa.me/38349279136"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-white/20 text-white px-8 py-4 rounded-xl font-medium no-underline hover:border-white/50 transition-colors"
            >
              Ask a question
            </a>
          </div>
        </section>

      </div>
    </>
  );
}
