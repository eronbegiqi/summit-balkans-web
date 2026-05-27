"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const items = [
  {
    q: "Do I need previous hiking experience?",
    a: "Yes — previous multi-day hiking experience is strongly recommended. You should be comfortable hiking 16–24 km on consecutive days with 700–1,300m elevation gain. Day hikes and weekend trips in hilly terrain are a good starting point.",
  },
  {
    q: "How fit do I need to be?",
    a: "This trail is classified as Moderate to Challenging. You need good cardiovascular fitness and strong legs for sustained uphills. We recommend a 3-month training plan with at least two 15+ km hikes per week before departure.",
  },
  {
    q: "What about the border crossings?",
    a: "We handle all cross-border permits as part of every group departure. For most nationalities (EU, US, UK, Canada, Australia) no visa is required. Border crossings happen at remote mountain passes — no queues, no vehicles, just a marker in the rock.",
  },
  {
    q: "Can I do part of the trail?",
    a: "Yes. Our group departures cover the full 10-day circuit, but we also offer custom private trips where you can choose 4, 5, or 7-day sections. Contact us to design a partial route.",
  },
  {
    q: "What if the weather is bad?",
    a: "Afternoon thunderstorms are common at altitude in summer — we plan stages to descend by midday on exposed sections. We have contingency plans for severe weather. The trail does not operate in conditions where guide judgement deems it unsafe.",
  },
  {
    q: "Are guesthouses comfortable?",
    a: "Guesthouses are simple but clean: shared rooms with 2–4 beds, basic bathrooms, and no Wi-Fi. The food more than compensates — home-cooked dinners and fresh breakfasts prepared by the host family each morning.",
  },
  {
    q: "Is there mobile signal on the trail?",
    a: "Signal is patchy throughout and non-existent on some high-altitude stages. Your guide carries a satellite communication device for emergencies. We recommend downloading offline maps before departure.",
  },
  {
    q: "What about altitude?",
    a: "The highest point is around 2,694m — above the threshold for mild altitude effects (headaches, fatigue). The trail is not a high-altitude expedition, but acclimatise slowly on Day 1 and stay well hydrated throughout.",
  },
];

export function PoBFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 md:py-28 bg-white">
      <div className="max-w-content mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 lg:gap-20">
          {/* Left sticky label */}
          <div className="lg:sticky lg:top-[128px] lg:self-start">
            <div className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-terra mb-3">
              FAQ
            </div>
            <h2 className="font-fraunces text-[clamp(1.8rem,3vw,2.4rem)] font-bold tracking-tight leading-tight mb-5">
              Common questions
            </h2>
            <p className="text-sm text-ink/55 leading-relaxed">
              Still have questions?{" "}
              <Link href="/contact" className="text-brand underline underline-offset-2">
                Write to us
              </Link>{" "}
              or{" "}
              <a href="https://wa.me/38348300155" target="_blank" rel="noopener noreferrer" className="text-brand underline underline-offset-2">
                chat on WhatsApp
              </a>
              .
            </p>
          </div>

          {/* Right accordion */}
          <div>
            {items.map((item, i) => (
              <div key={i} className={`border-b-2 border-divider ${i === 0 ? "border-t-2" : ""}`}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 gap-5 bg-transparent border-none cursor-pointer text-left"
                >
                  <span className="text-base font-medium flex-1 leading-snug">{item.q}</span>
                  <ChevronDown
                    className={cn(
                      "w-[18px] h-[18px] text-ink/35 flex-shrink-0 transition-transform duration-200",
                      open === i && "rotate-180"
                    )}
                    strokeWidth={1.5}
                  />
                </button>
                {open === i && (
                  <div className="pb-5 text-[15px] leading-[1.75] text-ink/65">{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
