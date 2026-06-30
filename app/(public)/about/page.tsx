import type { Metadata } from "next";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CTABand } from "@/components/sections/CTABand";
import { db } from "@/lib/db/client";
import { guides } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { CheckCircle2 } from "lucide-react";
import { parseJsonField } from "@/lib/db/utils";

export const metadata: Metadata = {
  title: "About Us — Summit Balkans",
  description: "Summit Balkans is a mountain adventure and trekking organisation based in the heart of the Western Balkans.",
};

const WHAT_WE_DO = [
  "Guided multi-day trekking tours led by experienced local guides who combine safety, knowledge, and storytelling",
  "Self-guided trekking packages designed for independent hikers who want flexibility with structured logistical support",
  "Tailor-made adventure experiences for individuals, groups, families, and organisations",
  "Logistical coordination, including accommodation in authentic guesthouses, luggage transfers, and route planning",
  "Cultural immersion experiences, connecting travellers with local communities, traditions, and cuisine",
  "Special interest tours, including photography, nature exploration, and educational outdoor programmes",
];

const WHAT_WE_OFFER = [
  "Professional local guiding services (for guided tours)",
  "Carefully designed itineraries tested in real mountain conditions",
  "Accommodation in hand-selected local guesthouses",
  "Most meals during the trekking experience, focusing on traditional and locally sourced food",
  "Luggage transfer services on supported routes",
  "Transfers and logistical coordination where required",
  "Safety-first approach with emergency preparedness and mountain awareness",
  "Seamless balance between adventure and comfort",
];

const DIFFERENTIATORS = [
  {
    num: "1",
    title: "Deep Local Connection",
    text: "We are rooted in the region. Our guides, partners, and network are local, which means every journey is enriched with authentic knowledge, real stories, and genuine cultural connection.",
  },
  {
    num: "2",
    title: "Responsible and Inclusive Tourism",
    text: "We actively support local economies by working with family-run guesthouses, small businesses, and rural communities. Our model ensures that tourism benefits the people who live in the mountains.",
  },
  {
    num: "3",
    title: "Authentic Experiences, Not Mass Tourism",
    text: "We avoid overcrowded commercial routes and instead focus on immersive, meaningful travel experiences where nature and culture remain untouched and real.",
  },
  {
    num: "4",
    title: "Flexibility and Personalisation",
    text: "Whether you prefer a fully guided expedition or a self-guided adventure, we adapt the experience to your needs, skill level, and travel style.",
  },
  {
    num: "5",
    title: "Strong Focus on Safety and Quality",
    text: "Mountain travel requires expertise. Our itineraries are carefully planned, risk-assessed, and supported by experienced professionals who understand alpine terrain.",
  },
  {
    num: "6",
    title: "A Mission Beyond Tourism",
    text: "Summit Balkans is also about empowerment — supporting youth involvement, minority inclusion, and sustainable development in mountain regions through tourism opportunities.",
  },
];

const COUNTRY_FLAG: Record<string, string> = {
  Albania: "🇦🇱",
  Montenegro: "🇲🇪",
  Kosovo: "🇽🇰",
};

async function getGuides() {
  try {
    const rows = await db
      .select()
      .from(guides)
      .where(eq(guides.published, true))
      .orderBy(asc(guides.displayOrder));
    return rows.map((g) => ({
      ...g,
      languages: parseJsonField<string[]>(g.languages, []),
      certifications: parseJsonField<string[]>(g.certifications, []),
      specialties: parseJsonField<string[]>(g.specialties, []),
    }));
  } catch {
    return [];
  }
}

