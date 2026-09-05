"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { GalleryImageListItem } from "@/lib/db/queries/gallery";

// A repeating height pattern, cycled by index, so a CSS-columns masonry grid
// of any length reads with rhythm instead of uniform tiles. Columns-based
// masonry (see FullGallery/PhotoGallery) stacks items top-down per column, so
// unlike a spanned CSS grid it can never leave an empty cell regardless of
// how many images there are.
const HEIGHT_PATTERN = [
  "h-[320px]",
  "h-[220px]",
  "h-[260px]",
  "h-[240px]",
  "h-[300px]",
  "h-[220px]",
];

export function heightForIndex(index: number): string {
  return HEIGHT_PATTERN[index % HEIGHT_PATTERN.length];
}

type Props = {
  image: GalleryImageListItem;
  index: number;
  onOpen: (index: number) => void;
  className?: string;
};

export function GalleryTile({ image, index, onOpen, className }: Props) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`Open ${image.title ?? "photo"} full screen`}
      className={cn(
        "group relative block w-full h-full overflow-hidden rounded-card bg-ink/5 cursor-pointer",
        className
      )}
    >
      <Image
        src={image.imageUrl}
        alt={image.altText ?? image.title ?? "Gallery photo"}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        quality={85}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      {image.title && (
        <span className="absolute bottom-3 left-3 right-3 text-sm font-medium text-white opacity-0 translate-y-1 transition-[opacity,transform] duration-200 group-hover:opacity-100 group-hover:translate-y-0">
          {image.title}
        </span>
      )}
    </button>
  );
}
