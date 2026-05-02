"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  headings: { id: string; label: string }[];
}

export function LegalTOC({ headings }: Props) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-15% 0% -72% 0%", threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-28 sticky-toc hidden xl:block" aria-label="Table of contents">
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/35 mb-4">
        On this page
      </p>
      <ul className="list-none space-y-1.5">
        {headings.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={cn(
                "block text-[13px] leading-snug transition-colors duration-150 no-underline pl-3 border-l-2",
                active === id
                  ? "text-brand font-medium border-brand"
                  : "text-ink/45 hover:text-ink border-transparent hover:border-mist"
              )}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
