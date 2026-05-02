import Link from "next/link";

export function PoBCTABand() {
  return (
    <section className="bg-ink py-20 md:py-28">
      <div className="max-w-content mx-auto px-5 md:px-10 text-center">
        <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-white/35 mb-5">
          ★ Flagship Experience
        </div>
        <h2
          className="font-fraunces font-bold text-white leading-tight tracking-tight mb-5"
          style={{ fontSize: "clamp(2.2rem,5vw,4rem)" }}
        >
          Walk one of Europe's<br className="hidden sm:block" /> great trails.
        </h2>
        <p className="text-white/55 text-lg max-w-xl mx-auto leading-relaxed mb-10">
          Limited group sizes. Family-run guesthouses. Local guides who know every stone.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#dates"
            className="bg-brand text-white font-semibold text-sm px-8 py-4 rounded-lg no-underline hover:bg-brand/90 transition-colors"
          >
            View Departures
          </a>
          <Link
            href="/private-trips"
            className="border-2 border-white/25 text-white font-semibold text-sm px-8 py-4 rounded-lg no-underline hover:border-white/50 hover:bg-white/5 transition-all"
          >
            Plan a Private Group
          </Link>
        </div>
      </div>
    </section>
  );
}
