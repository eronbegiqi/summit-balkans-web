import type { Metadata } from "next";
import { PrivateTripsHero } from "@/components/sections/PrivateTripsHero";
import { PrivateTripsForm } from "@/components/sections/PrivateTripsForm";
import { CTABand } from "@/components/sections/CTABand";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "Private Trips — Custom Balkans Hiking",
  description:
    "Plan a custom guided hiking trip in Albania, Montenegro or Kosovo for your group. We reply within 24 hours.",
};

const steps = [
  {
    num: "01",
    title: "Tell us about your trip",
    desc: "Fill in our short enquiry form — destination, dates, group size, and what kind of experience you're after.",
  },
  {
    num: "02",
    title: "We design your route",
    desc: "Within 24 hours, we send a custom itinerary built around your group's fitness, interests, and schedule.",
  },
  {
    num: "03",
    title: "Refine together",
    desc: "We adjust the plan over WhatsApp or a video call until it's exactly right. No rush, no hard sell.",
  },
  {
    num: "04",
    title: "Book & go",
    desc: "Confirm with a 25% deposit. We handle all logistics — accommodation, guides, permits, transfers.",
  },
];

const examples = [
  {
    title: "Honeymoon in the Alps",
    desc: "5 days in Theth & Valbona. Private guesthouse rooms, sunset views from the pass, a candlelit dinner arranged in a mountain village.",
    tags: ["Albania", "2 people", "5 days", "Romantic"],
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80",
  },
  {
    title: "Family Trek, Kosovo",
    desc: "A gentle 3-day loop in Rugova Canyon, adapted for two adults and two teenagers. Canyon walks, via ferrata intro, swimming holes.",
    tags: ["Kosovo", "4 people", "3 days", "Family"],
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80",
  },
  {
    title: "Corporate Expedition",
    desc: "10 people, 4 days, Durmitor. Team building through challenge. Shared summit, shared meals, no phones required.",
    tags: ["Montenegro", "10 people", "4 days", "Corporate"],
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80",
  },
];

const privateReviews = [
  {
    initial: "C",
    name: "Carlos F.",
    meta: "Spain · Private trip, 2025",
    quote: "Our private trip was planned perfectly around our fitness level. Never felt rushed, never felt unchallenged. The perfect balance.",
  },
  {
    initial: "H",
    name: "Hannah & Tom",
    meta: "UK · Honeymoon, 2025",
    quote: "We told them we wanted something wild but romantic. They delivered. Day three in Theth was better than any hotel we've stayed in.",
  },
  {
    initial: "R",
    name: "Reza M.",
    meta: "Canada · Corporate, 2025",
    quote: "10 colleagues, different fitness levels, one shared experience none of us will forget. Worth every cent of the budget.",
  },
];

export default function PrivateTripsPage() {
  return (
    <>
      <PrivateTripsHero />

      {/* How it works */}
      <section className="py-24">
        <div className="max-w-content mx-auto px-10">
          <SectionLabel>The Process</SectionLabel>
          <h2
            className="font-fraunces font-bold tracking-tight leading-[1.1] mb-4"
            style={{ fontSize: "clamp(30px, 3.5vw, 44px)" }}
          >
            How a private trip works
          </h2>
          <p className="text-base text-ink/55 max-w-[520px] mb-14">
            No forms, no queues. A short conversation turns into a custom itinerary within 24 hours.
          </p>

          {/* Process grid */}
          <div className="grid grid-cols-4 gap-0 relative">
            <div className="absolute top-7 left-[calc(12.5%+14px)] right-[calc(12.5%+14px)] h-0.5 bg-divider z-0" />
            {steps.map((s) => (
              <div key={s.num} className="text-center px-5 relative z-10">
                <div className="w-14 h-14 rounded-full bg-white border-2 border-divider mx-auto mb-5 flex items-center justify-center font-fraunces text-[22px] font-bold hover:bg-terra hover:border-terra hover:text-white transition-all cursor-default group">
                  <span className="group-hover:text-white text-ink">{s.num}</span>
                </div>
                <h3 className="font-fraunces text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-ink/55 leading-[1.6]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trip examples */}
      <section className="py-24 bg-dark relative overflow-hidden">
        <div className="max-w-content mx-auto px-10">
          <SectionLabel light>Real Examples</SectionLabel>
          <h2
            className="font-fraunces font-bold text-white tracking-tight mb-12"
            style={{ fontSize: "clamp(30px, 3.5vw, 44px)" }}
          >
            Trips we&apos;ve planned
          </h2>
          <div className="grid grid-cols-3 gap-5">
            {examples.map((ex) => (
              <div key={ex.title} className="border-2 border-white/10 rounded-2xl overflow-hidden hover:border-white/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ex.image} alt={ex.title} className="w-full h-[200px] object-cover block brightness-85" loading="lazy" />
                <div className="px-[22px] py-5 bg-white/4">
                  <h3 className="font-fraunces text-xl font-bold text-white mb-1.5">{ex.title}</h3>
                  <p className="text-[13px] text-white/50 leading-[1.55] mb-3.5">{ex.desc}</p>
                  <div className="flex gap-2 flex-wrap">
                    {ex.tags.map((tag) => (
                      <span key={tag} className="font-mono text-[10px] px-2 py-0.5 rounded border border-white/15 text-white/50 tracking-[0.06em] uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Private testimonials */}
      <section className="py-20 border-t-2 border-b-2 border-divider">
        <div className="max-w-content mx-auto px-10 grid grid-cols-3 gap-8">
          {privateReviews.map((r) => (
            <div key={r.name} className="px-7 py-7 border-2 border-divider rounded-card bg-white">
              <div className="text-gold text-[13px] tracking-[2px] mb-3">★★★★★</div>
              <p className="text-[15px] leading-[1.7] text-ink/72 italic mb-[18px]">
                &ldquo;{r.quote}&rdquo;
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-forest flex items-center justify-center font-fraunces text-sm font-bold text-white flex-shrink-0">
                  {r.initial}
                </div>
                <div>
                  <div className="text-sm font-semibold">{r.name}</div>
                  <div className="text-xs text-ink/40 font-mono">{r.meta}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Conversational enquiry form */}
      <PrivateTripsForm />

      <CTABand />
    </>
  );
}
