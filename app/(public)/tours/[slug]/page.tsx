import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db/client";
import { tours, tourStages, departures, guides } from "@/lib/db/schema";
import { asc, eq, and, sql } from "drizzle-orm";
import { DifficultyDots } from "@/components/ui/DifficultyDots";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StagesAccordion } from "@/components/tour/StagesAccordion";
import { EmergencyContactsCompact } from "@/components/sections/EmergencyContacts";
import { formatPrice } from "@/lib/utils";
import { parseJsonField } from "@/lib/db/utils";
import { Clock, Mountain, Users, ArrowRight, MapPin, CheckCircle2, XCircle, Calendar, Backpack } from "lucide-react";

export const revalidate = 300;

async function getTour(slug: string) {
  // Explicit selects — avoids the LATERAL JOIN that MariaDB doesn't support
  const [tour] = await db
    .select()
    .from(tours)
    .where(and(eq(tours.slug, slug), eq(tours.published, true)));

  if (!tour) return null;

  // MySQL2 prepared statements return JSON columns as raw strings — parse them
  const parsedTour = {
    ...tour,
    gallery:          parseJsonField<string[]>(tour.gallery, []),
    itinerary:        parseJsonField<typeof tour.itinerary>(tour.itinerary, []),
    includedItems:    parseJsonField<string[]>(tour.includedItems, []),
    notIncludedItems: parseJsonField<string[]>(tour.notIncludedItems, []),
    kitEssential:     parseJsonField<string[]>(tour.kitEssential, []),
    kitRecommended:   parseJsonField<string[]>(tour.kitRecommended, []),
    kitProvided:      parseJsonField<string[]>(tour.kitProvided, []),
    faq:              parseJsonField<Array<{ question: string; answer: string }>>(tour.faq, []),
  };

  const guide = tour.assignedGuideId
    ? ((await db.select().from(guides).where(eq(guides.id, tour.assignedGuideId)))[0] ?? null)
    : null;

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

  const parsedStages = stages.map((s) => ({
    ...s,
    highlights: parseJsonField<string[]>(s.highlights, []),
  }));

  return { tour: { ...parsedTour, guide }, stages: parsedStages, departures: tourDepartures };
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
  const price = isGuided
    ? Number(tour.pricePerPersonEur)
    : Number(tour.selfGuidedPriceEur ?? tour.pricePerPersonEur);
  const totalDistance = stages.reduce((sum, s) => sum + (s.distanceKm ? Number(s.distanceKm) : 0), 0);
  const totalGain = stages.reduce((sum, s) => sum + (s.elevationGainM ?? 0), 0);
  const maxElev = stages.reduce((max, s) => Math.max(max, s.highestPointM ?? 0), 0);

  const typeLabel = tour.tourType === "SELF_GUIDED" ? "Self-Guided" : "Guided";
  const variantLabel =
    tour.tourVariant && tour.tourVariant !== "OTHER"
      ? tour.tourVariant.charAt(0) + tour.tourVariant.slice(1).toLowerCase()
      : null;

  return (
    <>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[400px] bg-dark overflow-hidden pt-[72px]">
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
              {typeLabel}
            </span>
            {variantLabel && (
              <span className="font-mono text-[11px] font-medium px-2 py-1 rounded tracking-[0.06em] uppercase bg-white/15 text-white">
                {variantLabel}
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
          <Stat label="Difficulty" value={<DifficultyDots level={tour.difficulty as 1 | 2 | 3 | 4 | 5} className="mt-0.5" />} />
          {tour.minParticipants && <Stat label="Min. participants" value={String(tour.minParticipants)} />}
        </div>
      </div>

      <div className="max-w-content mx-auto px-6 md:px-10 py-12 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
        {/* Main content */}
        <div className="space-y-14">

          {/* Description */}
          {tour.description && (
            <section>
              <SectionLabel>Overview</SectionLabel>
              <div
                className="prose prose-ink max-w-none text-ink/80 leading-relaxed mt-4"
                dangerouslySetInnerHTML={{ __html: tour.description }}
              />
            </section>
          )}

          {/* Guided vs Self-Guided comparison
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
          )} */}

          {/* Dates & Prices */}
          <section id="departures">
            <SectionLabel>Dates &amp; Prices</SectionLabel>
            <h2 className="font-fraunces text-2xl md:text-3xl font-bold tracking-tight mt-2 mb-6">
              Choose your departure
            </h2>
            {deps.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-divider text-left">
                      <th className="pb-3 pr-6 font-mono text-[11px] uppercase tracking-[0.08em] text-ink/45 whitespace-nowrap">Dates</th>
                      <th className="pb-3 pr-6 font-mono text-[11px] uppercase tracking-[0.08em] text-ink/45 whitespace-nowrap">Type</th>
                      <th className="pb-3 pr-6 font-mono text-[11px] uppercase tracking-[0.08em] text-ink/45 whitespace-nowrap">Guide</th>
                      <th className="pb-3 pr-6 font-mono text-[11px] uppercase tracking-[0.08em] text-ink/45 whitespace-nowrap">Availability</th>
                      <th className="pb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ink/45 whitespace-nowrap text-right">Price</th>
                      <th className="pb-3 pl-6"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {deps.map((dep) => {
                      const spots = dep.capacity - (dep.bookedCount ?? 0);
                      const soldOut = spots === 0;
                      const low = spots > 0 && spots <= 3;
                      const depPrice = dep.pricePerPersonEur ? Number(dep.pricePerPersonEur) : price;
                      const start = String(dep.startDate);
                      const end = String(dep.endDate);
                      const startFmt = new Date(start).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
                      const endFmt = new Date(end).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

                      return (
                        <tr key={dep.id} className="border-b border-divider hover:bg-bone/50 transition-colors">
                          <td className="py-4 pr-6 font-mono text-xs whitespace-nowrap">
                            {startFmt} – {endFmt}
                          </td>
                          <td className="py-4 pr-6 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded tracking-[0.06em] uppercase bg-brand/10 text-brand">
                                {typeLabel}
                              </span>
                              {variantLabel && (
                                <span className="font-mono text-[10px] px-2 py-0.5 rounded tracking-[0.06em] uppercase bg-ink/8 text-ink/60">
                                  {variantLabel}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 pr-6 text-ink/60 whitespace-nowrap">{dep.guideName ?? "TBC"}</td>
                          <td className="py-4 pr-6 whitespace-nowrap">
                            {soldOut ? (
                              <span className="font-mono text-[11px] text-ink/35">Sold out</span>
                            ) : (
                              <span className={`font-mono text-[11px] font-medium ${low ? "text-amber-600" : "text-forest"}`}>
                                {spots}/{dep.capacity} spots
                                {low && (
                                  <span className="ml-1.5 bg-gold text-ink text-[10px] px-1.5 py-0.5 rounded font-semibold">Low</span>
                                )}
                              </span>
                            )}
                          </td>
                          <td className="py-4 pr-0 text-right whitespace-nowrap">
                            <span className="font-fraunces text-lg font-bold">{formatPrice(depPrice)}</span>
                            <span className="font-inter text-xs text-ink/45"> /pp</span>
                          </td>
                          <td className="py-4 pl-6 text-right whitespace-nowrap">
                            {soldOut ? null : (
                              <Link
                                href={`/tours/book?tour=${tour.slug}&departure=${dep.id}`}
                                className="inline-flex items-center gap-1 bg-terra text-white px-4 py-2 rounded-lg text-xs font-semibold no-underline hover:opacity-90 transition-opacity"
                              >
                                Book <ArrowRight className="w-3 h-3" strokeWidth={2} />
                              </Link>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-bone border-2 border-divider rounded-xl p-8 text-center">
                <Calendar className="w-8 h-8 text-ink/25 mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-ink/55 mb-4">No upcoming departures scheduled yet.</p>
                <a
                  href="https://wa.me/38348300155"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-divider text-ink px-5 py-2.5 rounded-lg text-sm font-medium no-underline hover:border-ink transition-colors"
                >
                  Ask about availability
                </a>
              </div>
            )}
          </section>

          {/* Day-by-day itinerary */}
          {stages.length > 0 && (
            <section>
              <SectionLabel>Day-by-Day Itinerary</SectionLabel>
              <StagesAccordion stages={stages} />
            </section>
          )}

          {/* Included / Not included */}
          {(tour.includedItems?.length || tour.notIncludedItems?.length) ? (
            <section>
              <SectionLabel>What&apos;s included</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
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
              </div>
            </section>
          ) : null}

          {/* What to pack */}
          <section id="pack">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div>
                <SectionLabel>Gear</SectionLabel>
                <h2 className="font-fraunces text-2xl md:text-3xl font-bold tracking-tight mt-2">What to pack</h2>
              </div>
              <Link
                href="/before-you-visit#pack"
                className="inline-flex items-center gap-1.5 text-brand font-semibold text-sm no-underline hover:gap-2.5 transition-all shrink-0"
              >
                Full packing guide <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
              </Link>
            </div>
            {tour.kitEssential?.length || tour.kitRecommended?.length || tour.kitProvided?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {tour.kitEssential && tour.kitEssential.length > 0 && (
                  <KitList title="Essential" items={tour.kitEssential} />
                )}
                {tour.kitRecommended && tour.kitRecommended.length > 0 && (
                  <KitList title="Recommended" items={tour.kitRecommended} />
                )}
                {tour.kitProvided && tour.kitProvided.length > 0 && (
                  <KitList title="Provided by us" items={tour.kitProvided} />
                )}
              </div>
            ) : (
              <div className="bg-bone border-2 border-divider rounded-xl p-6 text-sm text-ink/60">
                See our general packing checklist and seasonal gear guide for Balkans hiking.
              </div>
            )}
          </section>

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
          <div className="bg-white border-2 border-divider rounded-2xl p-6 sticky top-24">
            <div className="font-fraunces text-3xl font-bold mb-1">
              {formatPrice(price)}
              <span className="font-inter text-sm font-normal text-ink/45"> / person</span>
            </div>
            {tour.selfGuidedPriceEur && isGuided && (
              <p className="text-xs text-ink/50 mb-4">Self-guided from {formatPrice(Number(tour.selfGuidedPriceEur))}</p>
            )}
            <Link
              href="#departures"
              className="block w-full text-center border-2 border-divider text-ink py-2.5 rounded-xl font-medium text-sm no-underline hover:border-ink transition-colors mb-3"
            >
              View all dates ↓
            </Link>
            <Link
              href={`/tours/book?tour=${tour.slug}`}
              className="block w-full text-center bg-brand text-white py-3.5 rounded-xl font-semibold no-underline hover:bg-brand/90 transition-colors"
            >
              Book This Tour
            </Link>
            <p className="text-center text-xs text-ink/40 mt-2">Free cancellation · 20% deposit secures your spot</p>

            <Link
              href="/before-you-visit#pack"
              className="mt-4 flex items-center justify-between gap-2 border-2 border-divider rounded-xl px-4 py-3 text-sm font-medium text-ink no-underline hover:border-ink transition-colors"
            >
              <span className="flex items-center gap-2">
                <Backpack className="w-4 h-4 text-ink/50" strokeWidth={1.5} />
                What to pack
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-ink/40" strokeWidth={2} />
            </Link>

            {/* Practical info */}
            <div className="mt-6 pt-5 border-t border-divider space-y-3 text-sm">
              {tour.meetingPoint && (
                <div className="flex gap-2">
                  <MapPin className="w-4 h-4 text-ink/40 mt-0.5 shrink-0" strokeWidth={1.5} />
                  <div><span className="font-semibold">Starts:</span> {tour.meetingPoint}</div>
                </div>
              )}
              {tour.accommodationType && (
                <div className="flex gap-2">
                  <span className="w-4 shrink-0 text-center">🏠</span>
                  <div><span className="font-semibold">Stay:</span> {tour.accommodationType}</div>
                </div>
              )}
              {tour.mealsIncluded && (
                <div className="flex gap-2">
                  <span className="w-4 shrink-0 text-center">🍽</span>
                  <div><span className="font-semibold">Meals:</span> {tour.mealsIncluded}</div>
                </div>
              )}
              {tour.bestSeasonStart && tour.bestSeasonEnd && (
                <div className="flex gap-2">
                  <span className="w-4 shrink-0 text-center">📅</span>
                  <div><span className="font-semibold">Season:</span> {tour.bestSeasonStart} – {tour.bestSeasonEnd}</div>
                </div>
              )}
            </div>
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

function KitList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-white border-2 border-divider rounded-card p-6">
      <h3 className="font-fraunces text-lg font-bold mb-4">{title}</h3>
      <ul className="list-none flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-ink/70">
            <span className="w-1.5 h-1.5 rounded-full bg-forest flex-shrink-0 mt-1.5" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
