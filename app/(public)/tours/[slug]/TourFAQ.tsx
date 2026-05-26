"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

export function TourFAQ({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className={`border-b-2 border-divider ${i === 0 ? "border-t-2" : ""}`}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-5 gap-5 bg-transparent border-none cursor-pointer text-left"
          >
            <span className="text-base font-medium flex-1">{item.question}</span>
            <ChevronDown
              className={cn(
                "w-[18px] h-[18px] text-ink/35 flex-shrink-0 transition-transform duration-200",
                open === i && "rotate-180"
              )}
              strokeWidth={1.5}
            />
          </button>
          {open === i && (
            <div className="pb-5 text-[15px] leading-[1.75] text-ink/65">{item.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
}
