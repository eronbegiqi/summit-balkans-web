"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Users, Receipt } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/utils";

const pillars = [
  {
    icon: MapPin,
    title: "Local guides, born here",
    text: "Every guide grew up within a day's walk of the routes they lead. They know the terrain, the families, the shortcuts, and the stories. That's not something you can train. It's something you live.",
  },
  {
    icon: Users,
    title: "Small groups, real trails",
    text: "Maximum 12 travellers. No herding, no rushing, no cutting corners to fit a schedule. Small groups move differently: they fit through village doorways and get invited in for coffee.",
  },
  {
    icon: Receipt,
    title: "No hidden costs",
    text: "The price we quote is the price you pay. Accommodation, meals, transfers, permits, guide: all in. We've built this way because we'd hate the alternative.",
  },
];

const stats = [
  { value: 60, suffix: "+", label: "Routes", decimals: 0 },
  { value: 5, suffix: "★", label: "Avg. Rating", decimals: 1 },
];

function useCounter(target: number, decimals: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(target);
      return;
    }
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

// Reveals each pillar in sequence as the row scrolls into view, so the three
// differentiators read as discrete reasons rather than one flat block.
// Same IntersectionObserver + staggered-delay approach already used for the
// mobile nav reveal in Header.tsx.
function PillarRow({ pillar, index }: { pillar: typeof pillars[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const Icon = pillar.icon;

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col md:flex-row md:items-start gap-3 md:gap-8 py-8 border-t border-white/10 first:border-t-0",
        "transition-[opacity,transform] duration-700 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      )}
      style={{ transitionDelay: visible ? `${index * 90}ms` : "0s" }}
    >
      <div className="flex items-center gap-3 md:w-[280px] shrink-0">
        <Icon className="w-6 h-6 text-warning shrink-0" strokeWidth={1.5} />
        <h3 className="font-fraunces text-xl font-bold text-white">{pillar.title}</h3>
      </div>
      <p className="text-[15px] leading-[1.65] text-white/55 max-w-[560px]">{pillar.text}</p>
    </div>
  );
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
        <sup className="text-[0.4em] ml-3">{suffix}</sup>
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

        {/* Pillars - divided horizontal rows, revealed in sequence on scroll */}
        <div>
          {pillars.map((p, i) => (
            <PillarRow key={p.title} pillar={p} index={i} />
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/8 mt-4 mb-12 md:mb-16" />

        {/* Stats — 1 col mobile → 2 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {stats.map((s) => (
            <StatCounter key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
