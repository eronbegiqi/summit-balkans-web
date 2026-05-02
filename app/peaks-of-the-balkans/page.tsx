import type { Metadata } from "next";
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
import { getTourBySlug, getDeparturesByTour } from "@/data/tours";

export const metadata: Metadata = {
  title: "Peaks of the Balkans — Summit Balkans",
  description:
    "A 192 km cross-border trek through Kosovo, Albania and Montenegro. One of Europe's last great wilderness trails. Small groups, local guides, family-run guesthouses.",
  openGraph: {
    title: "Peaks of the Balkans",
    description: "A 192 km cross-border journey through Europe's last wild mountains.",
    images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85"],
  },
};

export default function PeaksOfTheBalkansPage() {
  const tour = getTourBySlug("peaks-of-the-balkans");
  const deps = getDeparturesByTour("peaks-of-the-balkans");
  const nextDep = deps.find((d) => d.status === "available" || d.status === "low") ?? null;

  return (
    <>
      <PoBHero />
      <PoBMiniNav />
      <PoBIntro />
      <RouteMapClient />
      <HistoricalTimeline />
      <PeaksShowcase />
      <LakesGallery />
      <StagesItinerary />
      <CrossBorderSection />
      <CulturalSection />
      <WildlifeStrip />
      <PoBDepartures />
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
      {tour && <TourStickyBar tour={tour} nextDep={nextDep} />}
    </>
  );
}
