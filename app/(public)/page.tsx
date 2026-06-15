import { HomeHero } from "@/components/sections/HomeHero";
import { UpcomingDepartures } from "@/components/sections/UpcomingDepartures";
import { WhereWeGo } from "@/components/sections/WhereWeGo";
import { HowYouTravel } from "@/components/sections/HowYouTravel";
import { FeaturedTrips } from "@/components/sections/FeaturedTrips";
import { WhySummitBalkans } from "@/components/sections/WhySummitBalkans";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTABand } from "@/components/sections/CTABand";
import { getPublishedReviews } from "@/lib/db/queries/reviews";

export default async function HomePage() {
  const reviews = await getPublishedReviews();

  return (
    <>
      <HomeHero />
      <UpcomingDepartures />
      <WhereWeGo />
      <HowYouTravel />
      {/* <FeaturedTrips /> */}
      <WhySummitBalkans />
      <Testimonials reviews={reviews} />
      <CTABand />
    </>
  );
}
