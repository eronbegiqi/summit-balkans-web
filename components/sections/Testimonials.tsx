import { reviews } from "@/data/reviews";
import { SectionLabel } from "@/components/ui/SectionLabel";

function TestiCard({ review }: { review: typeof reviews[0] }) {
  return (
    <div className="flex-none w-[360px] border-2 border-divider rounded-card bg-white px-7 py-7">
      <div className="text-gold text-sm tracking-[2px] mb-3.5">★★★★★</div>
      <p className="text-[15px] leading-[1.65] text-ink/75 mb-5 italic">
        &ldquo;{review.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div className="w-[38px] h-[38px] rounded-full bg-forest flex items-center justify-center font-fraunces text-base font-bold text-white flex-shrink-0">
          {review.avatarInitial}
        </div>
        <div>
          <div className="text-sm font-semibold">{review.name}</div>
          <div className="text-xs text-ink/45 font-mono">
            {review.country}
            {review.tour ? ` · ${review.tour}` : ""}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const doubled = [...reviews, ...reviews];

  return (
    <section className="py-24 bg-bone overflow-hidden border-t-2 border-divider">
      <div className="max-w-content mx-auto px-10 mb-12">
        <SectionLabel>Traveller Reviews</SectionLabel>
        <h2
          className="font-fraunces font-bold tracking-tight"
          style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
        >
          From the trail
        </h2>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex gap-5 w-max pause-on-hover"
          style={{ animation: "marquee 40s linear infinite" }}
        >
          {doubled.map((r, i) => (
            <TestiCard key={`${r.id}-${i}`} review={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
