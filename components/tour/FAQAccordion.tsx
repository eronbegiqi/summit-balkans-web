"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqItems = [
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
  {
    q: "What's the cancellation policy?",
    a: "Cancellations more than 60 days before departure receive a full refund minus a €75 admin fee. 30–60 days: 50% refund. Under 30 days: no refund. We strongly recommend travel insurance with trip cancellation cover.",
  },
];

export function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null);

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
