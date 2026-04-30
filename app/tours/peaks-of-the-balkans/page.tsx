import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, X, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import { getTourBySlug, getDeparturesByTour, itinerary, tours } from "@/data/tours";
import { reviews } from "@/data/reviews";
import { formatPrice, formatDateRange, spotsLabel, isLowAvailability } from "@/lib/utils";
import { DifficultyDots } from "@/components/ui/DifficultyDots";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TourGallery } from "@/components/tour/TourGallery";
import { TourPageNav } from "@/components/tour/TourPageNav";
import { ItineraryAccordion } from "@/components/tour/ItineraryAccordion";
import { BringChecklist } from "@/components/tour/BringChecklist";
import { FAQAccordion } from "@/components/tour/FAQAccordion";
import { TourStickyBar } from "@/components/tour/TourStickyBar";

export const metadata: Metadata = {
  title: "Peaks of the Balkans — 10-Day Guided Trek",
  description:
    "The iconic 192km trail crossing Albania, Montenegro & Kosovo. Small groups, local guides, all accommodation included.",
};

const included = [
  "Expert local guide for all 10 days",
  "9 nights in traditional guesthouses",
  "Breakfast and dinner every day",
  "Minibus transfers (Pristina ↔ Theth)",
  "Border crossing permits & fees",
  "GPX tracks & offline maps",
  "First aid kit & emergency comms",
  "Pre-trip information pack",
];

const notIncluded = [
  "International flights to Pristina",
  "Travel insurance (mandatory)",
  "Lunches on trail (typically €5–8)",
  "Alcoholic drinks",
  "Personal hiking gear",
  "Tips for guide (optional but appreciated)",
];

