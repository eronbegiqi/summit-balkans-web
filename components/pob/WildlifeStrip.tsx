const species = [
  {
    name: "Brown Bear",
    status: "Vulnerable",
    statusColor: "text-amber-600",
    desc: "One of Europe's largest populations roams the Prokletije. Rarely seen — signs of their presence are common.",
    icon: "🐻",
  },
  {
    name: "Gray Wolf",
    status: "Least Concern",
    statusColor: "text-green-600",
    desc: "Pack territories span the entire circuit. Their howls are heard most nights in the remote stages.",
    icon: "🐺",
  },
  {
    name: "Balkan Lynx",
    status: "Critically Endangered",
    statusColor: "text-red-600",
    desc: "Fewer than 50 individuals remain. The Peaks of the Balkans trail passes through their core habitat.",
    icon: "🐆",
  },
  {
    name: "Chamois",
    status: "Least Concern",
    statusColor: "text-green-600",
    desc: "Groups of chamois are regularly spotted on exposed ridgelines in the early morning stages.",
    icon: "🦌",
  },
];

const parks = [
  { name: "Theth National Park", country: "Albania" },
  { name: "Valbona Valley National Park", country: "Albania" },
  { name: "Prokletije National Park", country: "Montenegro" },
];

export function WildlifeStrip() {
  return (
    <section className="py-20 md:py-28 bg-bone">
      <div className="max-w-content mx-auto px-5 md:px-10">
        <div className="mb-12">
          <div className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-terra mb-3">
            Wildlife & Nature
          </div>
          <h2 className="font-fraunces text-[clamp(2rem,4vw,2.8rem)] font-bold tracking-tight">
            One of Europe's richest ecosystems
          </h2>
        </div>

        {/* Species cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {species.map((s) => (
            <div
              key={s.name}
              className="bg-white border-2 border-divider rounded-card p-5"
            >
              <div className="text-3xl mb-3">{s.icon}</div>
              <h3 className="font-fraunces text-lg font-bold mb-1">{s.name}</h3>
              <div className={`font-mono text-[10px] uppercase tracking-[0.1em] mb-3 ${s.statusColor}`}>
                {s.status}
              </div>
              <p className="text-[13px] leading-[1.65] text-ink/55">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* National Parks */}
        <div className="border-t-2 border-divider pt-8">
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/40 mb-4">
            Protected Areas Along the Trail
          </div>
          <div className="flex flex-wrap gap-3">
            {parks.map(({ name, country }) => (
              <div
                key={name}
                className="flex items-center gap-3 bg-white border-2 border-divider rounded-card px-4 py-3"
              >
                <div className="w-2 h-2 rounded-full bg-brand flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-ink">{name}</div>
                  <div className="font-mono text-[10px] text-ink/40 uppercase tracking-wider">{country}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
