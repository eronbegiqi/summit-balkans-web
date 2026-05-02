"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ChevronDown } from "lucide-react";

export function PoBHero() {
  const chevronRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chevronRef.current) return;
    gsap.to(chevronRef.current, {
      y: 10,
      repeat: -1,
      yoyo: true,
      duration: 1.2,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <section
      id="overview"
      className="relative w-full h-screen min-h-[640px] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2000&q=90"
        alt="Peaks of the Balkans — Accursed Mountains"
        className="absolute inset-0 w-full h-full object-cover object-center"
        fetchPriority="high"
      />

      {/* Gradient overlay — dark bottom-up */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/15 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-content mx-auto px-5 md:px-10 w-full flex flex-col items-center text-center">
        {/* Eyebrow */}
        <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-white/65 mb-5">
          ★ Flagship Experience
        </div>

        {/* Headline */}
        <h1 className="font-fraunces font-bold text-white leading-[0.95] tracking-tight mb-5"
          style={{ fontSize: "clamp(3.2rem, 8vw, 7rem)" }}
        >
          Peaks of<br className="hidden sm:block" /> the Balkans
        </h1>

        {/* Subhead */}
        <p className="text-white/75 text-lg md:text-xl max-w-xl leading-relaxed mb-8">
          A 192 km cross-border journey through Europe's last wild mountains.
        </p>

        {/* Stat pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {[
            { value: "192 KM", label: "total distance" },
            { value: "10–13 DAYS", label: "duration" },
            { value: "3 COUNTRIES", label: "Kosovo · Albania · Montenegro" },
          ].map(({ value, label }) => (
            <div
              key={value}
              className="flex flex-col items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3"
            >
              <span className="font-mono text-sm font-semibold text-white tracking-wider">
                {value}
              </span>
              <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest mt-0.5">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="#dates"
            className="bg-brand text-white font-semibold text-sm px-7 py-3.5 rounded-lg no-underline hover:bg-brand/90 transition-colors"
          >
            View Departures
          </a>
          <Link
            href="/private-trips"
            className="border-2 border-white/35 text-white font-semibold text-sm px-7 py-3.5 rounded-lg no-underline hover:border-white/65 hover:bg-white/6 transition-all"
          >
            Plan a Private Group
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={chevronRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <ChevronDown className="w-7 h-7 text-white/40" strokeWidth={1.5} />
      </div>

      {/* Gallery anchor for sticky bar trigger */}
      <div id="gallery-top" className="absolute bottom-0 left-0 w-1 h-1" />
    </section>
  );
}
