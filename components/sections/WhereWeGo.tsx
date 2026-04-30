import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";

const countries = [
  {
    name: "Albania",
    tag: "Accursed Mountains & hidden valleys",
    code: "ALBANIA",
    href: "/destinations#albania",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=85",
  },
  {
    name: "Montenegro",
    tag: "Durmitor peaks & Adriatic coast",
    code: "MONTENEGRO",
    href: "/destinations#montenegro",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=85",
  },
  {
    name: "Kosovo",
    tag: "Rugova Canyon & Sharr Mountains",
    code: "KOSOVO",
    href: "/destinations#kosovo",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=85",
  },
];

export function WhereWeGo() {
  return (
    <section className="py-24">
      <div className="max-w-content mx-auto px-10">
        <div className="mb-12">
          <SectionLabel>Where We Go</SectionLabel>
          <h2
            className="font-fraunces font-bold tracking-tight leading-[1.1]"
            style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
          >
            Three countries. One trail.
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-5">
          {countries.map((c) => (
            <Link
              key={c.name}
              href={c.href}
              className="relative rounded-card-hero overflow-hidden cursor-pointer border-2 border-transparent hover:-translate-y-1 hover:border-terra transition-all duration-200 no-underline group"
              style={{ aspectRatio: "3/4" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.image}
                alt={c.name}
                className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-[1.04]"
              />
              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark/82 via-dark/10 to-transparent" />

              {/* Text */}
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <div className="font-mono text-[11px] text-gold tracking-[0.14em] uppercase mb-1.5">
                  {c.code}
                </div>
                <div
                  className="font-fraunces font-bold text-white tracking-[-0.02em] mb-2"
                  style={{ fontSize: "32px" }}
                >
                  {c.name}
                </div>
                <div className="text-sm text-white/70">{c.tag}</div>
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-white mt-4 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                  Explore
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
