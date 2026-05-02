"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const LEVELS: Record<number, { label: string; color: string }> = {
  1: { label: "Easy",           color: "#65B741" },
  2: { label: "Easy-Moderate",  color: "#A4C639" },
  3: { label: "Moderate",       color: "#F4A03E" },
  4: { label: "Challenging",    color: "#E66B3D" },
  5: { label: "Expert",         color: "#D43A3A" },
};

interface DifficultyIndicatorProps {
  level: 1 | 2 | 3 | 4 | 5;
  className?: string;
  animate?: boolean;
}

export function DifficultyIndicator({ level, className, animate = false }: DifficultyIndicatorProps) {
  const dotsRef = useRef<HTMLDivElement>(null);
  const { label, color } = LEVELS[level];

  useEffect(() => {
    if (!animate || !dotsRef.current) return;
    const dots = dotsRef.current.querySelectorAll("[data-dot]");
    gsap.fromTo(
      dots,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        stagger: 0.07,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: dotsRef.current,
          start: "top 85%",
          once: true,
        },
      }
    );
    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, [animate, level]);

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div ref={dotsRef} className="flex gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < level;
          return (
            <span
              key={i}
              data-dot
              className="w-2.5 h-2.5 rounded-full block"
              style={{
                backgroundColor: filled ? color : "#C9CFC8",
              }}
              aria-hidden="true"
            />
          );
        })}
      </div>
      <span className="font-mono text-[11px] tracking-[0.08em] uppercase" style={{ color: color }}>
        {label}
      </span>
    </div>
  );
}
