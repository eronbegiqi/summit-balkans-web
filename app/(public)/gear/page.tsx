import type { Metadata } from "next";
import Link from "next/link";
import { Mountain, MessageCircle, ArrowRight, Check } from "lucide-react";
import { gearItems } from "@/data/gear";
import { GearDetailModal } from "@/components/sections/GearDetailModal";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "Gear Rental — Quality Kit for the Balkans",
  description:
    "Rent quality hiking gear for your Balkans trek. Tents, sleeping bags, trekking poles, rain shells and more.",
};

const howFAQ = [
  {
    q: "Do I need to book gear in advance?",
    a: "Yes — message us at least 2 weeks before your trip to guarantee availability, especially for popular items in peak season.",
  },
  {
    q: "Where do I pick up and return?",
    a: "Our Prishtina base in Kosovo. For tours, gear is delivered to your start point and collected at the end.",
  },
  {
    q: "What if something gets damaged?",
    a: "Normal wear and fair use is covered. Damage beyond normal use is deducted from the deposit. We're reasonable — just be honest.",
  },
  {
    q: "Can I rent gear without booking a tour?",
    a: "Yes, absolutely. Gear rental is available to all hikers, whether you're on one of our tours or hiking independently.",
  },
];

export default function GearPage() {
  return (
    <>
      {/* Hero — dark section with topo */}
      <section className="bg-dark pt-16 md:pt-[68px] pb-0 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] bg-repeat-x"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Cpath d='M0,200 C80,160 160,180 240,200 C320,220 400,160 480,200 C560,240 640,180 720,200 C740,207 760,210 800,200' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3Cpath d='M0,240 C80,200 160,220 240,240 C320,260 400,200 480,240 C560,280 640,220 720,240 C740,247 760,250 800,240' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 max-w-content mx-auto px-5 sm:px-6 lg:px-6 py-14 sm:py-16 lg:py-[72px] lg:pb-20 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(320px,480px)] items-center gap-10 sm:gap-12 lg:gap-20">
          <div className="min-w-0">
            <div className="flex items-center gap-2 font-mono text-[11px] text-gold tracking-[0.14em] uppercase mb-[18px]">
              <span className="block w-5 h-px bg-gold" />
              Gear Rental
            </div>
            <h1
              className="font-fraunces font-bold text-white leading-[1.04] tracking-normal mb-[22px]"
              style={{ fontSize: "clamp(38px, 9vw, 76px)", fontVariationSettings: "'opsz' 64" }}
            >
              Rent quality gear, travel light.
            </h1>
            <p className="text-base sm:text-lg text-white/60 leading-[1.65] mb-8 sm:mb-9 max-w-[640px]">
              No need to haul heavy kit from home. Rent what you need in Prishtina and pick it up ready to go.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
              <a
                href="#gear-grid"
                className="inline-flex items-center justify-center gap-2 bg-brand text-white px-6 py-[13px] rounded-xl font-inter text-sm font-bold no-underline hover:opacity-88 transition-opacity"
              >
                Browse Gear
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a
                href="https://wa.me/38348300155"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-6 py-[13px] rounded-xl font-inter text-sm font-medium no-underline hover:border-white/65 transition-colors"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                Ask via WhatsApp
              </a>
            </div>
            <div className="grid gap-3 sm:flex sm:gap-6 mt-7 sm:flex-wrap">
              {["Free sanitisation between rentals", "Deposit refunded on return", "Available for non-tour hikers"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-[13px] text-white/50">
                  <Check className="w-3.5 h-3.5 text-gold flex-shrink-0" strokeWidth={2} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Gear preview cards */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-[480px] lg:max-w-none">
            {gearItems.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="bg-white/6 border border-white/10 rounded-xl p-4 sm:p-5 text-center hover:border-white/25 hover:bg-white/9 transition-all cursor-pointer"
              >
                <div className="text-gold mb-2.5">
                  <Mountain className="w-6 h-6 mx-auto" strokeWidth={1.5} />
                </div>
                <div className="text-[13px] font-semibold text-white mb-0.5 break-words">{item.name}</div>
                <div className="font-fraunces text-xs text-white/40">€{item.dayRate}/day</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How-to strip */}
      <div className="bg-forest py-6">
        <div className="max-w-content mx-auto px-6 flex justify-around flex-wrap gap-2">
          {[
            "Message us to check availability",
            "Pick up in Prishtina",
            "Trek with quality kit",
            "Return at end of trip",
            "Deposit refunded same day",
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-2.5 text-white text-sm font-medium py-2 px-4">
              <span className="font-mono text-[11px] text-gold font-medium w-5 text-center flex-shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              {step}
            </div>
          ))}
        </div>
      </div>

      {/* Gear grid */}
      <section id="gear-grid" className="py-24">
        <div className="max-w-content mx-auto px-6">
          <SectionLabel>All Gear</SectionLabel>
          <h2
            className="font-fraunces font-bold tracking-tight mb-3"
            style={{ fontSize: "clamp(28px, 3.5vw, 42px)" }}
          >
            Everything you need
          </h2>
          <p className="text-base text-ink/55 max-w-[520px] mb-12">
            All gear is inspected, cleaned, and ready to go. Click any item to see specs and calculate the cost.
          </p>

          <div className="grid md:grid-cols-4 gap-5">
            {gearItems.map((item) => (
              <GearDetailModal key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* How to rent */}
      <section className="py-24 bg-dark relative overflow-hidden">
        <div className="max-w-content mx-auto px-6">
          <SectionLabel light>How It Works</SectionLabel>
          <h2
            className="font-fraunces font-bold text-white tracking-tight mb-14"
            style={{ fontSize: "clamp(28px, 3.5vw, 42px)" }}
          >
            Renting is simple
          </h2>

          <div className="grid grid-cols-3 gap-9">
            {[
              { num: "01", title: "Check availability", text: "Message us on WhatsApp with what you need and your dates. We'll confirm within a few hours." },
              { num: "02", title: "Pick up in Prishtina", text: "Collect your gear from our base in central Prishtina on your day of departure." },
              { num: "03", title: "Return & get deposit back", text: "Bring everything back at the end of your trip. Deposit refunded on the spot after a quick check." },
            ].map((step) => (
              <div key={step.num}>
                <div
                  className="font-fraunces font-bold text-white/10 leading-[1] mb-3.5 tracking-[-0.04em]"
                  style={{ fontSize: "44px", fontVariationSettings: "'opsz' 60" }}
                >
                  {step.num}
                </div>
                <h3 className="font-fraunces text-[22px] font-bold text-white mb-2.5">{step.title}</h3>
                <p className="text-[15px] leading-[1.7] text-white/50">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="h-px bg-white/7 my-16" />

          {/* FAQ grid */}
          <div className="grid grid-cols-2 gap-4">
            {howFAQ.map((item) => (
              <div key={item.q} className="bg-white/4 border border-white/20 rounded-xl px-[22px] py-5">
                <div className="text-sm font-semibold text-white/85 mb-2">{item.q}</div>
                <div className="text-[13px] leading-[1.65] text-white/45">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bundle CTA */}
      <section className="py-20 border-t-2 border-divider">
        <div className="max-w-content mx-auto px-6">
          <div className="bg-forest rounded-2xl px-5 py-8 sm:px-8 sm:py-10 lg:px-14 lg:py-[52px] grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] items-start lg:items-center gap-8 lg:gap-12">
            <div>
              <div className="font-mono text-[11px] text-white/45 tracking-[0.12em] uppercase mb-3.5">Bundle Deal</div>
              <h3
                className="font-fraunces font-bold text-white tracking-normal leading-[1.1] mb-3"
                style={{ fontSize: "clamp(26px, 7vw, 34px)", fontVariationSettings: "'opsz' 32" }}
              >
                Book a tour + gear and save 10%
              </h3>
              <p className="text-base text-white/60 leading-[1.6] max-w-[520px]">
                Add gear rental when you book any guided tour and we&apos;ll take 10% off the gear cost. Already have a tour booking? Just let us know.
              </p>
            </div>
            <div className="flex flex-col gap-3 items-stretch sm:items-start lg:items-center">
              <Link
                href="/tours"
                className="inline-flex items-center justify-center gap-2 bg-white text-forest border-2 border-white px-7 py-3.5 rounded-xl font-inter text-[15px] font-bold whitespace-nowrap no-underline hover:opacity-90 transition-opacity"
              >
                Browse Tours
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>
              <a
                href="https://wa.me/38348300155"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/55 no-underline hover:text-white transition-colors"
              >
                Already booked? Message us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
