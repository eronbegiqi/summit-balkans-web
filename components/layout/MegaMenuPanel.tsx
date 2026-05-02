"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  featured?: boolean;
}

interface NavColumn {
  heading?: string;
  links: NavLink[];
}

interface FeaturedCard {
  title: string;
  tagline: string;
  href: string;
  image: string;
}

interface Stats {
  items: { value: string; label: string }[];
}

export interface MegaMenuData {
  columns: NavColumn[];
  featured?: FeaturedCard;
  stats?: Stats;
}

interface MegaMenuPanelProps {
  data: MegaMenuData;
  visible: boolean;
}

export function MegaMenuPanel({ data, visible }: MegaMenuPanelProps) {
  return (
    <div
      className={`absolute top-full left-0 right-0 bg-bone border-b-2 border-divider shadow-lg transition-all duration-200 origin-top ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
      aria-hidden={!visible}
    >
      <div className="max-w-content mx-auto px-5 md:px-10 py-8">
        <div className={`grid gap-8 ${data.featured ? "grid-cols-[1fr_260px_160px]" : data.stats ? "grid-cols-[1fr_160px]" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}`}>
          {/* Columns */}
          <div className="flex gap-8">
            {data.columns.map((col, i) => (
              <div key={i} className="min-w-[140px]">
                {col.heading && (
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/35 mb-3">
                    {col.heading}
                  </div>
                )}
                <ul className="space-y-0.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        role="menuitem"
                        className={`flex items-center gap-1.5 py-1.5 text-sm no-underline transition-colors duration-150 group ${
                          link.featured
                            ? "text-brand font-semibold"
                            : "text-ink/70 hover:text-ink"
                        }`}
                      >
                        {link.featured && <span className="text-gold text-xs">★</span>}
                        {link.label}
                        {link.featured && (
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Featured card */}
          {data.featured && (
            <Link
              href={data.featured.href}
              role="menuitem"
              className="group block no-underline"
            >
              <div className="rounded-card overflow-hidden border-2 border-divider">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.featured.image}
                  alt={data.featured.title}
                  className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                />
                <div className="p-3 bg-white">
                  <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-terra mb-1">
                    Featured
                  </div>
                  <div className="font-fraunces text-base font-bold text-ink group-hover:text-brand transition-colors leading-tight">
                    {data.featured.title}
                  </div>
                  <div className="font-mono text-[11px] text-ink/45 mt-1 leading-snug">
                    {data.featured.tagline}
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Stats column */}
          {data.stats && (
            <div className="flex flex-col gap-4 justify-center">
              {data.stats.items.map(({ value, label }) => (
                <div key={label}>
                  <div className="font-mono text-xl font-bold text-ink">{value}</div>
                  <div className="font-mono text-[10px] text-ink/40 uppercase tracking-wider mt-0.5">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
