import type { Metadata } from "next";
import { ogBase } from "@/lib/seo";
import { PoBHero } from "@/components/pob/PoBHero";
import { PoBMiniNav } from "@/components/pob/PoBMiniNav";
import { PoBIntro } from "@/components/pob/PoBIntro";
import { HistoricalTimeline } from "@/components/pob/HistoricalTimeline";
import { PeaksShowcase } from "@/components/pob/PeaksShowcase";
import { LakesGallery } from "@/components/pob/LakesGallery";
import { StagesItinerary } from "@/components/pob/StagesItinerary";
import { CrossBorderSection } from "@/components/pob/CrossBorderSection";
import { CulturalSection } from "@/components/pob/CulturalSection";
import { WildlifeStrip } from "@/components/pob/WildlifeStrip";
import { PoBDepartures } from "@/components/pob/PoBDepartures";
import { IncludedSection } from "@/components/pob/IncludedSection";
import { BringChecklist } from "@/components/tour/BringChecklist";
import { PoBFAQ } from "@/components/pob/PoBFAQ";
import { PoBReviews } from "@/components/pob/PoBReviews";
import { RelatedTrips } from "@/components/pob/RelatedTrips";
import { PoBCTABand } from "@/components/pob/PoBCTABand";
import { RouteMapClient } from "@/components/pob/RouteMapClient";
import { TourStickyBar } from "@/components/tour/TourStickyBar";
import { getTourBySlug } from "@/data/tours";
import { getUpcomingDeparturesByTourSlug } from "@/lib/db/queries/departures";
import { getPoBFacts, getTourStagesBySlug } from "@/lib/db/queries/tours";
import type { Departure } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const f = await getPoBFacts();
  return {
    title: { absolute: "Peaks of the Balkans Trek | Guided & Self-Guided Tours" },
    description: `Hike the Peaks of the Balkans through Kosovo, Albania and Montenegro with local guides. Guided or self-guided, ${f.minDays} to ${f.maxDays} days, from €${f.fromPriceEur}. Book your trek.`,
    alternates: { canonical: "/peaks-of-the-balkans" },
    openGraph: {
      ...ogBase,
      url: "/peaks-of-the-balkans",
      title: "Peaks of the Balkans",
      description: `A cross-border journey through Europe's last wild mountains. ${f.minDays}, 11 or ${f.maxDays} days, guided or self-guided.`,
      images: [
        {
          url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop&q=85",
          width: 1200,
          height: 630,
          alt: "Mountain ridges on the Peaks of the Balkans trail",
        },
      ],
    },
  };
}

export default async function PeaksOfTheBalkansPage() {
  const tour = getTourBySlug("peaks-of-the-balkans");
  const facts = await getPoBFacts();
  // Departures belong to the individual route tours (quick / regular / classic).
  const deps = (await Promise.all(facts.slugs.map((slug) => getUpcomingDeparturesByTourSlug(slug))))
    .flat()
    .sort((a, b) => String(a.startDate).localeCompare(String(b.startDate)));
  const stages = facts.longestSlug ? await getTourStagesBySlug(facts.longestSlug) : [];
  const nextDep: Departure | null = deps[0]
    ? {
        id: String(deps[0].id),
        tourSlug: deps[0].tour.slug,
        startDate: String(deps[0].startDate),
        endDate: String(deps[0].endDate),
        guide: deps[0].guide?.name ?? "Local guide",
        spotsTotal: Number(deps[0].capacity),
        spotsLeft: Math.max(Number(deps[0].capacity) - Number(deps[0].bookedCount ?? 0), 0),
        price: Number(deps[0].pricePerPersonEur ?? deps[0].tour.pricePerPersonEur ?? 0),
        currency: "EUR",
        status: deps[0].status === "SOLD_OUT" ? "sold-out" : deps[0].status === "LIMITED" ? "low" : "available",
      }
    : null;

  return (
    <>
      <PoBHero facts={facts} />
      <PoBMiniNav />
      <PoBIntro facts={facts} />
      <RouteMapClient />
      <HistoricalTimeline />
      <PeaksShowcase />
      <LakesGallery />
      {stages.length > 0 && (
        <StagesItinerary days={stages} heading={`Day by day: the ${facts.maxDays}-day Classic route`} />
      )}
      <CrossBorderSection />
      <CulturalSection />
      <WildlifeStrip />
      <PoBDepartures fromPriceEur={facts.fromPriceEur} />
      <IncludedSection />
      <section className="py-10 md:py-16 bg-bone">
        <div className="max-w-content mx-auto px-5 md:px-10">
          <BringChecklist />
        </div>
      </section>
      <PoBFAQ />
      <PoBReviews />
      <RelatedTrips />
      <PoBCTABand />
      {tour && (
        <TourStickyBar
          tour={{ ...tour, priceFrom: nextDep?.price ?? facts.fromPriceEur, duration: facts.maxDays }}
          nextDep={nextDep}
        />
      )}
    </>
  );
}
