import type { Metadata } from "next";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CTABand } from "@/components/sections/CTABand";

export const metadata: Metadata = {
  title: "About Us — Summit Balkans",
  description: "A small team of local guides, born and raised in the mountains we take you through.",
};

const guides = [
  { name: "Artan Krasniqi", role: "Lead Guide & Co-founder", country: "Kosovo 🇽🇰", langs: ["Albanian", "English", "Serbian"], certs: ["UIAA", "WFR"], bio: "Born in Peja, 20 years guiding the Peaks of the Balkans trail before it had a name.", initial: "A", bg: "#3B4A2E" },
  { name: "Blerim Hoxha", role: "Senior Mountain Guide", country: "Kosovo 🇽🇰", langs: ["Albanian", "English", "German"], certs: ["UIAA", "Via Ferrata"], bio: "Rugova Canyon specialist. If there's a route through it, Blerim found it first.", initial: "B", bg: "#5C4D8A" },
  { name: "Liridon Gashi", role: "Alpine Guide", country: "Albania 🇦🇱", langs: ["Albanian", "English", "Italian"], certs: ["WFR", "Wilderness First Aid"], bio: "Grew up in Theth. Led the first commercially guided Peaks circuit in 2016.", initial: "L", bg: "#7A3B2E" },
  { name: "Dragan Marković", role: "Montenegro Guide", country: "Montenegro 🇲🇪", langs: ["Serbian", "English", "Bosnian"], certs: ["UIAA", "Durmitor Specialist"], bio: "Durmitor is home territory. Dragan has summited Bobotov Kuk over 200 times.", initial: "D", bg: "#2E5C7A" },
];

const values = [
  { title: "Local First", text: "Every guide is from the region. Every guesthouse is family-owned. Every euro spent stays in the communities we walk through." },
  { title: "Small Groups Only", text: "Maximum 12 travellers. We chose this limit deliberately — it's the right size for real group dynamics and real guesthouse experiences." },
  { title: "Leave No Trace", text: "We follow LNT principles strictly and educate every group. These mountains are wild because they haven't been loved to death yet." },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[65vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=85')" }} />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-content mx-auto px-10 pt-[72px] w-full">
          <h1
            className="font-fraunces font-bold text-white tracking-tight leading-[1.0] max-w-[700px] mb-6"
            style={{ fontSize: "clamp(48px, 6vw, 88px)", fontVariationSettings: "'opsz' 72" }}
          >
            We are Summit Balkans.
          </h1>
          <p className="text-xl text-white/65 max-w-[560px]">
            A small team of local guides, born and raised in the mountains we take you through.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24">
        <div className="max-w-content mx-auto px-10">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-16 items-start">
            <div>
              <SectionLabel>Our Story</SectionLabel>
              <h2 className="font-fraunces text-4xl font-bold tracking-tight mb-8">Founded in the mountains</h2>
              <div className="space-y-5 text-base leading-[1.8] text-ink/70">
                <p className="drop-cap">Summit Balkans started in 2018 when two cousins from Peja, Kosovo, kept running into foreign hikers who were lost, underprepared, or simply missing everything that makes the Balkans extraordinary. They decided to fix that.</p>
                <p>What began as informal guiding for friends of friends became a small company with a clear philosophy: keep groups small, hire only local guides who grew up on these trails, and charge a fair price that covers everything.</p>
                <p>We now run the Peaks of the Balkans, Rugova Via Ferrata, Durmitor Ring, and a growing number of private expeditions across the region. Every trip is still guided by someone who calls these mountains home.</p>
              </div>

              <div className="grid grid-cols-5 gap-0 mt-12 border-t-2 border-divider pt-8">
                {[["2018", "Founded"], ["200+", "Travellers"], ["60+", "Routes"], ["4.9", "Rating"], ["3", "Countries"]].map(([num, label]) => (
                  <div key={label} className="text-center border-r border-divider last:border-0 px-4">
                    <div className="font-fraunces text-3xl font-bold mb-1">{num}</div>
                    <div className="font-mono text-[11px] text-ink/40 tracking-[0.08em] uppercase">{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-card-hero overflow-hidden border-2 border-divider">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=85" alt="Guides on a trail" className="w-full h-full object-cover block" />
            </div>
          </div>
        </div>
      </section>

      {/* The Team */}
      <section className="py-24 border-t-2 border-divider">
        <div className="max-w-content mx-auto px-10">
          <SectionLabel>The Team</SectionLabel>
          <h2 className="font-fraunces text-4xl font-bold tracking-tight mb-12">Our guides</h2>
          <div className="grid md:grid-cols-4 grid-cols-1 gap-5">
            {guides.map((g) => (
              <div key={g.name} className="border-2 border-divider rounded-card bg-white p-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center font-fraunces text-2xl font-bold text-white mb-4"
                  style={{ background: g.bg }}
                >
                  {g.initial}
                </div>
                <div className="font-mono text-[10px] text-terra mb-1 tracking-[0.06em]">{g.country}</div>
                <h3 className="font-fraunces text-lg font-bold mb-0.5">{g.name}</h3>
                <div className="text-xs text-ink/45 mb-3">{g.role}</div>
                <div className="flex gap-1.5 flex-wrap mb-3">
                  {g.langs.map((l) => (
                    <span key={l} className="text-[10px] px-2 py-0.5 rounded border border-divider text-ink/50 font-mono">{l}</span>
                  ))}
                </div>
                <div className="flex gap-1.5 flex-wrap mb-4">
                  {g.certs.map((c) => (
                    <span key={c} className="text-[10px] px-2 py-0.5 rounded bg-forest/10 text-forest font-mono font-medium">{c}</span>
                  ))}
                </div>
                <p className="text-[13px] leading-[1.6] text-ink/55 italic">&ldquo;{g.bio}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-dark relative overflow-hidden border-t-2 border-divider">
        <div className="max-w-content mx-auto px-10 relative z-10">
          <SectionLabel light>What We Stand For</SectionLabel>
          <h2 className="font-fraunces text-4xl font-bold text-white tracking-tight mb-12">Our values</h2>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-12">
            {values.map((v) => (
              <div key={v.title}>
                <h3 className="font-fraunces text-2xl font-bold text-white mb-3">{v.title}</h3>
                <p className="text-[15px] leading-[1.65] text-white/55">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
