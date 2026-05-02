"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { differenceInCalendarDays, parseISO } from "date-fns";

gsap.registerPlugin(ScrollTrigger);

interface Segment {
  range: string;
  fee: string;
  emoji: string;
  label: string;
  bg: string;
  border: string;
  textColor: string;
  zone: [number, number]; // [minDays, maxDays] inclusive; maxDays=Infinity for 45+
}

const segments: Segment[] = [
  {
    range: "45+ days",
    fee: "Loss of deposit",
    emoji: "🟢",
    label: "Best window",
    bg: "bg-green-50",
    border: "border-green-200",
    textColor: "text-green-800",
    zone: [45, Infinity],
  },
  {
    range: "44–30 days",
    fee: "30% of total",
    emoji: "🟡",
    label: "Caution",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    textColor: "text-yellow-800",
    zone: [30, 44],
  },
  {
    range: "29–15 days",
    fee: "60% of total",
    emoji: "🟠",
    label: "High cost",
    bg: "bg-orange-50",
    border: "border-orange-200",
    textColor: "text-orange-800",
    zone: [15, 29],
  },
  {
    range: "14 days or less",
    fee: "100% — no refund",
    emoji: "🔴",
    label: "No refund",
    bg: "bg-red-50",
    border: "border-red-200",
    textColor: "text-red-800",
    zone: [0, 14],
  },
];

interface Props {
  departureDate?: string; // ISO date string e.g. "2026-07-07"
}

export function CancellationTimeline({ departureDate }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement[]>([]);

  const daysRemaining = departureDate
    ? differenceInCalendarDays(parseISO(departureDate), new Date())
    : null;

  const activeZone =
    daysRemaining !== null
      ? segments.findIndex(
          (s) => daysRemaining >= s.zone[0] && daysRemaining <= s.zone[1]
        )
      : -1;

  // Marker position: map days to 0-100% left position across a 56-day window
  // Left edge = far from departure (green), right edge = close (red)
  const markerLeft =
    daysRemaining !== null
      ? `${Math.max(0, Math.min(100, 100 - (Math.min(daysRemaining, 56) / 56) * 100))}%`
      : null;

  useGSAP(
    () => {
      if (!barsRef.current.length) return;

      gsap.fromTo(
        barsRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          transformOrigin: "left center",
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 88%",
            once: true,
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="mb-6">
      {/* Desktop horizontal layout */}
      <div className="hidden sm:grid grid-cols-4 gap-1.5 relative">
        {segments.map((seg, i) => (
          <div
            key={seg.range}
            ref={(el) => {
              if (el) barsRef.current[i] = el;
            }}
            className={`rounded-xl border-2 p-4 ${seg.bg} ${seg.border} ${
              activeZone === i ? "ring-2 ring-offset-1 ring-brand/40" : ""
            }`}
          >
            <div className={`font-mono text-xs font-semibold mb-1 ${seg.textColor}`}>
              {seg.range}
            </div>
            <div className={`text-[13px] font-medium ${seg.textColor} mb-2`}>
              {seg.fee}
            </div>
            <div className="text-[12px] text-ink/45">
              {seg.emoji} {seg.label}
            </div>
            {activeZone === i && daysRemaining !== null && (
              <div className="mt-2 text-[11px] font-mono font-semibold text-brand bg-brand/10 px-2 py-0.5 rounded-md inline-block">
                You are here · {daysRemaining}d left
              </div>
            )}
          </div>
        ))}

        {/* Today marker — only if departureDate provided */}
        {markerLeft && (
          <div
            className="absolute top-0 bottom-0 w-px border-l-2 border-dashed border-brand/60 pointer-events-none z-10"
            style={{ left: markerLeft }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Mobile stacked layout */}
      <div className="flex flex-col gap-2 sm:hidden">
        {segments.map((seg, i) => (
          <div
            key={seg.range}
            className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 ${seg.bg} ${seg.border} ${
              activeZone === i ? "ring-2 ring-offset-1 ring-brand/40" : ""
            }`}
          >
            <span className="text-xl">{seg.emoji}</span>
            <div className="flex-1">
              <div className={`font-mono text-xs font-semibold ${seg.textColor}`}>
                {seg.range}
              </div>
              <div className={`text-[13px] ${seg.textColor}`}>{seg.fee}</div>
            </div>
            {activeZone === i && daysRemaining !== null && (
              <div className="text-[11px] font-mono font-semibold text-brand bg-brand/10 px-2 py-0.5 rounded-md">
                {daysRemaining}d
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3">
        <Link
          href="/legal/booking-terms#5-cancellation-by-traveler"
          target="_blank"
          className="text-[13px] text-brand no-underline hover:underline underline-offset-2 font-medium transition-colors"
        >
          Read full cancellation policy →
        </Link>
      </div>
    </div>
  );
}
