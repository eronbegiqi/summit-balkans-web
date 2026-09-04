"use client";

import { useState } from "react";
import { GalleryTile, spanForIndex } from "@/components/gallery/GalleryTile";
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
      <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[140px] sm:auto-rows-[180px] gap-3 md:gap-4 [grid-auto-flow:dense]">
        {images.map((image, index) => (
          <RevealTile key={image.id} index={index} className={spanForIndex(index)}>
            <GalleryTile image={image} index={index} onOpen={setOpenIndex} />
          </RevealTile>
        ))}
      </div>

      {openIndex !== null && (
        <Lightbox images={images} startIndex={openIndex} onClose={() => setOpenIndex(null)} />
      )}
    </>
  );
}
