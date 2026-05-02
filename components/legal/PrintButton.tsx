"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="print-btn hidden md:inline-flex items-center gap-2 text-sm text-ink/45 hover:text-ink border border-mist rounded-lg px-4 py-2 bg-transparent cursor-pointer transition-colors flex-shrink-0 mt-1"
      aria-label="Print or save as PDF"
    >
      <Printer className="w-4 h-4" strokeWidth={1.5} />
      Print / Save PDF
    </button>
  );
}
