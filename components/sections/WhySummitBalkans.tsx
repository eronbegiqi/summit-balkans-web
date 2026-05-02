"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Users, Receipt } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";

const pillars = [
  {
    icon: MapPin,
    title: "Local guides, born here",
    text: "Every guide grew up within a day's walk of the routes they lead. They know the terrain, the families, the shortcuts, and the stories. That's not something you can train — it's something you live.",
  },
  {
    icon: Users,
    title: "Small groups, real trails",
    text: "Maximum 12 travellers. No herding, no rushing, no cutting corners to fit a schedule. Small groups move differently — they fit through village doorways and get invited in for coffee.",
  },
  {
    icon: Receipt,
    title: "No hidden costs",
    text: "The price we quote is the price you pay. Accommodation, meals, transfers, permits, guide — all in. We've built this way because we'd hate the alternative.",
  },
];

const stats = [
  { value: 200, suffix: "+", label: "Travellers", decimals: 0 },
  { value: 60, suffix: "+", label: "Routes", decimals: 0 },
  { value: 4.9, suffix: "★", label: "Avg. Rating", decimals: 1 },
];

function useCounter(target: number, decimals: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const duration = 1600;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      setCount(parseFloat(current.toFixed(decimals)));
      if (current >= target) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [active, target, decimals]);
  return count;
}

function StatCounter({ value, suffix, label, decimals }: typeof stats[0]) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const count = useCounter(value, decimals, active);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setActive(true); },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center py-6 md:py-0 md:px-10 border-b md:border-b-0 md:border-r border-white/10 last:border-0">
      <div
        className="font-fraunces font-bold text-white leading-[1] mb-2 tracking-[-0.03em]"
        style={{ fontSize: "clamp(48px, 8vw, 64px)", fontVariationSettings: "'opsz' 60" }}
      >
        {count.toFixed(decimals)}
        <sup className="text-[0.4em]">{suffix}</sup>
      </div>
      <div className="font-mono text-xs text-white/40 tracking-[0.1em] uppercase">{label}</div>
    </div>
  );
}

export function WhySummitBalkans() {
  return (
    <section className="bg-ink py-16 md:py-24 relative overflow-hidden">
      {/* Topo overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Cpath d='M0,300 C60,240 120,280 180,300 C240,320 300,260 360,300 C420,340 480,280 540,300 C560,308 580,310 600,300' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3Cpath d='M0,260 C60,200 120,240 180,260 C240,280 300,220 360,260 C420,300 480,240 540,260' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3Cpath d='M0,340 C60,280 120,320 180,340 C240,360 300,300 360,340 C420,380 480,320 540,340' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      <div className="max-w-content mx-auto px-4 md:px-10 relative z-10">
        <SectionLabel light>Why Summit Balkans</SectionLabel>
        <h2
          className="font-fraunces font-bold text-white tracking-tight leading-[1.1] mb-12 md:mb-16"
          style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
        >
          Built differently, on purpose.
        </h2>

        {/* Pillars — 1 col mobile → 3 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="text-center md:text-left">
                <Icon className="w-6 h-6 text-warning mb-4 mx-auto md:mx-0" strokeWidth={1.5} />
                <h3 className="font-fraunces text-2xl font-bold text-white mb-3">{p.title}</h3>
                <p className="text-[15px] leading-[1.65] text-white/55">{p.text}</p>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/8 my-12 md:my-16" />

        {/* Stats — 1 col mobile → 3 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          {stats.map((s) => (
            <StatCounter key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
