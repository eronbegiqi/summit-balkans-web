import Link from "next/link";
import { ArrowRight, Users, Calendar, Clock } from "lucide-react";

const miniCards = [
  { label: "Group size", value: "2–12 people", sub: "All private" },
  { label: "Lead time", value: "3+ months", sub: "Recommended" },
  { label: "Duration range", value: "3–14 days", sub: "You choose" },
  { label: "Response time", value: "24 hours", sub: "Guaranteed" },
];

export function PrivateTripsHero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&q=85"
        alt="Private hiking trip in the Balkans"
        className="absolute inset-0 w-full h-full object-cover object-center"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-dark/80 via-dark/55 to-dark/75" />

      <div
        className="relative z-10 max-w-content mx-auto px-10 pt-[68px] w-full grid items-center gap-20"
        style={{ gridTemplateColumns: "1fr 420px" }}
      >
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-gold tracking-[0.14em] uppercase mb-5">
            <span className="block w-5 h-px bg-gold" />
            Private &amp; Custom Trips
          </div>
          <h1
            className="font-fraunces font-bold text-white leading-[1.0] tracking-[-0.03em] mb-6"
            style={{ fontSize: "clamp(48px, 6vw, 84px)", fontVariationSettings: "'opsz' 72" }}
          >
            Your group. Your route. Your pace.
          </h1>
          <p className="text-lg text-white/68 leading-[1.65] mb-9 max-w-[500px]">
            We design custom hiking trips around your group&apos;s interests, fitness, and schedule. From 2 people to 12. From 3 days to two weeks.
          </p>
          <Link
            href="#enquiry"
            className="inline-flex items-center gap-2.5 bg-terra text-white border-2 border-terra px-7 py-4 rounded-xl font-inter text-[15px] font-bold no-underline hover:opacity-88 transition-opacity"
          >
            Tell Us About Your Trip
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
          <div className="flex gap-5 mt-7 flex-wrap">
            {[
              { icon: Users, text: "All fitness levels" },
              { icon: Calendar, text: "Any time of year" },
              { icon: Clock, text: "Reply in 24h" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-[13px] text-white/55">
                <Icon className="w-4 h-4 text-gold" strokeWidth={1.5} />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Mini info cards */}
        <div className="grid grid-cols-2 gap-3.5">
          {miniCards.map((card) => (
            <div
              key={card.label}
              className="bg-dark/55 backdrop-blur-xl border border-white/12 rounded-xl p-5"
            >
              <div className="font-mono text-[10px] text-white/40 tracking-[0.1em] uppercase mb-1.5">
                {card.label}
              </div>
              <div className="font-fraunces text-lg font-bold text-white mb-0.5">{card.value}</div>
              <div className="text-[13px] text-white/50">{card.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
