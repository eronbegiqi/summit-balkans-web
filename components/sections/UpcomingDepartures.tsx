import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getUpcomingDepartures } from "@/data/tours";
import { formatDateRange, formatPrice, isLowAvailability } from "@/lib/utils";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function UpcomingDepartures() {
  const departures = getUpcomingDepartures(6);

  const countryFlags: Record<string, string> = {
    Albania: "🇦🇱",
    Montenegro: "🇲🇪",
    Kosovo: "🇽🇰",
  };

  return (
    <section className="bg-bone py-20 border-t-2 border-divider">
      <div className="max-w-content mx-auto px-10 mb-6">
        <SectionLabel>Next Departures</SectionLabel>
        <h2 className="font-fraunces text-2xl font-bold tracking-tight">
          Join a scheduled group
        </h2>
      </div>

      <div
        className="flex gap-5 overflow-x-auto px-10 pb-6 snap-x snap-mandatory"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#C9CFC8 transparent" }}
      >
        {departures.map((dep) => {
          const urgent = isLowAvailability(dep.spotsLeft);
          return (
            <div
              key={dep.id}
              className="flex-none w-[300px] rounded-card border-2 border-divider bg-white overflow-hidden snap-start hover:border-terra hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${dep.tour.coverImage}&w=400`}
                alt={dep.tour.name}
                className="w-full h-[168px] object-cover block"
                loading="lazy"
              />
              <div className="px-5 py-[18px]">
                <div className="flex items-center gap-2 mb-2.5">
                  {dep.tour.country.map((c) => (
                    <span
                      key={c}
                      className="font-mono text-[10px] font-medium px-2 py-0.5 rounded border border-divider tracking-[0.06em] uppercase"
                    >
                      {countryFlags[c]} {c.slice(0, 3).toUpperCase()}
                    </span>
                  ))}
                  <span
                    className={`font-mono text-[10px] font-medium px-2 py-0.5 rounded ml-auto tracking-[0.04em] ${
                      urgent ? "bg-gold text-ink" : "bg-ink/7 text-ink"
                    }`}
                  >
                    {dep.spotsLeft}/{dep.spotsTotal} spots
                  </span>
                </div>

                <div className="font-fraunces text-lg font-semibold mb-1.5 tracking-tight">
                  {dep.tour.name}
                </div>
                <div className="font-mono text-xs text-ink/50 mb-3.5">
                  {formatDateRange(dep.startDate, dep.endDate)}
                </div>

                <div className="flex items-center justify-between">
                  <div className="font-fraunces text-[22px] font-bold">
                    {formatPrice(dep.price)}{" "}
                    <span className="font-inter text-sm font-normal text-ink/45">/ person</span>
                  </div>
                  <Link
                    href={`/tours/${dep.tourSlug}`}
                    className="flex items-center gap-1 text-[13px] font-semibold text-terra no-underline border-2 border-terra px-3.5 py-1.5 rounded-lg hover:bg-terra hover:text-white transition-all"
                  >
                    Book
                    <ArrowRight className="w-3 h-3" strokeWidth={2} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
