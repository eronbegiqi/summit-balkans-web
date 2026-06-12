import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Lock } from "lucide-react";
import { BookingWizard } from "@/components/booking/BookingWizard";

export const metadata: Metadata = {
  title: "Book — Peaks of the Balkans",
  description: "Book your spot on the Peaks of the Balkans guided trek.",
};

export default function BookPage() {
  return (
    <div className="min-h-screen bg-bone">
      {/* Booking nav */}
      <header className="fixed top-0 left-0 right-0 z-[100] h-16 px-6 md:px-10 flex items-center justify-between bg-bone border-b-2 border-divider">
        <Link href="/" className="flex items-center no-underline">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Summit Balkans" width={148} height={36} className="h-8 w-auto" />
        </Link>
        <Link
          href="/tours"
          className="flex items-center gap-1.5 text-sm text-ink/50 no-underline hover:text-ink transition-colors"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
          Back to tours
        </Link>
        <div className="flex items-center gap-1.5 text-[13px] text-ink/45">
          <Lock className="w-3.5 h-3.5" strokeWidth={1.5} />
          Secured checkout
        </div>
      </header>

      {/* Content — BookingWizard renders its own fixed step bar below the header */}
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 pb-20" style={{ paddingTop: "162px" }}>
        <BookingWizard />
      </div>
    </div>
  );
}
