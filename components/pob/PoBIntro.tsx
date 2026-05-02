const stats = [
  { label: "Total Distance", value: "192 km" },
  { label: "Highest Point", value: "2,694 m" },
  { label: "Countries", value: "Kosovo · Albania · Montenegro" },
  { label: "Duration", value: "10–13 days" },
  { label: "Difficulty", value: "Moderate to Challenging" },
  { label: "Best Season", value: "June – October" },
];

export function PoBIntro() {
  return (
    <section id="overview-intro" className="py-20 md:py-28 bg-bone">
      <div className="max-w-content mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-14 lg:gap-20 items-start">
          {/* Left — prose */}
          <div>
            <div className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-terra mb-4">
              The Trail
            </div>
            <div className="prose prose-lg max-w-none text-ink/80 leading-[1.85]">
              <p className="first-letter:text-[4.5rem] first-letter:font-fraunces first-letter:font-bold first-letter:float-left first-letter:leading-[0.8] first-letter:mr-2 first-letter:mt-1.5 first-letter:text-ink">
                The Peaks of the Balkans is a world-class long-distance trekking
                route that weaves through the remote and dramatic landscapes of
                Kosovo, Albania, and Montenegro. Stretching approximately 192
                kilometres, the trail traverses the heart of the wild and rugged
                Accursed Mountains — a region known for its steep limestone peaks,
                deep glacial valleys, and preserved traditional way of life.
              </p>
              <p>
                What makes this trail unique is not only its natural beauty, but
                its role as a symbol of connection — linking communities that were
                once separated by borders into a shared experience of nature,
                culture, and adventure. This is not just a hike. It is a multi-day
                journey through history, culture, and wilderness, where every step
                tells a story.
              </p>
              <p>
                One of Europe's last truly wild mountain regions, the trail offers
                a rare chance to explore untouched wilderness, immerse yourself in
                highland Albanian traditions, and cross three international borders
                on foot through remote mountain passes with no visible border
                infrastructure.
              </p>
            </div>
          </div>

          {/* Right — sticky stat block */}
          <div className="lg:sticky lg:top-[128px]">
            <div className="border-2 border-divider rounded-card-hero bg-white">
              <div className="px-6 py-5 border-b border-divider">
                <div className="font-fraunces text-xl font-bold tracking-tight">
                  Trail at a Glance
                </div>
              </div>
              <div className="divide-y divide-divider">
                {stats.map(({ label, value }) => (
                  <div key={label} className="px-6 py-4 flex justify-between items-baseline gap-4">
                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink/45 shrink-0">
                      {label}
                    </span>
                    <span className="font-mono text-sm font-semibold text-ink text-right">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="px-6 py-5 border-t border-divider flex gap-2.5">
                <a
                  href="#dates"
                  className="flex-1 bg-brand text-white text-center text-sm font-semibold py-3 rounded-lg no-underline hover:bg-brand/90 transition-colors"
                >
                  View Departures
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
