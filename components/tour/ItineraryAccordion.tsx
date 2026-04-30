"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ItineraryDay } from "@/lib/types";

interface ItineraryAccordionProps {
  days: ItineraryDay[];
}

export function ItineraryAccordion({ days }: ItineraryAccordionProps) {
  const [open, setOpen] = useState<number>(1);

  return (
    <div className="flex flex-col gap-0">
      {days.map((day) => {
        const isOpen = open === day.day;
        return (
          <div
            key={day.day}
            className="border-2 border-divider rounded-card overflow-hidden mb-2.5 bg-white"
          >
            <button
              onClick={() => setOpen(isOpen ? -1 : day.day)}
              className={cn(
                "w-full flex items-center gap-5 px-6 py-5 cursor-pointer text-left bg-transparent border-none transition-colors duration-150",
                "hover:bg-ink/[0.02]"
              )}
            >
              <span className="font-mono text-xs font-medium bg-ink text-white px-2.5 py-1 rounded-md flex-shrink-0">
                Day {day.day}
              </span>
              <span className="font-fraunces text-lg font-semibold flex-1 tracking-tight">
                {day.title}
              </span>
              <div className="flex gap-4 flex-shrink-0">
                {day.distance > 0 && (
                  <span className="font-mono text-[11px] text-ink/40 flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12h18M9 6l-6 6 6 6"/>
                    </svg>
                    {day.distance} km
                  </span>
                )}
                {day.elevation > 0 && (
                  <span className="font-mono text-[11px] text-ink/40 flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                    +{day.elevation}m
                  </span>
                )}
              </div>
              <ChevronDown
                className={cn("w-[18px] h-[18px] text-ink/35 flex-shrink-0 transition-transform duration-200", isOpen && "rotate-180")}
                strokeWidth={1.5}
              />
            </button>

            {isOpen && (
              <div className="px-6 pb-6 pl-[72px]">
                <p className="text-[15px] leading-[1.7] text-ink/68">{day.description}</p>
                {day.accommodation && (
                  <p className="mt-3 text-xs text-ink/40 font-mono">
                    Accommodation: {day.accommodation}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
