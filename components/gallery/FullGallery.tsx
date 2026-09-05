"use client";

import { useState } from "react";
import { GalleryTile, heightForIndex } from "@/components/gallery/GalleryTile";
import { RevealTile } from "@/components/gallery/RevealTile";
import { Lightbox } from "@/components/gallery/Lightbox";
import type { GalleryImageListItem } from "@/lib/db/queries/gallery";

export function FullGallery({ images }: { images: GalleryImageListItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <p className="text-center text-ink/50 py-24">
        No photos yet — check back soon.
      </p>
    );
  }

  return (
    <>
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 md:gap-4">
        {images.map((image, index) => (
          <div key={image.id} className="mb-3 md:mb-4 break-inside-avoid">
            <RevealTile index={index} className={`relative w-full overflow-hidden rounded-card ${heightForIndex(index)}`}>
              <GalleryTile image={image} index={index} onOpen={setOpenIndex} />
            </RevealTile>
          </div>
        ))}
      </div>

      {openIndex !== null && (
        <Lightbox images={images} startIndex={openIndex} onClose={() => setOpenIndex(null)} />
      )}
    </>
  );
}
