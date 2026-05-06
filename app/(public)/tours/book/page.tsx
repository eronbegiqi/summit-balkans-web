import type { Metadata } from "next";
import Link from "next/link";
import { Mountain, ChevronLeft, Lock } from "lucide-react";
import { BookingWizard } from "@/components/booking/BookingWizard";

export const metadata: Metadata = {
  title: "Book — Peaks of the Balkans",
  description: "Book your spot on the Peaks of the Balkans guided trek.",
};

const stepLabels = ["Select Departure", "Travellers", "Add-ons", "Your Details", "Review & Pay"];

export default function BookPage() {
  return (
    <div className="min-h-screen bg-bone">
      {/* Booking nav */}
      <header className="fixed top-0 left-0 right-0 z-[100] h-16 px-10 flex items-center justify-between bg-bone border-b-2 border-divider">
        <Link href="/" className="flex items-center gap-2 font-fraunces text-lg font-bold text-ink no-underline">
          <span className="w-7 h-7 bg-terra rounded-md flex items-center justify-center flex-shrink-0">
            <Mountain className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
          </span>
          Summit Balkans
        </Link>
        <Link
          href="/tours/peaks-of-the-balkans"
          className="flex items-center gap-1.5 text-sm text-ink/50 no-underline hover:text-ink transition-colors"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
          Back to tour
        </Link>
        <div className="flex items-center gap-1.5 text-[13px] text-ink/45">
          <Lock className="w-3.5 h-3.5" strokeWidth={1.5} />
          Secured checkout
        </div>
      </header>

      {/* Progress bar */}
      <div className="fixed top-16 left-0 right-0 z-[99] bg-bone border-b-2 border-divider px-10">
        <div className="max-w-[1100px] mx-auto flex">
          {stepLabels.map((label, i) => (
            <div
              key={label}
              className="flex-1 flex flex-col items-center py-3.5 pb-3 border-b-[3px] border-transparent"
            >
              <div className="w-[26px] h-[26px] rounded-full border-2 border-divider flex items-center justify-center font-mono text-xs text-ink/35 mb-1.5">
                {i + 1}
              </div>
              <div className="text-xs text-ink/40 font-medium whitespace-nowrap">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div
        className="max-w-[1100px] mx-auto px-10 pb-20"
        style={{ paddingTop: "132px" }}
      >
        <BookingWizard />
      </div>
    </div>
  );
}
