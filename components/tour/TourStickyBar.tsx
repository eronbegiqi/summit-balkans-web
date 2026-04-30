"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice, formatDateRange } from "@/lib/utils";
import type { Tour, Departure } from "@/lib/types";

interface TourStickyBarProps {
  tour: Tour;
  nextDep: Departure | null;
}

export function TourStickyBar({ tour, nextDep }: TourStickyBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const gallery = document.getElementById("gallery-top");
      if (gallery) {
        setVisible(gallery.getBoundingClientRect().bottom < 0);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[150] bg-dark border-t border-white/10 px-10 py-3.5 flex items-center justify-between gap-6 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex flex-col gap-0.5">
        <div className="font-fraunces text-lg font-bold text-white">{tour.name}</div>
        <div className="font-mono text-xs text-white/45">
          {nextDep
            ? `${formatDateRange(nextDep.startDate, nextDep.endDate)} · ${tour.duration} days`
            : "No upcoming departures"}
        </div>
      </div>

      <div className="font-mono text-xs text-white/50">
        {nextDep ? `${nextDep.spotsLeft} / ${nextDep.spotsTotal} spots left` : ""}
      </div>

      <div className="font-fraunces text-[28px] font-bold text-white whitespace-nowrap">
        {formatPrice(tour.priceFrom)}{" "}
        <small className="font-inter text-sm font-normal text-white/40">/ person</small>
      </div>

      <div className="flex gap-2.5">
        <Link
          href="/tours/book"
          className="bg-terra text-white px-5 py-2.5 rounded-lg font-semibold text-[13px] no-underline hover:opacity-88 transition-opacity"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