export default function PeaksOfTheBalkanosPage() {
  const tour = getTourBySlug("peaks-of-the-balkans");
  if (!tour) notFound();

  const departures = getDeparturesByTour("peaks-of-the-balkans");
  const now = new Date().toISOString().slice(0, 10);
  const nextDep = departures.find((d) => d.startDate >= now && d.status !== "past") ?? null;
  const relatedTours = tours.filter((t) => t.slug !== "peaks-of-the-balkans").slice(0, 3);

  return (
    <>
      {/* Gallery */}
      <div id="gallery-top">
        <TourGallery images={tour.images} tourName={tour.name} />
      </div>

      {/* Tour header */}
      <div className="bg-bone pt-10 border-b-2 border-divider">
        <div className="max-w-content mx-auto px-10">
          <div className="grid gap-12" style={{ gridTemplateColumns: "1fr 360px" }}>
            <div>
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-[13px] text-ink/45 mb-5">
                <Link href="/" className="text-ink/45 no-underline hover:text-ink">Home</Link>
                <span className="opacity-30">›</span>
                <Link href="/tours" className="text-ink/45 no-underline hover:text-ink">Tours</Link>
                <span className="opacity-30">›</span>
                <span>Peaks of the Balkans</span>
              </nav>

              {/* Meta row */}
              <div className="flex items-center gap-3 flex-wrap mb-4">
                {["ALB", "MNE", "XK"].map((c) => (
                  <span key={c} className="font-mono text-[11px] font-medium px-2.5 py-1 rounded-md border-[1.5px] border-forest text-forest tracking-[0.06em] uppercase">
                    {c}
                  </span>
                ))}
                <span className="font-mono text-[11px] font-medium px-2.5 py-1 rounded-md bg-ink text-white border-[1.5px] border-ink tracking-[0.06em] uppercase">
                  10 Days
                </span>
                <DifficultyDots level={4} />
              </div>

              <h1
                className="font-fraunces font-bold tracking-tight leading-[1.05] mb-5"
                style={{ fontSize: "clamp(36px, 4.5vw, 58px)", fontVariationSettings: "'opsz' 48" }}
              >
                Peaks of the Balkans
              </h1>
              <p className="text-[17px] text-ink/60 leading-[1.6] max-w-[640px] mb-8">
                The iconic 192km trail crossing three countries — through glacial lakes, stone-walled villages, and ridge walks with views to four nations. One of the last truly wild long-distance routes in Europe.
              </p>
            </div>

            {/* Floating booking card */}
            <div className="sticky top-[84px] self-start bg-white border-2 border-divider rounded-2xl p-7 mb-10">
              <div className="font-mono text-[11px] text-terra tracking-[0.1em] uppercase mb-1.5">
                Next Departure
              </div>
              <div className="font-fraunces text-[22px] font-bold mb-4">
                {nextDep ? formatDateRange(nextDep.startDate, nextDep.endDate) : "No upcoming dates"}
              </div>
              <div className="font-fraunces text-[38px] font-bold mb-1">
                {formatPrice(tour.priceFrom)}{" "}
                <span className="font-inter text-sm font-normal text-ink/45">/ person</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] mb-6">
                {nextDep && (
                  <span className={`font-mono text-[11px] px-2.5 py-1 rounded-full font-medium ${isLowAvailability(nextDep.spotsLeft) ? "bg-gold text-ink" : "bg-ink/7 text-ink"}`}>
                    {spotsLabel(nextDep.spotsLeft, nextDep.spotsTotal)}
                  </span>
                )}
              </div>
              <Link
                href="/tours/book"
                className="block w-full bg-terra text-white border-2 border-terra py-4 rounded-xl font-semibold text-[15px] no-underline text-center hover:opacity-88 transition-opacity mb-3"
              >
                Book This Trip
              </Link>
              <a
                href="https://wa.me/38349123456"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full border-2 border-divider text-ink py-[13px] rounded-xl text-sm font-medium no-underline hover:border-ink transition-colors"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                Ask a question on WhatsApp
              </a>

              <div className="h-px bg-divider my-5" />

              <div className="flex flex-col gap-1.5 text-[13px] text-ink/50">
                {["Expert local guide included", "All accommodation (guesthouses)", "No hidden costs"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-forest flex-shrink-0" strokeWidth={2.5} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* In-page nav */}
      <TourPageNav />

      {/* Overview */}
      <section className="py-20 border-b-2 border-divider" id="overview">
        <div className="max-w-content mx-auto px-10">
          <div className="grid gap-16" style={{ gridTemplateColumns: "1fr 320px" }}>
            <div className="prose-like">
              <p className="text-base leading-[1.8] text-ink/75 mb-5 drop-cap">
                The Peaks of the Balkans is unlike almost anything else in European hiking. A 192-kilometre loop threading through the highland villages of northern Albania, eastern Montenegro, and western Kosovo, it crosses three international borders on foot — through terrain that has barely changed in centuries.
              </p>
              <p className="text-base leading-[1.8] text-ink/75 mb-5">
                This is not a trail that was designed. It was stitched together from shepherds&apos; tracks, old army paths, and mountain crossings that local communities have used for generations. That&apos;s what makes it extraordinary: every kilometre feels found rather than built. You arrive in villages that see perhaps a hundred foreigners a year, sleep in family guesthouses, and eat food grown 200 metres from the table.
              </p>
              <p className="text-base leading-[1.8] text-ink/75 mb-5">
                Summit Balkans has been running this route since the trail was formally mapped. Our guides are from the region — many of them grew up within a day&apos;s walk of the route. They don&apos;t just know the path; they know the people along it. That makes a difference you feel on the first day and remember long after the last.
              </p>
              <p className="text-base leading-[1.8] text-ink/75">
                The trail requires a solid base of hiking fitness: 10 consecutive days with daily distances of 15–25km and significant elevation gain. No technical climbing is involved, but good boots, strong legs, and some comfort with remote terrain are essential.
              </p>
            </div>

            {/* Facts card */}
            <div className="bg-white border-2 border-divider rounded-card overflow-hidden self-start">
              {[
                ["Start", "Theth, Albania"],
                ["End", "Theth, Albania (loop)"],
                ["Distance", "~192 km total"],
                ["Duration", "10 days hiking"],
                ["Group size", "Max 12 travellers"],
                ["Accommodation", "Traditional guesthouses"],
                ["Meals", "Breakfast + dinner daily"],
                ["Transport", "Minibus Pristina ↔ Theth"],
                ["Season", "Jun – Sep"],
                ["Fitness", "Good–strong required"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start px-5 py-4 border-b border-divider last:border-0">
                  <span className="font-mono text-[11px] text-ink/40 uppercase tracking-[0.08em] w-[120px] flex-shrink-0 pt-px">
                    {label}
                  </span>
                  <span className="text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Itinerary */}
      <section className="py-20 border-b-2 border-divider" id="itinerary">
        <div className="max-w-content mx-auto px-10">
          <SectionLabel>Day by Day</SectionLabel>
          <h2 className="font-fraunces text-3xl font-bold tracking-tight mb-8">
            10-Day Itinerary
          </h2>
          <ItineraryAccordion days={itinerary} />
        </div>
      </section>

      {/* Included */}
      <section className="py-20 border-b-2 border-divider" id="included">
        <div className="max-w-content mx-auto px-10">
          <SectionLabel>What You Get</SectionLabel>
          <h2 className="font-fraunces text-3xl font-bold tracking-tight mb-8">
            Included &amp; not included
          </h2>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2.5 font-fraunces text-xl font-bold mb-5">
                <Check className="w-5 h-5 text-forest" strokeWidth={2} />
                What&apos;s included
              </div>
              <ul className="list-none flex flex-col gap-2.5">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] leading-[1.5]">
                    <Check className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2.5 font-fraunces text-xl font-bold mb-5">
                <X className="w-5 h-5 text-red-600" strokeWidth={2} />
                Not included
              </div>
              <ul className="list-none flex flex-col gap-2.5">
                {notIncluded.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] leading-[1.5]">
                    <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <BringChecklist />
        </div>
      </section>

      {/* Dates & Prices */}
      <section className="py-20 border-b-2 border-divider" id="dates">
        <div className="max-w-content mx-auto px-10">
          <SectionLabel>Availability</SectionLabel>
          <h2 className="font-fraunces text-3xl font-bold tracking-tight mb-8">
            Dates &amp; Prices
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["Date", "Duration", "Guide", "Spots", "Price", ""].map((h) => (
                    <th key={h} className="font-mono text-[11px] tracking-[0.1em] uppercase text-ink/40 px-4 py-2.5 text-left border-b-2 border-divider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {departures.map((dep) => {
                  const past = dep.status === "past";
                  const urgent = dep.status === "low";
                  return (
                    <tr
                      key={dep.id}
                      className={`border-b border-divider hover:bg-ink/[0.02] transition-colors ${past ? "opacity-40" : ""}`}
                    >
                      <td className="px-4 py-4 font-mono text-[13px]">
                        {formatDateRange(dep.startDate, dep.endDate)}
                      </td>
                      <td className="px-4 py-4 text-sm">10 days</td>
                      <td className="px-4 py-4 text-sm flex items-center gap-2">
                        <span className="w-[30px] h-[30px] rounded-full bg-forest flex items-center justify-center font-fraunces text-[13px] font-bold text-white">
                          {dep.guide.charAt(0)}
                        </span>
                        {dep.guide}
                      </td>
                      <td className="px-4 py-4 font-mono text-[13px]">
                        <span className={urgent ? "text-[#9A5B00]" : ""}>
                          {dep.spotsLeft}/{dep.spotsTotal}
                        </span>
                        {urgent && (
                          <span className="ml-1.5 inline-block bg-gold text-ink text-[10px] px-1.5 py-0.5 rounded font-mono font-medium">
                            Low
                          </span>
                        )}
                        {dep.status === "sold-out" && (
                          <span className="ml-1.5 inline-block bg-ink/10 text-ink/50 text-[10px] px-1.5 py-0.5 rounded font-mono font-medium">
                            Sold out
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 font-fraunces text-lg font-bold">
                        {formatPrice(dep.price)}
                      </td>
                      <td className="px-4 py-4">
                        {past || dep.status === "sold-out" ? (
                          <span className="text-[13px] text-ink/35">
                            {past ? "Past" : "Sold out"}
                          </span>
                        ) : (
                          <Link
                            href="/tours/book"
                            className="bg-terra text-white border-2 border-terra px-[18px] py-2 rounded-lg text-[13px] font-semibold no-underline whitespace-nowrap hover:opacity-85 transition-opacity"
                          >
                            Reserve Spot
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 border-b-2 border-divider" id="faq">
        <div className="max-w-content mx-auto px-10">
          <SectionLabel>Common Questions</SectionLabel>
          <h2 className="font-fraunces text-3xl font-bold tracking-tight mb-8">FAQ</h2>
          <FAQAccordion />
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 border-b-2 border-divider" id="reviews">
        <div className="max-w-content mx-auto px-10">
          <SectionLabel>Traveller Reviews</SectionLabel>
          <h2 className="font-fraunces text-3xl font-bold tracking-tight mb-8">
            What people say
          </h2>
          <div className="grid gap-12" style={{ gridTemplateColumns: "280px 1fr" }}>
            {/* Rating summary */}
            <div>
              <div className="font-fraunces font-bold text-[72px] leading-[1] tracking-[-0.04em]" style={{ fontVariationSettings: "'opsz' 72" }}>
                4.9
              </div>
              <div className="text-gold text-lg tracking-[3px] my-2">★★★★★</div>
              <div className="text-[13px] text-ink/45 mb-6">Based on 47 reviews</div>
              {[["5", "89%"], ["4", "9%"], ["3", "2%"], ["2", "0%"], ["1", "0%"]].map(([star, pct]) => (
                <div key={star} className="flex items-center gap-2.5 mb-2">
                  <span className="font-mono text-xs text-ink/50 w-4 text-right">{star}</span>
                  <div className="flex-1 h-1.5 bg-divider rounded-full overflow-hidden">
                    <div className="h-full bg-gold rounded-full" style={{ width: pct }} />
                  </div>
                  <span className="font-mono text-[11px] text-ink/40 w-7 text-right">{pct}</span>
                </div>
              ))}
            </div>

            {/* Review cards */}
            <div className="flex flex-col gap-4">
              {reviews.slice(0, 3).map((r) => (
                <div key={r.id} className="bg-white border-2 border-divider rounded-card p-6">
                  <div className="flex items-center gap-3 mb-3.5">
                    <div className="w-10 h-10 rounded-full bg-forest flex items-center justify-center font-fraunces text-lg font-bold text-white flex-shrink-0">
                      {r.avatarInitial}
                    </div>
                    <div>
                      <div className="text-[15px] font-semibold">{r.name}</div>
                      <div className="text-xs text-ink/40 font-mono">
                        {r.country} · {r.date.slice(0, 7)}
                      </div>
                    </div>
                    <div className="text-gold text-[13px] tracking-[1px] ml-auto">★★★★★</div>
                  </div>
                  <p className="text-[15px] leading-[1.7] text-ink/70 italic">
                    &ldquo;{r.quote}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related tours */}
      <section className="py-20" id="related">
        <div className="max-w-content mx-auto px-10">
          <SectionLabel>Keep Exploring</SectionLabel>
          <h2 className="font-fraunces text-3xl font-bold tracking-tight mb-8">
            Related tours
          </h2>
          <div className="grid grid-cols-3 gap-5">
            {relatedTours.map((t) => (
              <Link
                key={t.slug}
                href={`/tours/${t.slug}`}
                className="border-2 border-divider rounded-card overflow-hidden bg-white no-underline hover:border-terra hover:-translate-y-0.5 transition-all duration-200 group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${t.coverImage}&w=600`}
                  alt={t.name}
                  className="w-full h-[200px] object-cover block"
                  loading="lazy"
                />
                <div className="p-5">
                  <div className="font-fraunces text-xl font-bold mb-1.5 tracking-tight">
                    {t.name}
                  </div>
                  <div className="flex gap-3 text-[13px] text-ink/50 mb-4">
                    <span>{t.duration} days</span>
                    <span className="font-mono text-[11px] text-terra">{t.country.map(c => c.slice(0,3).toUpperCase()).join(" · ")}</span>
                  </div>
                  <div className="font-fraunces text-[22px] font-bold">
                    {formatPrice(t.priceFrom)}{" "}
                    <small className="font-inter text-xs font-normal text-ink/40">from / person</small>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky booking bar */}
      <TourStickyBar tour={tour} nextDep={nextDep} />
    </>
  );
}
