import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db/client";
import { tours, tourStages, departures, guides } from "@/lib/db/schema";
import { asc, eq, and, sql } from "drizzle-orm";
import { DifficultyDots } from "@/components/ui/DifficultyDots";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TourStickyBar } from "@/components/tour/TourStickyBar";
import { StagesAccordion } from "@/components/tour/StagesAccordion";
import { EmergencyContactsCompact } from "@/components/sections/EmergencyContacts";
import { formatPrice } from "@/lib/utils";
import { Clock, Mountain, Users, ArrowRight, MapPin, CheckCircle2, XCircle } from "lucide-react";

export const revalidate = 300;

async function getTour(slug: string) {
  const tour = await db.query.tours.findFirst({
    where: and(eq(tours.slug, slug), eq(tours.published, true)),
    with: { guide: true },
  });
  if (!tour) return null;

  const today = new Date().toISOString().split("T")[0];
  const [stages, tourDepartures] = await Promise.all([
    db.select().from(tourStages).where(eq(tourStages.tourId, tour.id)).orderBy(asc(tourStages.dayNumber)),
    db
      .select({
        id: departures.id,
        startDate: departures.startDate,
        endDate: departures.endDate,
        capacity: departures.capacity,
        bookedCount: departures.bookedCount,
        pricePerPersonEur: departures.pricePerPersonEur,
        language: departures.language,
        status: departures.status,
        guideName: guides.name,
      })
      .from(departures)
      .leftJoin(guides, eq(departures.guideId, guides.id))
      .where(
        and(
          eq(departures.tourId, tour.id),
          sql`${departures.startDate} >= ${today}`,
          sql`${departures.status} != 'CANCELLED'`
        )
      )
      .orderBy(asc(departures.startDate)),
  ]);

  return { tour, stages, departures: tourDepartures };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getTour(slug);
  if (!data) return { title: "Tour not found" };
  const { tour } = data;
  return {
    title: tour.seoTitle ?? tour.title,
    description: tour.seoDescription ?? tour.excerpt ?? undefined,
    openGraph: {
      title: tour.seoTitle ?? tour.title,
      description: tour.seoDescription ?? tour.excerpt ?? undefined,
      images: tour.featuredImageUrl ? [{ url: tour.featuredImageUrl }] : [],
    },
  };
}

