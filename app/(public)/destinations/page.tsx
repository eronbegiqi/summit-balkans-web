import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "Destinations — Albania, Montenegro & Kosovo",
  description: "Explore hiking destinations in Albania, Montenegro and Kosovo with Summit Balkans.",
};

const countries = [
  {
    id: "albania",
    name: "Albania",
    code: "ALB",
    tagline: "Accursed Mountains & hidden valleys",
    description: "The Albanian Alps — locally called the Bjeshkët e Namuna or Accursed Mountains — are the wildest corner of the Balkans. Stone-built villages, glacial lakes, and trails that feel genuinely undiscovered.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=85",
    highlights: ["Peaks of the Balkans", "Theth & Valbona", "Albanian Alps Circuit"],
  },
  {
    id: "montenegro",
    name: "Montenegro",
    code: "MNE",
    tagline: "Accursed peaks & Adriatic coast",
    description: "A country smaller than Yorkshire with mountains that rival the Alps. Durmitor National Park — a UNESCO World Heritage site — towers above glacial Black Lake. The Tara Canyon is Europe's deepest.",
    image: "/images/montenegro-img.webp",
    highlights: ["Durmitor Ring", "Bobotov Kuk", "Peaks of the Balkans"],
  },
  {
    id: "kosovo",
    name: "Kosovo",
    code: "XK",
    tagline: "Rugova Canyon & Sharr Mountains",
    description: "Europe's newest country is also one of its most surprising. The Rugova Canyon cuts 1,000m through limestone above the city of Peja. The Sharr Mountains on the southern border offer solitude at altitude.",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=85",
    highlights: ["Rugova Via Ferrata", "Peaks of the Balkans", "Sharr Mountains"],
  },
];

export default function DestinationsPage() {
  return (
    <>
      <section className="pt-[72px] bg-bone border-b-2 border-divider">
        <div className="max-w-content mx-auto px-10 py-16">
          <SectionLabel>Where We Go</SectionLabel>
          <h1
            className="font-fraunces font-bold tracking-tight leading-[1.05] max-w-[680px]"
            style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
          >
            Three countries. One range. Endless trails.
          </h1>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-content mx-auto px-10 flex flex-col gap-24">
          {countries.map((country, i) => (
            <div
              key={country.id}
              id={country.id}
              className={`grid md:grid-cols-2 grid-cols-1 md:gap-16 gap-4 items-center ${i % 2 === 1 ? "[direction:rtl]" : ""}`}
            >
              <div className={`rounded-card-hero overflow-hidden border-2 border-divider aspect-[4/3] ${i % 2 === 1 ? "[direction:ltr]" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={country.image} alt={country.name} className="w-full h-full object-cover block" loading="lazy" />
              </div>
              <div className={i % 2 === 1 ? "[direction:ltr]" : ""}>
                <div className="font-mono text-[11px] text-terra tracking-[0.14em] uppercase mb-3">{country.code}</div>
                <h2 className="font-fraunces text-5xl font-bold tracking-tight mb-3">{country.name}</h2>
                <p className="text-lg text-ink/55 mb-6">{country.tagline}</p>
                <p className="text-base leading-[1.7] text-ink/70 mb-8">{country.description}</p>
                <div className="flex flex-col gap-2.5 mb-8">
                  {country.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2 text-sm">
                      <ArrowRight className="w-3.5 h-3.5 text-terra flex-shrink-0" strokeWidth={2} />
                      {h}
                    </div>
                  ))}
                </div>
                <Link href="/tours" className="btn-primary">
                  View {country.name} Tours
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
