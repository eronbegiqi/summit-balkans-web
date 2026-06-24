import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";

const countries = [
  {
    name: "Albania",
    tag: "Accursed Mountains & hidden valleys",
    code: "ALBANIA",
    href: "/destinations#albania",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=85",
  },
  {
    name: "Montenegro",
    tag: "Montenegro peaks & Adriatic coast",
    code: "MONTENEGRO",
    href: "/destinations#montenegro",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=900&q=85",
  },
  {
    name: "Kosovo",
    tag: "Rugova Canyon & Sharr Mountains",
    code: "KOSOVO",
    href: "/destinations#kosovo",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&q=85",
  },
];

export function WhereWeGo() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-4 md:px-10">
        <div className="mb-10 md:mb-12">
          <SectionLabel>Where We Go</SectionLabel>
          <h2
            className="font-fraunces font-bold tracking-tight leading-[1.1]"
            style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
          >
            Three countries. One trail.
          </h2>
        </div>

        {/* Single col on mobile, 3 cols on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {countries.map((c) => (
            <Link
              key={c.name}
              href={c.href}
              className="relative rounded-card-hero overflow-hidden cursor-pointer border-2 border-transparent hover:-translate-y-1 hover:border-brand active:scale-[0.98] transition-all duration-200 no-underline group block"
              style={{ aspectRatio: "16/10" }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  loading="lazy"
                />
              </div>

              {/* Stronger gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(14,19,16,0.85) 0%, rgba(14,19,16,0.40) 40%, rgba(14,19,16,0) 70%)",
                }}
              />

              {/* Text */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                <div className="font-mono text-[11px] text-warning tracking-[0.14em] uppercase mb-1.5">
                  {c.code}
                </div>
                <div
                  className="font-fraunces font-bold text-white tracking-[-0.02em] mb-1.5"
                  style={{ fontSize: "clamp(22px, 3vw, 32px)" }}
                >
                  {c.name}
                </div>
                <div className="text-base md:text-lg text-white/85 leading-snug">{c.tag}</div>
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-white mt-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                  Explore {c.name}
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
