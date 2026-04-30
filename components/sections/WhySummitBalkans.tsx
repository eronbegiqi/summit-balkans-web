"use client";

import { useEffect, useRef, useState } from "react";
import { Users, Map, DollarSign } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";

const pillars = [
  {
    icon: Users,
    title: "Local guides, born here",
    text: "Every guide grew up within a day's walk of the routes they lead. They know the terrain, the families, the shortcuts, and the stories. That's not something you can train — it's something you live.",
  },
  {
    icon: Map,
    title: "Small groups, real trails",
    text: "Maximum 12 travellers. No herding, no rushing, no cutting corners to fit a schedule. Small groups move differently — they fit through village doorways and get invited in for coffee.",
  },
  {
    icon: DollarSign,
    title: "No hidden costs",
    text: "The price we quote is the price you pay. Accommodation, meals, transfers, permits, guide — all in. We've built this way because we'd hate the alternative.",
  },
];

const stats = [
  { value: 200, suffix: "+", label: "Travellers" },
  { value: 60, suffix: "+", label: "Routes" },
  { value: 4.9, suffix: "★", label: "Avg. Rating" },
];

function useCounter(target: number, decimals = 0, active: boolean) {
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

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const decimals = value % 1 !== 0 ? 1 : 0;
  const count = useCounter(value, decimals, active);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center px-10 border-r border-white/10 last:border-r-0">
      <div
        className="font-fraunces font-bold text-white leading-[1] mb-2 tracking-[-0.03em]"
        style={{ fontSize: "64px", fontVariationSettings: "'opsz' 60" }}
      >
        {count.toFixed(decimals)}
        <sup className="text-[28px]">{suffix}</sup>
      </div>
      <div className="font-mono text-xs text-white/40 tracking-[0.1em] uppercase">
        {label}
      </div>
    </div>
  );
}

export function WhySummitBalkans() {
  return (
    <section className="bg-dark py-24 relative overflow-hidden">
      {/* Topo overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Cpath d='M0,300 C60,240 120,280 180,300 C240,320 300,260 360,300 C420,340 480,280 540,300 C560,308 580,310 600,300' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3Cpath d='M0,260 C60,200 120,240 180,260 C240,280 300,220 360,260 C420,300 480,240 540,260 C560,268 580,270 600,260' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3Cpath d='M0,340 C60,280 120,320 180,340 C240,360 300,300 360,340 C420,380 480,320 540,340 C560,348 580,350 600,340' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3Cpath d='M0,220 C60,160 120,200 180,220 C240,240 300,180 360,220 C420,260 480,200 540,220 C560,228 580,230 600,220' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3Cpath d='M0,380 C60,320 120,360 180,380 C240,400 300,340 360,380 C420,420 480,360 540,380 C560,388 580,390 600,380' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      <div className="max-w-content mx-auto px-10 relative z-10">
        <SectionLabel light>Why Summit Balkans</SectionLabel>
        <h2
          className="font-fraunces font-bold text-white tracking-tight leading-[1.1] mb-16"
          style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
        >
          Built differently, on purpose.
        </h2>

        <div className="grid grid-cols-3 gap-12">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title}>
                <Icon className="w-6 h-6 text-gold mb-5" strokeWidth={1.5} />
                <h3 className="font-fraunces text-2xl font-bold text-white mb-3">
                  {p.title}
                </h3>
                <p className="text-[15px] leading-[1.65] text-white/55">{p.text}</p>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/8 my-16" />

        {/* Stats */}
        <div className="grid grid-cols-3">
          {stats.map((s) => (
            <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
