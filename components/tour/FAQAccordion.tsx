"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CancellationTimeline } from "@/components/booking/CancellationTimeline";

interface FAQItem {
  q: string;
  a: React.ReactNode;
  defaultOpen?: boolean;
}

const faqItems: FAQItem[] = [
  {
    q: "What's the deposit and payment schedule?",
    a: (
      <span>
        A non-refundable deposit of 20% confirms your booking. The remaining 80% is due 30 days
        before departure. Bookings within 30 days of departure require full payment within 48 hours.{" "}
        <Link
          href="/legal/booking-terms#4-deposit--payment"
          target="_blank"
          className="text-brand underline underline-offset-2"
        >
          Read full payment terms →
        </Link>
      </span>
    ),
  },
  {
    q: "What is the cancellation policy?",
    a: (
      <div>
        <CancellationTimeline />
        <p className="mt-2 text-[15px] leading-[1.75] text-ink/65">
          For full details, see our{" "}
          <Link
            href="/legal/booking-terms#5-cancellation-by-traveler"
            target="_blank"
            className="text-brand underline underline-offset-2"
          >
            Booking Terms
          </Link>
          .
        </p>
      </div>
    ),
    defaultOpen: true,
  },
  {
    q: "What happens if Summit Balkans cancels the tour?",
    a: (
      <span>
        If we need to cancel due to insufficient numbers, weather, or safety concerns, you&apos;ll
        be offered an alternative tour, a different departure date, or a full refund. We are not
        responsible for your flights or other arrangements.{" "}
        <Link
          href="/legal/booking-terms#7-cancellation-or-changes-by-summit-balkans"
          target="_blank"
          className="text-brand underline underline-offset-2"
        >
          Full cancellation terms →
        </Link>
      </span>
    ),
  },
  {
    q: "Do I need travel insurance?",
    a: (
      <span>
        We strongly recommend comprehensive travel insurance covering medical emergencies, trip
        cancellation, and personal belongings. While not mandatory, it protects you against
        unexpected costs — especially important for mountain travel with limited infrastructure
        nearby.{" "}
        <Link
          href="/legal/booking-terms#12-travel-insurance"
          target="_blank"
          className="text-brand underline underline-offset-2"
        >
          See insurance guidance →
        </Link>
      </span>
    ),
  },
  {
    q: "What about my fitness level and medical conditions?",
    a: (
      <span>
        You&apos;re responsible for ensuring you&apos;re fit to participate. Hiking tours involve
        long distances (18–24km/day), significant elevation gain, and remote terrain. Please
        disclose any pre-existing medical conditions, allergies, or dietary needs at booking. We
        reserve the right to decline participation where safety is a concern.{" "}
        <Link
          href="/legal/booking-terms#10-health-fitness--medical-conditions"
          target="_blank"
          className="text-brand underline underline-offset-2"
        >
          Health &amp; fitness terms →
        </Link>
      </span>
    ),
  },
  {
    q: "Do I need a visa to cross the borders?",
    a: "For most nationalities (EU, US, UK, Canada, Australia) no visa is required for Albania, Montenegro or Kosovo. Summit Balkans handles all border crossing paperwork for the group. We advise on your specific nationality during pre-trip onboarding.",
  },
  {
    q: "How fit do I need to be?",
    a: "This trail is classified as Challenging. You should be comfortable hiking 18–24km on consecutive days with 700–1,300m of elevation gain. We'd recommend training with consecutive multi-day hikes before your trip. No technical climbing is involved.",
  },
  {
    q: "What's the weather like?",
    a: "The Balkans summer (June–September) is generally warm and dry, with afternoon thunderstorms possible at elevation. Temperatures can drop below 10°C at altitude overnight. Rain gear is essential. We monitor forecasts daily and have contingency plans for severe weather.",
  },
  {
    q: "Can I join as a solo traveller?",
    a: "Yes — around 40% of our participants join solo. Groups are small (max 12) so the dynamic is close. Most solo travellers tell us it's one of their highlights. We can also connect you with other solo travellers before departure.",
  },
  {
    q: "Can you accommodate dietary requirements?",
    a: "We can accommodate vegetarian diets well — guesthouse food is plant-forward by tradition. Vegan and gluten-free diets are harder to guarantee fully in remote mountain villages, but we communicate all requirements to every host in advance.",
  },
];

export function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(
    faqItems.findIndex((item) => item.defaultOpen)
  );

  return (
    <div>
      {faqItems.map((item, i) => (
        <div
          key={i}
          className={`border-b-2 border-divider ${i === 0 ? "border-t-2" : ""}`}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-5 gap-5 bg-transparent border-none cursor-pointer text-left"
          >
            <span className="text-base font-medium flex-1">{item.q}</span>
            <ChevronDown
              className={cn(
                "w-[18px] h-[18px] text-ink/35 flex-shrink-0 transition-transform duration-200",
                open === i && "rotate-180"
              )}
              strokeWidth={1.5}
            />
          </button>
          {open === i && (
            <div className="pb-5 text-[15px] leading-[1.75] text-ink/65">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
