"use client";

import { useState } from "react";

interface TourGalleryProps {
  images: string[];
  tourName: string;
}

export function TourGallery({ images, tourName }: TourGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const switchTo = (idx: number) => {
    if (idx === current) return;
    setFading(true);
    setTimeout(() => {
      setCurrent(idx);
      setFading(false);
    }, 220);
  };

  return (
    <div className="pt-[68px]">
      {/* Main image */}
      <div className="relative bg-dark overflow-hidden" style={{ height: "65vh", minHeight: 500 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${images[current]}&w=1600`}
          alt={`${tourName} — photo ${current + 1}`}
          className={`w-full h-full object-cover block transition-opacity duration-[220ms] ${fading ? "opacity-0" : "opacity-100"}`}
        />
        <div className="absolute top-5 right-5 font-mono text-xs bg-dark/65 text-white/80 px-3 py-1.5 rounded-full backdrop-blur-sm">
          {current + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 p-3 bg-dark overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => switchTo(i)}
            className={`flex-none w-[120px] h-[72px] rounded-md overflow-hidden border-2 transition-all cursor-pointer bg-transparent p-0 ${
              i === current ? "border-terra opacity-100" : "border-transparent opacity-60 hover:opacity-85"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${src}&w=240`}
              alt=""
              className="w-full h-full object-cover block pointer-events-none"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
