import { departures } from "@/data/tours";
import { BookingPolicySummary } from "@/components/booking/BookingPolicySummary";
import { SpotsBadge } from "@/components/ui/SpotsBadge";
import { formatDateRange, formatPrice } from "@/lib/utils";
import Link from "next/link";

export function PoBDepartures() {
  const pobDeps = departures.filter(
    (d) => d.tourSlug === "peaks-of-the-balkans" && d.status !== "past"
  );

  return (
    <section id="dates" className="py-20 md:py-28 bg-white">
      <div className="max-w-content mx-auto px-5 md:px-10">
        <div className="mb-10">
          <div className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-terra mb-3">
            Dates & Prices
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="font-fraunces text-[clamp(2rem,4vw,2.8rem)] font-bold tracking-tight">
              2026 Departures
            </h2>
            <div className="font-mono text-[13px] text-ink/45">
              From{" "}
              <span className="font-semibold text-ink text-base">€1,290</span>
              {" "}per person
            </div>
          </div>
        </div>

        <BookingPolicySummary />

        {/* Departures table */}
        <div className="border-2 border-divider rounded-card-hero overflow-hidden">
          {/* Header */}
          <div className="hidden md:grid grid-cols-[1fr_130px_100px_80px_140px] gap-4 px-6 py-3.5 border-b-2 border-divider bg-bone">
            {["Dates", "Guide", "Spots", "Price", ""].map((h) => (
              <div key={h} className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/40">
                {h}
              </div>
            ))}
          </div>

          {pobDeps.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="font-mono text-sm text-ink/40">No upcoming departures. Contact us for custom dates.</p>
            </div>
          ) : (
            pobDeps.map((dep, i) => (
              <div
                key={dep.id}
                className={`flex flex-col md:grid md:grid-cols-[1fr_130px_100px_80px_140px] gap-3 md:gap-4 px-6 py-5 items-start md:items-center ${
                  i < pobDeps.length - 1 ? "border-b border-divider" : ""
                } ${dep.status === "sold-out" ? "opacity-50" : ""}`}
              >
                <div>
                  <div className="font-fraunces text-base font-semibold">
                    {formatDateRange(dep.startDate, dep.endDate)}
                  </div>
                  <div className="font-mono text-[11px] text-ink/40 mt-0.5">10 days</div>
                </div>
                <div className="text-sm text-ink/70">{dep.guide}</div>
                <div>
                  <SpotsBadge spotsLeft={dep.spotsLeft} spotsTotal={dep.spotsTotal} />
                </div>
                <div className="font-mono text-sm font-semibold">{formatPrice(dep.price)}</div>
                <div>
                  {dep.status === "sold-out" ? (
                    <span className="font-mono text-[11px] text-ink/35 uppercase tracking-wider">Sold Out</span>
                  ) : (
                    <Link
                      href="/tours/book"
                      className="inline-block bg-brand text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg no-underline hover:bg-brand/90 transition-colors whitespace-nowrap"
                    >
                      Reserve Spot
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <p className="mt-4 font-mono text-[12px] text-ink/40 text-center">
          Prices include guide, accommodation, daily breakfast & dinner, border permits, and all national park fees.
        </p>
      </div>
    </section>
  );
}
