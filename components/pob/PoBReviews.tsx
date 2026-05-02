import { reviews } from "@/data/reviews";
import { Star } from "lucide-react";

export function PoBReviews() {
  const pobReviews = reviews.filter((r) => r.tour === "Peaks of the Balkans");

  if (pobReviews.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-bone">
      <div className="max-w-content mx-auto px-5 md:px-10">
        <div className="mb-12">
          <div className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-terra mb-3">
            Reviews
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="font-fraunces text-[clamp(2rem,4vw,2.8rem)] font-bold tracking-tight">
              What past hikers say
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 text-gold fill-gold" strokeWidth={0} />
                ))}
              </div>
              <span className="font-mono text-sm font-semibold">4.9</span>
              <span className="font-mono text-[12px] text-ink/40">
                ({pobReviews.length} reviews)
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pobReviews.map((r) => (
            <div key={r.id} className="bg-white border-2 border-divider rounded-card-hero p-6 flex flex-col">
              {/* Stars */}
              <div className="flex mb-4">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-gold fill-gold" strokeWidth={0} />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="font-fraunces text-[1.05rem] leading-[1.55] text-ink flex-1 mb-5">
                &ldquo;{r.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-divider">
                <div className="w-9 h-9 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-mono text-[13px] font-bold text-forest">
                    {r.avatarInitial}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold">{r.name}</div>
                  <div className="font-mono text-[11px] text-ink/40">{r.country}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
