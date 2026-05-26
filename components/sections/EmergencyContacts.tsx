import { AlertTriangle, Phone } from "lucide-react";

const countries = [
  {
    flag: "🇦🇱",
    name: "Albania",
    numbers: [
      { label: "Emergency (all)", number: "112" },
      { label: "Police", number: "129" },
      { label: "Ambulance", number: "127" },
      { label: "Fire", number: "128" },
      { label: "Mountain rescue", number: "112" },
    ],
  },
  {
    flag: "🇽🇰",
    name: "Kosovo",
    numbers: [
      { label: "Emergency (all)", number: "112" },
      { label: "Police", number: "192" },
      { label: "Ambulance", number: "194" },
      { label: "Fire", number: "193" },
      { label: "Mountain rescue (KPSS)", number: "0800 80080", highlight: true },
      { label: "Mountain rescue (mobile)", number: "+383 49 840 228", highlight: true },
    ],
  },
  {
    flag: "🇲🇪",
    name: "Montenegro",
    numbers: [
      { label: "Emergency (all)", number: "112" },
      { label: "Police", number: "122" },
      { label: "Ambulance", number: "124" },
      { label: "Fire", number: "123" },
      { label: "Mountain rescue", number: "112" },
    ],
  },
];

const quickTips = [
  "Share your GPS coordinates when calling rescue — press and hold the location pin on Google Maps",
  "Keep your phone charged above 30% before any mountain day",
  "Note your guesthouse name and address — rescue services need a reference point",
  "The Peaks of the Balkans trail crosses borders — know which country you are in",
  "If injured: stop, stabilise, shelter, signal (whistle three blasts), then call",
];

export function EmergencyContactsSection() {
  return (
    <section className="bg-ink text-white py-16 md:py-20">
      <div className="max-w-content mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-14 h-14 rounded-full bg-red-500/15 flex items-center justify-center mb-5">
            <AlertTriangle className="w-7 h-7 text-red-400" strokeWidth={1.5} />
          </div>
          <h2 className="font-fraunces text-2xl md:text-3xl font-bold mb-3">Emergency Contacts on the Trail</h2>
          <p className="text-white/55 max-w-[500px] text-base">
            Save these numbers before you leave. The trail crosses three countries — know who to call in each one.
          </p>
        </div>

        {/* Universal number */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 md:p-8 text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Phone className="w-5 h-5 text-red-400" strokeWidth={1.5} />
            <span className="font-mono text-sm text-red-300 uppercase tracking-widest">Universal emergency</span>
          </div>
          <div className="font-fraunces text-5xl md:text-6xl font-bold text-white mb-2">112</div>
          <p className="text-white/60 text-sm">Works everywhere in Albania, Kosovo &amp; Montenegro.<br />Call this first for any life-threatening emergency.</p>
        </div>

        {/* Country columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {countries.map((country) => (
            <div key={country.name} className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{country.flag}</span>
                <h3 className="font-semibold text-base">{country.name}</h3>
              </div>
              <ul className="space-y-2">
                {country.numbers.map((n) => (
                  <li key={n.number} className={`flex items-center justify-between text-sm py-1.5 border-b border-white/8 last:border-0 ${n.highlight ? "text-yellow-300" : "text-white/70"}`}>
                    <span>{n.label}</span>
                    <a
                      href={`tel:${n.number.replace(/\s/g, "")}`}
                      className={`font-mono font-semibold no-underline hover:underline ${n.highlight ? "text-yellow-300" : "text-white"}`}
                    >
                      {n.number}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Quick tips */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8">
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/50">Quick Tips in an Emergency</h4>
          <ul className="space-y-2">
            {quickTips.map((tip) => (
              <li key={tip} className="flex items-start gap-2.5 text-sm text-white/65">
                <span className="text-brand mt-0.5 shrink-0">→</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Golden rule */}
        <div className="text-center">
          <p className="font-fraunces text-xl italic text-white/40">
            &ldquo;The golden rule: tell someone your route and expected return time before every mountain day.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}

/** Compact version for tour detail pages */
export function EmergencyContactsCompact() {
  return (
    <details className="border-2 border-divider rounded-xl overflow-hidden">
      <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-ink/3 transition-colors list-none">
        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" strokeWidth={1.5} />
        <span className="font-semibold text-sm">Emergency contacts on the trail</span>
        <span className="ml-auto font-mono text-xs text-ink/40">Expand</span>
      </summary>
      <div className="px-5 pb-5 border-t border-divider">
        <div className="py-4">
          <p className="text-sm text-ink/60 mb-3">
            <strong>📞 112</strong> — works everywhere in Albania, Kosovo and Montenegro. Call first.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {countries.map((c) => (
              <div key={c.name}>
                <p className="font-semibold mb-1">{c.flag} {c.name}</p>
                {c.numbers.filter((n) => n.highlight || n.label.includes("Mountain")).map((n) => (
                  <p key={n.number} className="text-ink/60">
                    {n.label}: <a href={`tel:${n.number.replace(/\s/g, "")}`} className="text-brand font-mono no-underline hover:underline">{n.number}</a>
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </details>
  );
}
