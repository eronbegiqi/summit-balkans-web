"use client";

import { useState } from "react";
import { Download, Check } from "lucide-react";

const categories: { title: string; items: string[]; readOnly?: boolean }[] = [
  {
    title: "Essential",
    items: [
      "Hiking boots (broken in)",
      "Trekking poles",
      "Rain jacket",
      "Base layers (merino)",
      "First aid kit",
      "Headlamp + batteries",
      "Water filter / purification tabs",
    ],
  },
  {
    title: "Recommended",
    items: [
      "Gaiters",
      "Sun hat + sunscreen",
      "Trekking trousers",
      "Warm mid-layer",
      "Blister kit",
      "Snacks for trail",
    ],
  },
  {
    title: "We Provide",
    readOnly: true,
    items: [
      "Route maps & GPX",
      "Group first aid",
      "Emergency comms device",
      "Welcome pack",
    ],
  },
];

function handlePrintPackList() {
  const printWindow = window.open("", "_blank", "width=700,height=800");
  if (!printWindow) return;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Summit Balkans — Pack List</title>
  <style>
    body { font-family: system-ui, sans-serif; color: #1a1a1a; padding: 40px; max-width: 600px; margin: 0 auto; }
    h1 { font-size: 24px; margin-bottom: 4px; }
    p.sub { color: #666; font-size: 13px; margin-bottom: 32px; }
    h2 { font-size: 15px; text-transform: uppercase; letter-spacing: 0.1em; color: #555; margin: 24px 0 10px; border-bottom: 1px solid #e5e5e5; padding-bottom: 6px; }
    ul { list-style: none; padding: 0; margin: 0; }
    li { display: flex; align-items: center; gap: 10px; padding: 7px 0; font-size: 14px; border-bottom: 1px solid #f0f0f0; }
    li:last-child { border-bottom: none; }
    .box { width: 14px; height: 14px; border: 1.5px solid #bbb; border-radius: 3px; flex-shrink: 0; }
    .check { width: 14px; height: 14px; background: #3B4A2E; border-radius: 3px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
    .check svg { width: 9px; height: 9px; stroke: white; stroke-width: 2.5; fill: none; }
    footer { margin-top: 40px; font-size: 11px; color: #999; text-align: center; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <h1>Pack List</h1>
  <p class="sub">Peaks of the Balkans — Summit Balkans</p>
  ${categories
    .map(
      (cat) => `
  <h2>${cat.title}</h2>
  <ul>
    ${cat.items
      .map(
        (item) => `
    <li>
      ${
        cat.readOnly
          ? `<div class="check"><svg viewBox="0 0 12 12"><polyline points="1.5,6 4.5,9 10.5,3"/></svg></div>`
          : `<div class="box"></div>`
      }
      ${item}
    </li>`
      )
      .join("")}
  </ul>`
    )
    .join("")}
  <footer>summitbalkans.com</footer>
  <script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); }</script>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
}

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
          onClick={handlePrintPackList}
          className="inline-flex items-center gap-2 bg-transparent border-2 border-divider text-ink px-[18px] py-2.5 rounded-lg font-inter text-[13px] font-semibold cursor-pointer whitespace-nowrap hover:border-ink transition-colors"
        >
          <Download className="w-[15px] h-[15px]" strokeWidth={1.5} />
          Download Pack List PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {categories.map(({ title, items, readOnly }) => (
          <div key={title} className="bg-white border-2 border-divider rounded-card p-6">
            <div className="font-fraunces text-[17px] font-bold mb-4">{title}</div>
            {items.map((item) => {
              if (readOnly) {
                return (
                  <div
                    key={item}
                    className="flex items-center gap-2.5 py-2 border-b border-divider last:border-0 text-sm text-ink/70"
                  >
                    <span className="w-4 h-4 flex-shrink-0 rounded bg-forest/15 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-forest" strokeWidth={2.5} />
                    </span>
                    {item}
                  </div>
                );
              }
              return (
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
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
