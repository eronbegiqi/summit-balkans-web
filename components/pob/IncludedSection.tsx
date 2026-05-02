import { Check, X } from "lucide-react";

const included = [
  "Local certified guide (3+ years experience)",
  "Border permits — we handle all paperwork",
  "All accommodations in family-run guesthouses",
  "Daily breakfast and dinner at each guesthouse",
  "Luggage transport on select stages",
  "Trail snacks and emergency support",
  "All national park entry fees",
  "GPX tracks and offline trail maps",
];

const notIncluded = [
  "International flights to Pristina / Tirana",
  "Travel insurance (strongly recommended)",
  "Lunches and personal drinks on trail",
  "Tips for guide (optional but appreciated)",
  "Gear hire (available via our gear rental)",
  "Pre/post accommodation in cities",
];

export function IncludedSection() {
  return (
    <section className="py-20 md:py-28 bg-bone">
      <div className="max-w-content mx-auto px-5 md:px-10">
        <div className="mb-10">
          <div className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-terra mb-3">
            What's Covered
          </div>
          <h2 className="font-fraunces text-[clamp(2rem,4vw,2.8rem)] font-bold tracking-tight">
            Included & not included
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Included */}
          <div className="bg-white border-2 border-divider rounded-card-hero p-6 md:p-8">
            <div className="font-fraunces text-lg font-bold mb-5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand/10 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-brand" strokeWidth={2.5} />
              </span>
              What's Included
            </div>
            <ul className="space-y-3">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink/75">
                  <Check className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Not included */}
          <div className="bg-white border-2 border-divider rounded-card-hero p-6 md:p-8">
            <div className="font-fraunces text-lg font-bold mb-5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-ink/7 flex items-center justify-center">
                <X className="w-3.5 h-3.5 text-ink/50" strokeWidth={2.5} />
              </span>
              Not Included
            </div>
            <ul className="space-y-3">
              {notIncluded.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink/55">
                  <X className="w-4 h-4 text-ink/30 flex-shrink-0 mt-0.5" strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
