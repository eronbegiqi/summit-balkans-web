"use client";

import { useState } from "react";
import { Download } from "lucide-react";

const categories: Record<string, string[]> = {
  Essential: [
    "Hiking boots (broken in)",
    "Trekking poles",
    "Rain jacket",
    "Base layers (merino)",
    "First aid kit",
    "Headlamp + batteries",
    "Water filter / purification tabs",
  ],
  Recommended: [
    "Gaiters",
    "Sun hat + sunscreen",
    "Trekking trousers",
    "Warm mid-layer",
    "Blister kit",
    "Snacks for trail",
  ],
  "We Provide": [
    "Route maps & GPX",
    "Group first aid",
    "Emergency comms device",
    "Welcome pack",
  ],
};

export function BringChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (item: string) =>
    setChecked((prev) => ({ ...prev, [item]: !prev[item] }));

  return (
    <div className="mt-14">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-2">
        <div>
          <div className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-terra mb-2.5">
            Pack List
          </div>
          <h3 className="font-fraunces text-[26px] font-bold tracking-tight">
            What to bring
          </h3>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 bg-transparent border-2 border-divider text-ink px-[18px] py-2.5 rounded-lg font-inter text-[13px] font-semibold cursor-pointer whitespace-nowrap hover:border-ink transition-colors"
        >
          <Download className="w-[15px] h-[15px]" strokeWidth={1.5} />
          Download Pack List PDF
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">
        {Object.entries(categories).map(([title, items]) => (
          <div key={title} className="bg-white border-2 border-divider rounded-card p-6">
            <div className="font-fraunces text-[17px] font-bold mb-4">{title}</div>
            {items.map((item) => (
              <label
                key={item}
                className={`flex items-center gap-2.5 py-2 border-b border-divider last:border-0 cursor-pointer text-sm ${
                  checked[item] ? "line-through text-ink/35" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!checked[item]}
                  onChange={() => toggle(item)}
                  className="w-4 h-4 flex-shrink-0 accent-forest cursor-pointer"
                />
                {item}
              </label>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
