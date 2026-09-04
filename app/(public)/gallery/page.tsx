import type { Metadata } from "next";
import { getPublishedGalleryImages } from "@/lib/db/queries/gallery";
import { FullGallery } from "@/components/gallery/FullGallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from the trail — Albania, Montenegro and Kosovo hiking tours with Summit Balkans.",
};

export default async function GalleryPage() {
  const images = await getPublishedGalleryImages();

  return (
    <div className="pt-[104px] md:pt-[128px] pb-16 md:pb-24">
      <div className="max-w-content mx-auto px-4 md:px-10 mb-10 md:mb-12">
        <h1
          className="font-fraunces font-bold tracking-tight leading-[1.1]"
          style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
        >
          Gallery
        </h1>
        <p className="text-base md:text-lg text-ink/60 mt-3 max-w-[560px]">
          Trails, peaks and villages from Albania, Montenegro and Kosovo.
        </p>
      </div>

      <div className="max-w-content mx-auto px-4 md:px-10">
        <FullGallery images={images} />
      </div>
    </div>
  );
}
