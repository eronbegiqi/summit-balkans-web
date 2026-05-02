"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "route", label: "Route" },
  { id: "history", label: "History" },
  { id: "highlights", label: "Highlights" },
  { id: "stages", label: "Stages" },
  { id: "culture", label: "Culture" },
  { id: "dates", label: "Dates & Prices" },
  { id: "faq", label: "FAQ" },
];

export function PoBMiniNav() {
  const [active, setActive] = useState("overview");
  const [visible, setVisible] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const scrolling = useRef(false);

  useEffect(() => {
    const hero = document.getElementById("overview");
    if (!hero) return;

    const onScroll = () => {
      const heroBottom = hero.getBoundingClientRect().bottom;
      setVisible(heroBottom < 80);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !scrolling.current) {
            setActive(id);
          }
        },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    scrolling.current = true;
    setActive(id);
    const headerH = 64;
    const miniNavH = navRef.current?.offsetHeight ?? 48;
    const y = el.getBoundingClientRect().top + window.scrollY - headerH - miniNavH - 16;
    window.scrollTo({ top: y, behavior: "smooth" });
    setTimeout(() => { scrolling.current = false; }, 800);
  };

  return (
    <nav
      ref={navRef}
      aria-label="Page sections"
      className={cn(
        "fixed left-0 right-0 z-[90] bg-bone/95 backdrop-blur-md border-b border-mist/60 transition-all duration-300",
        "top-16",
        visible ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-full opacity-0 pointer-events-none"
      )}
    >
      <div className="max-w-content mx-auto px-5 md:px-10 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-0 min-w-max">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={cn(
                "font-mono text-[11px] tracking-wider uppercase px-4 py-3.5 border-b-2 transition-all duration-200 bg-transparent border-x-0 border-t-0 cursor-pointer whitespace-nowrap",
                active === id
                  ? "border-b-brand text-brand font-semibold"
                  : "border-b-transparent text-ink/45 hover:text-ink"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
