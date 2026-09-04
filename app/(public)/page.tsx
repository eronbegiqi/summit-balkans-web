import { Suspense } from "react";
import { HomeHero } from "@/components/sections/HomeHero";
import { UpcomingDepartures } from "@/components/sections/UpcomingDepartures";
import { WhereWeGo } from "@/components/sections/WhereWeGo";
import { HowYouTravel } from "@/components/sections/HowYouTravel";
import { WhySummitBalkans } from "@/components/sections/WhySummitBalkans";
import { PhotoGallery } from "@/components/sections/PhotoGallery";
import { TestimonialsAsync } from "@/components/sections/TestimonialsAsync";
import { CTABand } from "@/components/sections/CTABand";
import { getPublishedGalleryImages } from "@/lib/db/queries/gallery";

// No DB calls at this level except the gallery teaser (cheap, cached) — the
// page shell otherwise streams to the browser immediately so the HomeHero
// h1/image are the LCP candidate. Reviews are fetched inside
// <TestimonialsAsync> and streamed in separately.
export default async function HomePage() {
  const galleryImages = await getPublishedGalleryImages();

  return (
    <>
      <HomeHero />
      <UpcomingDepartures />
      <WhereWeGo />
      <HowYouTravel />
      <WhySummitBalkans />
      <PhotoGallery images={galleryImages.slice(0, 8)} />
      <Suspense>
        <TestimonialsAsync />
      </Suspense>
      <CTABand />
    </>
  );
}
