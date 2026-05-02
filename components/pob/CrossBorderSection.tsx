export function CrossBorderSection() {
  return (
    <section className="py-20 md:py-28" style={{ background: "rgba(212,165,116,0.10)" }}>
      <div className="max-w-content mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative rounded-card-hero overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=900&q=85"
              alt="Remote mountain pass — border crossing on the Peaks of the Balkans trail"
              className="w-full h-[400px] lg:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <div className="bg-white/15 backdrop-blur-sm border border-white/25 rounded-xl px-4 py-3">
                <p className="font-mono text-[11px] text-white/80 leading-snug">
                  Čakor Pass, 1,849 m — Kosovo / Montenegro border
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-terra mb-4">
              Unique Feature
            </div>
            <h2 className="font-fraunces text-[clamp(2rem,4vw,2.8rem)] font-bold tracking-tight leading-tight mb-6">
              Cross three borders on foot
            </h2>
            <p className="text-ink/70 leading-[1.85] mb-6 text-[16px]">
              This trail is one of the few in the world where hikers can cross three
              international borders entirely on foot, moving through remote areas with
              no visible border infrastructure. Each crossing happens in a high mountain
              pass, often without a single border marker in sight.
            </p>
            <p className="text-ink/70 leading-[1.85] mb-8 text-[16px]">
              A special cross-border permit system allows legal and smooth passage. Most
              nationalities (EU, US, UK, Canada, Australia) require no visa for Albania,
              Kosovo, or Montenegro. We handle all group border paperwork as part of every
              departure.
            </p>

            {/* Highlight box */}
            <div className="border-2 border-terra/30 bg-terra/5 rounded-card p-5">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-terra/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-terra text-xs font-bold">✓</span>
                </div>
                <div>
                  <div className="font-semibold text-ink text-sm mb-1">
                    Special border permit included
                  </div>
                  <div className="text-[13px] text-ink/60 leading-snug">
                    We handle all paperwork for the group — one of the only operators licensed for
                    all three crossings on the full circuit.
                  </div>
                </div>
              </div>
            </div>

            {/* Country badges */}
            <div className="flex gap-2.5 mt-6">
              {["Kosovo", "Albania", "Montenegro"].map((c) => (
                <span
                  key={c}
                  className="font-mono text-[11px] uppercase tracking-[0.1em] bg-white border-2 border-divider text-ink/70 px-3 py-1.5 rounded-full"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