export default async function AboutPage() {
  const guideList = await getGuides();

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[65vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-bottom"
style={{ backgroundImage: "url('/images/about-hero.webp')" }}        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-content mx-auto px-6 pt-[72px] w-full">
          <div className="font-mono text-[11px] text-gold tracking-[0.14em] uppercase mb-4">Who We Are</div>
          <h1
            className="font-fraunces font-bold text-white tracking-tight leading-[1.0] max-w-[760px] mb-6"
            style={{ fontSize: "clamp(42px, 5.5vw, 80px)", fontVariationSettings: "'opsz' 72" }}
          >
            Summit Balkans
          </h1>
          <p className="text-xl text-white/80 max-w-[620px] leading-relaxed">
            A mountain adventure and trekking organisation based in the heart of the Western Balkans —
            dedicated to showcasing the region&apos;s most breathtaking landscapes, authentic cultures,
            and untouched natural heritage.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-24">
        <div className="max-w-content mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <SectionLabel>Our Story</SectionLabel>
              <h2 className="font-fraunces text-4xl font-bold tracking-tight mb-8">
                Born from a passion for mountains
              </h2>
              <div className="space-y-5 text-base leading-[1.8] text-ink/70">
                <p>
                  Summit Balkans is more than a tour provider — we are a bridge between travellers and the
                  wild, living beauty of the Balkans. Born from a deep passion for mountains, exploration,
                  and meaningful travel, Summit Balkans was created to offer experiences that go beyond
                  standard tourism.
                </p>
                <p>
                  We believe that the mountains are not just destinations, but living stories shaped by
                  nature, history, and the people who call them home. We specialise in guided and
                  self-guided trekking experiences across some of the most iconic mountain routes in the
                  region, including transboundary trails such as the Peaks of the Balkans, High Scardus
                  Trail, and Zagoria.
                </p>
                <p>
                  We take care of the complexity of mountain travel so that our guests can fully focus on
                  the experience itself.
                </p>
              </div>

              <div className="grid grid-cols-5 gap-0 mt-12 border-t-2 border-divider pt-8">
                {[["2018", "Founded"], ["200+", "Travellers"], ["60+", "Routes"], ["5.0", "Rating"], ["3", "Countries"]].map(([num, label]) => (
                  <div key={label} className="text-center border-r border-divider last:border-0 px-4">
                    <div className="font-fraunces text-3xl font-bold mb-1">{num}</div>
                    <div className="font-mono text-[11px] text-ink/40 tracking-[0.08em] uppercase">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-card-hero overflow-hidden border-2 border-divider">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=85"
                alt="Summit Balkans guides on trail"
                className="w-full h-full object-cover block"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-24 bg-bone border-t-2 border-divider">
        <div className="max-w-content mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <SectionLabel>What We Do</SectionLabel>
              <h2 className="font-fraunces text-4xl font-bold tracking-tight mb-4">
                Complete mountain travel, handled
              </h2>
              <p className="text-ink/60 leading-relaxed mb-0">
                Our core services cover everything from guided expeditions to self-guided packages,
                giving you the freedom to choose how you explore.
              </p>
            </div>
            <ul className="space-y-3">
              {WHAT_WE_DO.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-ink/70 leading-relaxed">
                  <CheckCircle2 className="w-5 h-5 text-brand mt-0.5 shrink-0" strokeWidth={1.5} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-24 border-t-2 border-divider">
        <div className="max-w-content mx-auto px-6">
          <SectionLabel>What We Offer</SectionLabel>
          <h2 className="font-fraunces text-4xl font-bold tracking-tight mt-2 mb-10">
            Everything you need on the trail
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WHAT_WE_OFFER.map((item, i) => (
              <div key={i} className="bg-bone border-2 border-divider rounded-xl p-5">
                <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-4 h-4 text-brand" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-ink/70 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-24 bg-bone border-t-2 border-divider">
        <div className="max-w-content mx-auto px-6">
          <SectionLabel>What Makes Us Different</SectionLabel>
          <h2 className="font-fraunces text-4xl font-bold tracking-tight mt-2 mb-12">
            Not just where — but how
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DIFFERENTIATORS.map((d) => (
              <div key={d.num} className="bg-white border-2 border-divider rounded-2xl p-6">
                <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center font-mono text-sm font-bold text-white mb-4">
                  {d.num}
                </div>
                <h3 className="font-fraunces text-xl font-bold mb-2">{d.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision + Mission */}
      <section className="py-24 bg-dark border-t-2 border-divider">
        <div className="max-w-content mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <SectionLabel light>Our Vision</SectionLabel>
              <h2 className="font-fraunces text-3xl font-bold text-white tracking-tight mt-2 mb-4">
                A leading adventure destination
              </h2>
              <p className="text-white/55 leading-relaxed">
                We envision the Western Balkans as one of Europe&apos;s leading adventure destinations —
                recognised not only for its natural beauty, but also for its hospitality, cultural
                richness, and sustainable tourism practices. Through Summit Balkans, we aim to inspire a
                deeper connection between people and nature, and to promote a form of tourism that
                respects the land, uplifts communities, and transforms travellers.
              </p>
            </div>
            <div>
              <SectionLabel light>Our Mission</SectionLabel>
              <h2 className="font-fraunces text-3xl font-bold text-white tracking-tight mt-2 mb-4">
                Authentic experiences, local impact
              </h2>
              <p className="text-white/55 leading-relaxed">
                To develop Summit Balkans into a leading adventure platform in the Western Balkans that
                delivers authentic trekking experiences, empowers local communities, and promotes
                sustainable tourism in some of Europe&apos;s most untouched mountain regions. Because with
                us, you don&apos;t just hike through mountains — you experience them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team — from DB */}
      {guideList.length > 0 && (
        <section className="py-24 border-t-2 border-divider">
          <div className="max-w-content mx-auto px-6">
            <SectionLabel>The Team</SectionLabel>
            <h2 className="font-fraunces text-4xl font-bold tracking-tight mb-12">Our guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {guideList.map((g) => (
                <div key={g.id} className="border-2 border-divider rounded-card bg-white p-6">
                  {g.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={g.photoUrl}
                      alt={g.name}
                      className="w-16 h-16 rounded-full object-cover mb-4"
                    />
                  ) : (
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center font-fraunces text-2xl font-bold text-white mb-4 bg-forest"
                    >
                      {g.name.trim().charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="font-mono text-[10px] text-terra mb-1 tracking-[0.06em]">
                    {COUNTRY_FLAG[g.country] ?? ""} {g.country}
                  </div>
                  <h3 className="font-fraunces text-lg font-bold mb-0.5">{g.name}</h3>
                  {g.yearsExperience && (
                    <div className="text-xs text-ink/45 mb-3">{g.yearsExperience} years experience</div>
                  )}
                  {g.languages && g.languages.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap mb-3">
                      {g.languages.map((l) => (
                        <span key={l} className="text-[10px] px-2 py-0.5 rounded border border-divider text-ink/50 font-mono">{l}</span>
                      ))}
                    </div>
                  )}
                  {g.certifications && g.certifications.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap mb-4">
                      {g.certifications.map((c) => (
                        <span key={c} className="text-[10px] px-2 py-0.5 rounded bg-forest/10 text-forest font-mono font-medium">{c}</span>
                      ))}
                    </div>
                  )}
                  {g.quote && (
                    <p className="text-[13px] leading-[1.6] text-ink/55 italic">&ldquo;{g.quote}&rdquo;</p>
                  )}
                  {!g.quote && g.bio && (
                    <p className="text-[13px] leading-[1.6] text-ink/55 line-clamp-3">{g.bio}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABand />
    </>
  );
}