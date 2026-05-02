const peaks = [
  {
    name: "Maja Jezercë",
    elevation: "2,694 m",
    country: "Albania",
    desc: "The dominant peak of the range, known for its imposing presence and glacial surroundings. The highest summit in the Balkans outside the Rhodope massif.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85",
  },
  {
    name: "Gjeravica",
    elevation: "2,656 m",
    country: "Kosovo",
    desc: "A rewarding summit accessible from the trail, offering panoramic views across Kosovo and Albania. Surrounded by three high alpine lakes.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=85",
  },
  {
    name: "Zla Kolata",
    elevation: "2,534 m",
    country: "Montenegro",
    desc: "A rugged and dramatic peak near the Albanian–Montenegrin border. Its sheer limestone walls rise directly from high alpine valleys.",
    image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=85",
  },
  {
    name: "Threeborder Peak",
    elevation: "~2,366 m",
    country: "Kosovo · Albania · Montenegro",
    desc: "A symbolic location where all three countries meet — one of the most unique spots in Europe. Standing here, you are simultaneously in three nations.",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=85",
  },
];

export function PeaksShowcase() {
  return (
    <section id="highlights" className="py-20 md:py-28 bg-white">
      <div className="max-w-content mx-auto px-5 md:px-10">
        <div className="mb-12">
          <div className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-terra mb-3">
            Iconic Peaks
          </div>
          <h2 className="font-fraunces text-[clamp(2rem,4vw,2.8rem)] font-bold tracking-tight">
            The summits that define the trail
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {peaks.map((peak) => (
            <div
              key={peak.name}
              className="group relative overflow-hidden rounded-card-hero border-2 border-divider bg-bone transition-transform duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={peak.image}
                  alt={peak.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                {/* Elevation badge */}
                <div className="absolute bottom-3 right-3 bg-white/15 backdrop-blur-sm border border-white/25 rounded-lg px-2.5 py-1">
                  <span className="font-mono text-[11px] font-semibold text-white">
                    {peak.elevation}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-terra mb-1.5">
                  {peak.country}
                </div>
                <h3 className="font-fraunces text-xl font-bold tracking-tight mb-2">
                  {peak.name}
                </h3>
                <p className="text-[13px] leading-[1.7] text-ink/60">{peak.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
