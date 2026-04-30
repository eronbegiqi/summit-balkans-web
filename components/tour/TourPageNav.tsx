"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "itinerary", label: "Itinerary" },
  { id: "included", label: "Included" },
  { id: "dates", label: "Dates & Prices" },
  { id: "faq", label: "FAQ" },
  { id: "reviews", label: "Reviews" },
];

export function TourPageNav() {
  const [active, setActive] = useState("overview");

  useEffect(() => {
    const onScroll = () => {
      let current = "overview";
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 140) current = s.id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="sticky top-[68px] z-[100] bg-bone border-b-2 border-divider"
      aria-label="Tour sections"
    >
      <div
        className="max-w-content mx-auto px-10 flex overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={cn(
              "flex-none px-5 py-4 text-sm font-medium no-underline border-b-[2.5px] -mb-[2px] whitespace-nowrap transition-all duration-200",
              active === s.id
                ? "text-terra border-terra"
                : "text-ink/50 border-transparent hover:text-ink"
            )}
          >
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
