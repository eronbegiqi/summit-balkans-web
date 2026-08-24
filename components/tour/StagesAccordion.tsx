"use client";

import { useState } from "react";
import { ChevronDown, ArrowRight, TrendingUp, TrendingDown, Mountain } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stage {
  id: number;
  dayNumber: number;
  title: string;
  description: string | null;
  fromLocation: string | null;
  toLocation: string | null;
  distanceKm: string | null;
  lowestPointM: number | null;
  highestPointM: number | null;
  elevationGainM: number | null;
  elevationLossM: number | null;
  difficulty: string | null;
  highlights: string[] | null;
  accommodation: string | null;
  terrain: string | null;
}

export function StagesAccordion({ stages }: { stages: Stage[] }) {
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([stages[0]?.dayNumber]));
  const allOpen = openDays.size === stages.length;

  const toggleAll = () => {
    if (allOpen) {
      setOpenDays(new Set());
    } else {
      setOpenDays(new Set(stages.map((s) => s.dayNumber)));
    }
  };

  const toggle = (day: number) => {
    setOpenDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  return (
    <div className="mt-4">
      <div className="flex justify-end mb-3">
        <button
          onClick={toggleAll}
          className="font-mono text-[12.5px] text-brand hover:underline tracking-wide"
        >
          {allOpen ? "Close All" : "Open All"}
        </button>
      </div>

      <div className="space-y-2">
        {stages.map((stage) => {
          const isOpen = openDays.has(stage.dayNumber);
          return (
            <div
              key={stage.id}
              className={cn(
                "border-2 rounded-xl overflow-hidden transition-colors bg-white",
                isOpen ? "border-brand/30" : "border-divider"
              )}
            >
              {/* Header */}
              <button
                onClick={() => toggle(stage.dayNumber)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-ink/2 transition-colors"
              >
                <span className="font-mono text-[12.5px] text-ink/40 tracking-widest shrink-0 w-10 whitespace-nowrap">
                  Day {stage.dayNumber}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink leading-tight truncate">{stage.title}</p>
                  {stage.fromLocation && stage.toLocation && (
                    <p className="text-xs text-ink/45 mt-0.5 flex items-center gap-1">
                      {stage.fromLocation}
                      <ArrowRight className="w-3 h-3 shrink-0" />
                      {stage.toLocation}
                    </p>
                  )}
                </div>
                {/* Mini stats */}
                <div className="hidden sm:flex items-center gap-4 text-sm text-ink/45 shrink-0">
                  {stage.distanceKm && (
                    <span>{Number(stage.distanceKm).toFixed(1)} km</span>
                  )}
                  {stage.elevationGainM && (
                    <span className="flex items-center gap-0.5 text-brand/70">
                      <TrendingUp className="w-3 h-3" /> {stage.elevationGainM} m
                    </span>
                  )}
                  {stage.highestPointM && (
                    <span className="flex items-center gap-0.5">
                      <Mountain className="w-3 h-3" /> {stage.highestPointM.toLocaleString()} m
                    </span>
                  )}
                </div>
                <ChevronDown
                  className={cn("w-4 h-4 text-ink/40 shrink-0 transition-transform duration-200", isOpen && "rotate-180")}
                  strokeWidth={1.5}
                />
              </button>

              {/* Body */}
              {isOpen && (
                <div className="px-5 pb-5 border-t border-divider/50">
                  {/* Elevation bar */}
                  {(stage.lowestPointM || stage.highestPointM || stage.elevationGainM || stage.elevationLossM) && (
                    <div className="flex flex-wrap gap-4 py-4 text-sm">
                      {stage.lowestPointM && (
                        <span className="flex items-center gap-1.5 text-ink/60">
                          <TrendingDown className="w-3.5 h-3.5 text-ink/40" strokeWidth={1.5} />
                          Low: <strong>{stage.lowestPointM.toLocaleString()} m</strong>
                        </span>
                      )}
                      {stage.highestPointM && (
                        <span className="flex items-center gap-1.5 text-ink/60">
                          <Mountain className="w-3.5 h-3.5 text-brand" strokeWidth={1.5} />
                          High: <strong>{stage.highestPointM.toLocaleString()} m</strong>
                        </span>
                      )}
                      {stage.elevationGainM && (
                        <span className="flex items-center gap-1.5 text-brand">
                          <TrendingUp className="w-3.5 h-3.5" strokeWidth={1.5} />
                          +{stage.elevationGainM} m gain
                        </span>
                      )}
                      {stage.elevationLossM && (
                        <span className="flex items-center gap-1.5 text-ink/50">
                          <TrendingDown className="w-3.5 h-3.5" strokeWidth={1.5} />
                          -{stage.elevationLossM} m loss
                        </span>
                      )}
                      {stage.terrain && (
                        <span className="font-mono text-xs bg-ink/5 px-2 py-1 rounded">{stage.terrain}</span>
                      )}
                      {stage.difficulty && (
                        <span className="font-mono text-xs bg-brand/10 text-brand px-2 py-1 rounded">{stage.difficulty}</span>
                      )}
                    </div>
                  )}

                  {stage.description && (
                    <p className="text-sm text-ink/70 leading-relaxed mt-1">{stage.description}</p>
                  )}

                  {stage.highlights && stage.highlights.length > 0 && (
                    <div className="mt-4">
                      <p className="font-semibold text-xs text-ink/50 uppercase tracking-wider mb-2">Highlights</p>
                      <ul className="flex flex-wrap gap-1.5">
                        {stage.highlights.map((h) => (
                          <li key={h} className="font-mono text-[11px] bg-brand/8 text-brand px-2.5 py-1 rounded-full">
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {stage.accommodation && (
                    <p className="mt-4 text-xs text-ink/50">
                      🏠 <span className="font-medium text-ink/70">Accommodation:</span> {stage.accommodation}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
