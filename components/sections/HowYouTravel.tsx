import Link from "next/link";
import { Users, User, Map, Backpack, ArrowRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";

const cards = [
  {
    icon: Users,
    title: "Group Tours",
    desc: "Join a scheduled departure with up to 12 travellers. Expert local guide included.",
    href: "/tours",
    cta: "View schedules",
  },
  {
    icon: User,
    title: "Private Trips",
    desc: "Your group, your route, your pace. Custom itineraries designed around you.",
    href: "/private-trips",
    cta: "Plan your trip",
  },
  {
    icon: Map,
    title: "Self-Guided",
    desc: "GPX tracks, guesthouse bookings, and an emergency contact — you hike solo.",
    href: "/tours",
    cta: "Coming soon",
  },
  {
    icon: Backpack,
    title: "Gear Rental",
    desc: "Quality tents, sleeping bags, poles and more. Rent what you need, travel light.",
    href: "/gear",
    cta: "Browse gear",
  },
];

export function HowYouTravel() {
  return (
    <section className="bg-bone py-24 border-t-2 border-b-2 border-divider">
      <div className="max-w-content mx-auto px-10">
        <div className="mb-12">
          <SectionLabel>How You Travel</SectionLabel>
          <h2
            className="font-fraunces font-bold tracking-tight leading-[1.1]"
            style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
          >
            Find your style
          </h2>
        </div>

        <div className="grid grid-cols-4 gap-5">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="border-2 border-divider rounded-card bg-white p-7 hover:border-forest hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <Icon className="w-11 h-11 text-forest mb-5" strokeWidth={1.5} />
                <h3 className="font-fraunces text-xl font-bold mb-2 tracking-tight">
                  {card.title}
                </h3>
                <p className="text-sm text-ink/58 leading-[1.55] mb-5">{card.desc}</p>
                <Link
                  href={card.href}
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-terra no-underline hover:gap-2.5 transition-all"
                >
                  {card.cta}
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