export default async function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getTour(slug);
  if (!data) notFound();

  const { tour, stages, departures: deps } = data;
  const isGuided = tour.tourType !== "SELF_GUIDED";
  const price = isGuided ? Number(tour.pricePerPersonEur) : Number(tour.selfGuidedPriceEur ?? tour.pricePerPersonEur);
  const totalDistance = stages.reduce((sum, s) => sum + (s.distanceKm ? Number(s.distanceKm) : 0), 0);
  const totalGain = stages.reduce((sum, s) => sum + (s.elevationGainM ?? 0), 0);
  const maxElev = stages.reduce((max, s) => Math.max(max, s.highestPointM ?? 0), 0);

  const firstDep = deps[0];

  return (
    <>
      {/* Sticky booking bar */}
      <TourStickyBar
        tour={{
          slug: tour.slug,
          name: tour.title,
          tagline: tour.excerpt ?? "",
          country: tour.country ? [tour.country] : [],
          duration: tour.durationDays,
          difficulty: (tour.difficulty as 1|2|3|4|5),
          priceFrom: price,
          currency: "EUR",
          coverImage: tour.featuredImageUrl ?? "",
          images: [],
          spotsTotal: tour.groupSizeMax ?? 12,
          nextDeparture: firstDep ? String(firstDep.startDate) : "",
          spotsLeft: firstDep ? firstDep.capacity - (firstDep.bookedCount ?? 0) : 0,
          description: tour.excerpt ?? "",
          highlights: [],
        }}
        nextDep={firstDep ? {
          id: String(firstDep.id),
          tourSlug: tour.slug,
          startDate: String(firstDep.startDate),
          endDate: String(firstDep.endDate),
          guide: firstDep.guideName ?? "",
          spotsTotal: firstDep.capacity,
          spotsLeft: firstDep.capacity - (firstDep.bookedCount ?? 0),
          price,
          currency: "EUR",
          status: (firstDep.capacity - (firstDep.bookedCount ?? 0)) <= 3 ? "low" : "available",
        } : null}
      />

      {/* Hero */}
      <section className="relative h-[55vh] min-h-[400px] bg-dark overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tour.featuredImageUrl ? `${tour.featuredImageUrl}&w=1400` : "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80"}
          alt={tour.title}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-content mx-auto px-6 md:px-10 pb-10">
          <div className="flex gap-2 mb-3">
            <span className="font-mono text-[11px] font-semibold px-2 py-1 rounded tracking-[0.06em] uppercase bg-brand text-white">
              {isGuided ? "Guided" : "Self-Guided"}
            </span>
            {tour.tourVariant && tour.tourVariant !== "OTHER" && (
              <span className="font-mono text-[11px] font-medium px-2 py-1 rounded tracking-[0.06em] uppercase bg-white/15 text-white">
                {tour.tourVariant.charAt(0) + tour.tourVariant.slice(1).toLowerCase()}
              </span>
            )}
          </div>
          <h1 className="font-fraunces text-3xl md:text-5xl font-bold text-white tracking-tight max-w-[700px] mb-2">
            {tour.title}
          </h1>
          {tour.excerpt && <p className="text-white/70 text-lg max-w-[560px]">{tour.excerpt}</p>}
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-ink text-white py-4 border-b border-white/10">
        <div className="max-w-content mx-auto px-6 md:px-10 flex flex-wrap gap-6 md:gap-10 text-sm">
          <Stat label="Duration" value={`${tour.durationDays} days`} />
          {totalDistance > 0 && <Stat label="Distance" value={`${totalDistance.toFixed(0)} km`} />}
          {totalGain > 0 && <Stat label="Elevation gain" value={`${totalGain.toLocaleString()} m`} />}
          {maxElev > 0 && <Stat label="Max elevation" value={`${maxElev.toLocaleString()} m`} />}
          <Stat label="Difficulty" value={<DifficultyDots level={tour.difficulty as 1|2|3|4|5} className="mt-0.5" />} />
          {tour.minParticipants && <Stat label="Min. participants" value={String(tour.minParticipants)} />}
        </div>
      </div>

      <div className="max-w-content mx-auto px-6 md:px-10 py-12 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12">
        {/* Main content */}
        <div className="space-y-12">
          {/* Description */}
          {tour.description && (
            <section>
              <SectionLabel>Overview</SectionLabel>
              <div
                className="prose prose-ink max-w-none text-ink/80 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: tour.description }}
              />
            </section>
          )}

          {/* Guided vs Self-Guided comparison */}
          {tour.selfGuidedPriceEur && (
            <section className="bg-bone rounded-2xl p-6 border-2 border-divider">
              <SectionLabel>How would you like to hike?</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className={`rounded-xl p-5 border-2 ${isGuided ? "border-brand bg-white" : "border-divider"}`}>
                  <p className="font-semibold mb-1">Guided — {formatPrice(Number(tour.pricePerPersonEur))}</p>
                  <p className="text-sm text-ink/60">Professional guide, all logistics handled, group experience.</p>
                </div>
                <div className={`rounded-xl p-5 border-2 ${!isGuided ? "border-brand bg-white" : "border-divider"}`}>
                  <p className="font-semibold mb-1">Self-Guided — {formatPrice(Number(tour.selfGuidedPriceEur))}</p>
                  <p className="text-sm text-ink/60">GPS tracks, guesthouses pre-booked, 24/7 remote support.</p>
                </div>
              </div>
            </section>
          )}

          {/* Day-by-day itinerary */}
          {stages.length > 0 && (
            <section>
              <SectionLabel>Day-by-Day Itinerary</SectionLabel>
              <StagesAccordion stages={stages} />
            </section>
          )}

          {/* Included / Not included */}
          {(tour.includedItems?.length || tour.notIncludedItems?.length) ? (
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {tour.includedItems && tour.includedItems.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 text-ink">Included</h3>
                  <ul className="space-y-2">
                    {tour.includedItems.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-ink/70">
                        <CheckCircle2 className="w-4 h-4 text-brand mt-0.5 shrink-0" strokeWidth={1.5} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tour.notIncludedItems && tour.notIncludedItems.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 text-ink">Not included</h3>
                  <ul className="space-y-2">
                    {tour.notIncludedItems.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-ink/70">
                        <XCircle className="w-4 h-4 text-ink/30 mt-0.5 shrink-0" strokeWidth={1.5} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          ) : null}

          {/* Min participants notice */}
          {tour.minParticipants && (
            <section className="bg-brand/5 border border-brand/20 rounded-xl p-5 text-sm text-ink/70">
              <p>
                <span className="font-semibold text-ink">Minimum {tour.minParticipants} participants</span> to guarantee departure.
                Solo and duo bookings are welcome — we match you with other travellers.
              </p>
            </section>
          )}

          {/* Emergency contacts */}
          <EmergencyContactsCompact />

          {/* FAQ */}
          {tour.faq && tour.faq.length > 0 && (
            <section>
              <SectionLabel>FAQ</SectionLabel>
              <div className="space-y-4 mt-4">
                {tour.faq.map((item, i) => (
                  <div key={i} className="border-b border-divider pb-4">
                    <p className="font-semibold mb-1">{item.question}</p>
                    <p className="text-sm text-ink/70">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Price card */}
          <div className="bg-white border-2 border-divider rounded-2xl p-6 sticky top-24">
            <div className="font-fraunces text-3xl font-bold mb-1">
              {formatPrice(price)}
              <span className="font-inter text-sm font-normal text-ink/45"> / person</span>
            </div>
            {tour.selfGuidedPriceEur && isGuided && (
              <p className="text-xs text-ink/50 mb-4">Self-guided from {formatPrice(Number(tour.selfGuidedPriceEur))}</p>
            )}

            {deps.length > 0 ? (
              <>
                <h4 className="font-semibold text-sm mb-3 mt-4">Upcoming departures</h4>
                <div className="space-y-2 mb-5">
                  {deps.slice(0, 4).map((dep) => {
                    const spots = dep.capacity - (dep.bookedCount ?? 0);
                    return (
                      <div key={dep.id} className="flex items-center justify-between text-sm border border-divider rounded-lg px-3 py-2">
                        <span className="font-mono text-xs">{String(dep.startDate)}</span>
                        <span className={`text-xs font-medium ${spots <= 3 ? "text-warning" : "text-brand"}`}>
                          {spots} spots
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="text-sm text-ink/50 my-4">Contact us for availability.</p>
            )}

            <Link
              href={`/tours/book?tour=${tour.slug}`}
              className="block w-full text-center bg-brand text-white py-3.5 rounded-xl font-semibold no-underline hover:bg-brand/90 transition-colors"
            >
              Book This Tour
            </Link>
            <p className="text-center text-xs text-ink/40 mt-2">Free cancellation · 20% deposit secures your spot</p>
          </div>

          {/* Practical info */}
          <div className="bg-bone rounded-2xl p-5 border border-divider space-y-3 text-sm">
            {tour.meetingPoint && (
              <div className="flex gap-2">
                <MapPin className="w-4 h-4 text-ink/40 mt-0.5 shrink-0" strokeWidth={1.5} />
                <div><span className="font-semibold">Starts:</span> {tour.meetingPoint}</div>
              </div>
            )}
            {tour.accommodationType && (
              <div className="flex gap-2">
                <span className="w-4 h-4 text-center text-ink/40 shrink-0">🏠</span>
                <div><span className="font-semibold">Accommodation:</span> {tour.accommodationType}</div>
              </div>
            )}
            {tour.mealsIncluded && (
              <div className="flex gap-2">
                <span className="w-4 h-4 text-center text-ink/40 shrink-0">🍽</span>
                <div><span className="font-semibold">Meals:</span> {tour.mealsIncluded}</div>
              </div>
            )}
            {tour.bestSeasonStart && tour.bestSeasonEnd && (
              <div className="flex gap-2">
                <span className="w-4 h-4 text-center text-ink/40 shrink-0">📅</span>
                <div><span className="font-semibold">Season:</span> {tour.bestSeasonStart} – {tour.bestSeasonEnd}</div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider mb-0.5">{label}</div>
      <div className="font-semibold text-sm">{value}</div>
    </div>
  );
}
