"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Same IntersectionObserver + staggered-CSS-transition reveal pattern used
// for the homepage differentiator rows (components/sections/WhySummitBalkans.tsx),
// reused here so tiles scroll into view in sequence instead of popping in at once.
// The stagger cycles every 8 tiles so later rows don't inherit a long tail delay.
export function RevealTile({
  index,
  className,
  children,
}: {
  index: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
      style={{ transitionDelay: visible ? `${(index % 8) * 60}ms` : "0s" }}
    >
      {children}
    </div>
  );
}
