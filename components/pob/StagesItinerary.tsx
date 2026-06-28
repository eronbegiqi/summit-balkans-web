"use client";

import { useState } from "react";
import { ItineraryAccordion } from "@/components/tour/ItineraryAccordion";
// PoBItineraryAccordion delegates to ItineraryAccordion (single-open) or expands all
import { itinerary } from "@/data/tours";

export function StagesItinerary() {
  const [allOpen, setAllOpen] = useState(false);

  return (
    <section id="stages" className="py-20 md:py-28 bg-bone">
      <div className="max-w-content mx-auto px-5 md:px-10">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-terra mb-3">
              Day by Day
            </div>
            <h2 className="font-fraunces text-[clamp(2rem,4vw,2.8rem)] font-bold tracking-tight">
              10 stages, 10 stories
            </h2>
          </div>
          <button
            onClick={() => setAllOpen((v) => !v)}
            className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink/50 hover:text-ink border-2 border-divider hover:border-ink/40 px-4 py-2 rounded-lg transition-all bg-transparent cursor-pointer whitespace-nowrap"
          >
            {allOpen ? "Close All" : "Open All"}
          </button>
        </div>

        {/* Route overview strip */}
        {/* <div className="mb-8 overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max pb-1">
            {itinerary.map((day, i) => (
              <div key={day.day} className="flex items-center gap-1">
                <div className="flex flex-col items-center">
                  <div className="font-mono text-[10px] text-ink/40 mb-1">D{day.day}</div>
                  <div
                    className="w-2 h-2 rounded-full bg-forest"
                    style={{ opacity: 0.4 + (i / itinerary.length) * 0.6 }}
                  />
                </div>
                {i < itinerary.length - 1 && (
                  <div className="w-6 h-px bg-divider" />
                )}
              </div>
            ))}
          </div>
        </div> */}

        <PoBItineraryAccordion forceOpen={allOpen} />
      </div>
    </section>
  );
}

function PoBItineraryAccordion({ forceOpen }: { forceOpen: boolean }) {
  if (forceOpen) {
    return (
      <div className="flex flex-col gap-0">
        {itinerary.map((day) => (
          <div
            key={day.day}
            className="border-2 border-divider rounded-card overflow-hidden mb-2.5 bg-white"
          >
            <div className="w-full flex items-center gap-5 px-6 py-5">
              <span className="font-mono text-xs font-medium bg-ink text-white px-2.5 py-1 rounded-md flex-shrink-0">
                Day {day.day}
              </span>
              <span className="font-fraunces text-lg font-semibold flex-1 tracking-tight">
                {day.title}
              </span>
              <div className="flex gap-4 flex-shrink-0">
                {day.distance > 0 && (
                  <span className="font-mono text-[11px] text-ink/40">{day.distance} km</span>
                )}
                {day.elevation > 0 && (
                  <span className="font-mono text-[11px] text-ink/40">+{day.elevation}m</span>
                )}
              </div>
            </div>
            <div className="px-6 pb-6 pl-[72px]">
              <p className="text-[15px] leading-[1.7] text-ink/68">{day.description}</p>
              {day.accommodation && (
                <p className="mt-3 text-xs text-ink/40 font-mono">
                  Accommodation: {day.accommodation}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <ItineraryAccordion days={itinerary} />;
}
