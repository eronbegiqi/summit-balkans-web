"use client";

import { useEffect, useMemo, useState } from "react";
import { BookingPolicySummary } from "@/components/booking/BookingPolicySummary";
import { SpotsBadge } from "@/components/ui/SpotsBadge";
import { formatDateRange, formatPrice } from "@/lib/utils";
import Link from "next/link";

interface DepartureRow {
  id: number;
  startDate: string;
  endDate: string;
  capacity: number;
  bookedCount: number | null;
  pricePerPersonEur: string | null;
  tourSlug: string;
  guideName: string | null;
  guidedPriceEur: string | null;
}

export function PoBDepartures() {
  const [departures, setDepartures] = useState<DepartureRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const today = new Date().toISOString().split("T")[0];

    fetch("/api/public/departures?limit=50")
      .then((response) => response.json())
      .then((data) => {
        const rows = Array.isArray(data) ? data : (data.departures ?? []);
        const pobDeps = rows.filter(
          (dep: DepartureRow) => dep.tourSlug === "peaks-of-the-balkans" && dep.startDate >= today
        );

        if (mounted) {
          setDepartures(pobDeps);
        }
      })
      .catch(() => {
        if (mounted) {
          setDepartures([]);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const lowestPrice = useMemo(() => {
    if (departures.length === 0) return 1290;
    const prices = departures.map((dep) => Number(dep.pricePerPersonEur ?? dep.guidedPriceEur ?? 0));
    return Math.min(...prices);
  }, [departures]);

  return (
    <section id="dates" className="py-20 md:py-28 bg-white">
      <div className="max-w-content mx-auto px-5 md:px-10">
        <div className="mb-10">
          <div className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-terra mb-3">
            Dates & Prices
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="font-fraunces text-[clamp(2rem,4vw,2.8rem)] font-bold tracking-tight">
              Upcoming Departures
            </h2>
            <div className="font-mono text-[13px] text-ink/45">
              From{" "}
              <span className="font-fraunces font-semibold text-ink text-base">{formatPrice(lowestPrice)}</span>
              {" "}per person
            </div>
          </div>
        </div>

        <BookingPolicySummary />

        <div className="border-2 border-divider rounded-card-hero overflow-hidden">
          <div className="hidden md:grid grid-cols-[1fr_130px_100px_80px_140px] gap-4 px-6 py-3.5 border-b-2 border-divider bg-bone">
            {['Dates', 'Guide', 'Spots', 'Price', ''].map((h) => (
              <div key={h} className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/40">
                {h}
              </div>
            ))}
          </div>

          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col md:grid md:grid-cols-[1fr_130px_100px_80px_140px] gap-3 md:gap-4 px-6 py-5 items-start md:items-center border-b border-divider last:border-b-0"
              >
                <div className="h-4 w-3/4 rounded bg-ink/8" />
                <div className="h-4 w-20 rounded bg-ink/8" />
                <div className="h-4 w-16 rounded bg-ink/8" />
                <div className="h-4 w-16 rounded bg-ink/8" />
                <div className="h-9 w-24 rounded-lg bg-ink/8" />
              </div>
            ))
          ) : departures.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="font-mono text-sm text-ink/40">No upcoming departures. Contact us for custom dates.</p>
            </div>
          ) : (
            departures.map((dep, i) => {
              const spotsLeft = Math.max(dep.capacity - (dep.bookedCount ?? 0), 0);
              const soldOut = spotsLeft <= 0;
              const price = Number(dep.pricePerPersonEur ?? dep.guidedPriceEur ?? 0);

              return (
                <div
                  key={dep.id}
                  className={`flex flex-col md:grid md:grid-cols-[1fr_130px_100px_80px_140px] gap-3 md:gap-4 px-6 py-5 items-start md:items-center ${
                    i < departures.length - 1 ? "border-b border-divider" : ""
                  } ${soldOut ? "opacity-50" : ""}`}
                >
                  <div>
                    <div className="font-fraunces text-base font-semibold">
                      {formatDateRange(dep.startDate, dep.endDate)}
                    </div>
                    <div className="font-mono text-[11px] text-ink/40 mt-0.5">10 days</div>
                  </div>
                  <div className="text-sm text-ink/70">{dep.guideName ?? "Local guide"}</div>
                  <div>
                    <SpotsBadge spotsLeft={spotsLeft} spotsTotal={dep.capacity} />
                  </div>
                  <div className="font-fraunces text-sm font-semibold">{formatPrice(price)}</div>
                  <div>
                    {soldOut ? (
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
              );
            })
          )}
        </div>

        <p className="mt-4 font-mono text-[12px] text-ink/40 text-center">
          Prices include guide, accommodation, daily breakfast & dinner, border permits, and all national park fees.
        </p>
      </div>
    </section>
  );
}
