"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GalleryTile, spanForIndex } from "@/components/gallery/GalleryTile";
import { RevealTile } from "@/components/gallery/RevealTile";
import { Lightbox } from "@/components/gallery/Lightbox";
import type { GalleryImageListItem } from "@/lib/db/queries/gallery";

// No SectionLabel eyebrow here on purpose — the homepage is already at its
// eyebrow budget (see the Section 11 audit earlier this session); the
// headline alone carries this section.
export function PhotoGallery({ images }: { images: GalleryImageListItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-4 md:px-10">
        <div className="mb-10 md:mb-12 flex items-end justify-between gap-4">
          <h2
            className="font-fraunces font-bold tracking-tight leading-[1.1]"
            style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
          >
            The trail, in photos
          </h2>
          <Link
            href="/gallery"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-terra no-underline hover:gap-2.5 transition-[gap] shrink-0"
          >
            View Full Gallery
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[140px] sm:auto-rows-[170px] gap-3 md:gap-4 [grid-auto-flow:dense]">
          {images.map((image, index) => (
            <RevealTile key={image.id} index={index} className={spanForIndex(index)}>
              <GalleryTile image={image} index={index} onOpen={setOpenIndex} />
            </RevealTile>
          ))}
        </div>

        <Link
          href="/gallery"
          className="sm:hidden mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-terra no-underline"
        >
          View Full Gallery
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
        </Link>
      </div>

      {openIndex !== null && (
        <Lightbox images={images} startIndex={openIndex} onClose={() => setOpenIndex(null)} />
      )}
    </section>
  );
}
