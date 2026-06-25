import { Suspense } from "react";
import { HomeHero } from "@/components/sections/HomeHero";
import { UpcomingDepartures } from "@/components/sections/UpcomingDepartures";
import { WhereWeGo } from "@/components/sections/WhereWeGo";
import { HowYouTravel } from "@/components/sections/HowYouTravel";
import { WhySummitBalkans } from "@/components/sections/WhySummitBalkans";
import { TestimonialsAsync } from "@/components/sections/TestimonialsAsync";
import { CTABand } from "@/components/sections/CTABand";

// No DB calls at this level — the page shell streams to the browser
// immediately so the HomeHero h1/image are the LCP candidate.
// Reviews are fetched inside <TestimonialsAsync> and streamed in separately.
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <UpcomingDepartures />
      <WhereWeGo />
      <HowYouTravel />
      <WhySummitBalkans />
      <Suspense>
        <TestimonialsAsync />
      </Suspense>
      <CTABand />
    </>
  );
}
