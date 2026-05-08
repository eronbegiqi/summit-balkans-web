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
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=85')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-dark/85 via-dark/60 to-dark/80" />

      {/* Content */}
      <div className="relative z-10 max-w-content mx-auto px-5 md:px-10 pt-[80px] pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] items-center gap-12 lg:gap-20">

          {/* Left — copy */}
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-gold tracking-[0.14em] uppercase mb-5">
              <span className="block w-5 h-px bg-gold" />
              Private &amp; Custom Trips
            </div>
            <h1
              className="font-fraunces font-bold text-white leading-[1.0] tracking-[-0.03em] mb-6"
              style={{ fontSize: "clamp(40px, 5.5vw, 78px)" }}
            >
              Your group.<br />Your route.<br />Your pace.
            </h1>
            <p className="text-lg text-white/65 leading-[1.65] mb-9 max-w-[480px]">
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

          {/* Right — image + stat cards */}
          <div className="hidden lg:flex flex-col gap-4">
            {/* Hero image */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl h-[260px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=85"
                alt="Private guided hiking in the Balkans"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
              {/* floating label */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <div className="font-mono text-[10px] text-white/50 tracking-[0.12em] uppercase mb-0.5">
                    Peaks of the Balkans
                  </div>
                  <div className="font-fraunces text-base font-bold text-white">
                    Theth Valley, Albania
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1.5">
                  <span className="font-mono text-[11px] font-semibold text-white">2,694 m</span>
                </div>
              </div>
            </div>

            {/* Mini stat cards */}
            <div className="grid grid-cols-2 gap-3">
              {miniCards.map((card) => (
                <div
                  key={card.label}
                  className="bg-dark/55 backdrop-blur-xl border border-white/12 rounded-xl p-4"
                >
                  <div className="font-mono text-[10px] text-white/40 tracking-[0.1em] uppercase mb-1">
                    {card.label}
                  </div>
                  <div className="font-fraunces text-base font-bold text-white mb-0.5">{card.value}</div>
                  <div className="text-[12px] text-white/50">{card.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bone/20 to-transparent pointer-events-none" />
    </section>
  );
}
