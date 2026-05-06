import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "Before You Visit",
  description:
    "Everything you need to know before hiking in Albania, Montenegro & Kosovo — fitness, visas, what to pack, best seasons.",
};

const difficultyLevels = [
  { level: 1, name: "Easy", dots: 1, desc: "Gentle trails with minimal elevation. Suitable for all fitness levels.", example: "Day hike in Theth valley", suits: "First-time hikers, families" },
  { level: 2, name: "Moderate", dots: 2, desc: "Some elevation, longer distances. Regular exercise recommended.", example: "Rugova Canyon day hike", suits: "Active walkers" },
  { level: 3, name: "Moderate+", dots: 3, desc: "Sustained ascents, 12–18km/day. Regular hiking experience preferred.", example: "Durmitor Ring (5 days)", suits: "Fit hikers, regular outdoors" },
  { level: 4, name: "Challenging", dots: 4, desc: "18–24km/day, significant elevation gain on consecutive days.", example: "Peaks of the Balkans (10 days)", suits: "Experienced multi-day hikers" },
  { level: 5, name: "Expert", dots: 5, desc: "Technical terrain, altitude exposure, long demanding days.", example: "Off-trail expeditions", suits: "Seasoned mountaineers" },
];

const packCategories = [
  {
    title: "Clothing",
    items: ["Moisture-wicking base layer", "Warm mid-layer (fleece or down)", "Waterproof rain jacket", "Quick-dry hiking trousers", "Warm hat & gloves", "Sun hat"],
  },
  {
    title: "Footwear",
    items: ["Broken-in hiking boots (ankle support)", "Camp sandals", "Merino wool socks (multiple pairs)", "Gaiters (for early season)"],
  },
  {
    title: "Navigation & Safety",
    items: ["Headlamp + spare batteries", "Personal first aid kit", "Water filter / purification tabs", "Emergency whistle", "Phone with offline maps (Maps.me)"],
  },
  {
    title: "Camp Essentials",
    items: ["Sleeping bag liner", "Trekking poles", "Dry bags for kit", "Blister kit", "Sunscreen SPF 50+", "Insect repellent"],
  },
  {
    title: "Documents & Money",
    items: ["Passport (valid 6+ months)", "Travel insurance documents", "Euros in cash (€200–400)", "Emergency contact card", "Vaccination records (if relevant)"],
  },
];

const seasonal = {
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  countries: [
    { name: "Albania (Alps)", data: ["off", "off", "off", "good", "peak", "peak", "peak", "peak", "peak", "good", "off", "off"] },
    { name: "Montenegro (Durmitor)", data: ["off", "off", "off", "off", "good", "peak", "peak", "peak", "peak", "good", "off", "off"] },
    { name: "Kosovo (Rugova)", data: ["off", "off", "off", "good", "peak", "peak", "peak", "peak", "peak", "good", "off", "off"] },
  ],
};

const seasonColors: Record<string, string> = {
  peak: "bg-forest text-white",
  good: "bg-gold/70 text-ink",
  off: "bg-divider/60 text-ink/30",
};
const seasonLabels: Record<string, string> = { peak: "Peak", good: "Good", off: "Off" };

const visaInfo = [
  {
    group: "EU / Schengen",
    content: "No visa required for Albania, Montenegro, or Kosovo. Passport required (ID card accepted for Kosovo from some EU states).",
  },
  {
    group: "UK",
    content: "No visa required for any of the three countries. You can stay up to 90 days in each. No border issues crossing on the Peaks trail.",
  },
  {
    group: "US & Canada",
    content: "No visa required. Albania and Kosovo allow stays of 90 days. Montenegro allows 90 days within 180-day period.",
  },
  {
    group: "Australia & New Zealand",
    content: "No visa required for Albania (90 days), Montenegro (90 days) and Kosovo (90 days). Summit Balkans handles all border paperwork for the group.",
  },
];

const faqs = [
  { q: "Can I travel solo?", a: "Yes — around 40% of our group tour participants join solo. Small groups (max 12) mean you're never isolated, and most solo travellers leave with friends for life." },
  { q: "What's the group size?", a: "Our scheduled group tours have a maximum of 12 travellers. Private trips can be from 2 to 12." },
  { q: "How do payments work?", a: "A 25% deposit secures your spot. The remaining 75% is due 60 days before departure. We accept bank transfer and card payments." },
  { q: "What's the cancellation policy?", a: "60+ days before: full refund minus €75 admin fee. 30–60 days: 50% refund. Under 30 days: no refund. Travel insurance with cancellation cover is mandatory." },
  { q: "Can you accommodate dietary needs?", a: "Vegetarian is well supported — Balkan guesthouse food is naturally plant-forward. Vegan and gluten-free diets are harder to guarantee in remote areas; contact us to discuss." },
  { q: "Are children welcome?", a: "Yes on appropriate trips. Difficulty 1–2 routes are very family-friendly. We don't recommend the Peaks of the Balkans (difficulty 4) for under-14s." },
  { q: "Photography / drones?", a: "Photography is welcome everywhere. Drone use requires permits in national parks — we can advise but recommend leaving drones at home on the Peaks trail." },
  { q: "What about tipping?", a: "Tips are not expected but are deeply appreciated by guides and guesthouse families. €10–20/day for the guide and €5–10/day for accommodation hosts is typical." },
];

export default function BeforeYouVisitPage() {
  return (
    <>
      {/* Hero — light */}
      <section className="bg-bone border-b-2 border-divider pt-[72px]">
        <div className="max-w-content mx-auto px-10 py-16">
          <div className="grid grid-cols-[1fr_320px] gap-16 items-start">
            <div>
              <SectionLabel>Pre-Trip Guide</SectionLabel>
              <h1
                className="font-fraunces font-bold tracking-tight leading-[1.05] max-w-[660px]"
                style={{ fontSize: "clamp(36px, 5vw, 60px)" }}
              >
                Everything you need to know before you go.
              </h1>
            </div>
            {/* Jump links */}
            <nav className="border-2 border-divider rounded-card bg-white p-6 self-start">
              <div className="font-mono text-[11px] text-ink/40 tracking-[0.1em] uppercase mb-4">On this page</div>
              {[
                ["#difficulty", "01 Fitness & Difficulty"],
                ["#pack", "02 What to Pack"],
                ["#seasons", "03 Best Time to Visit"],
                ["#visas", "04 Visas & Entry"],
                ["#health", "05 Health & Safety"],
                ["#faq", "06 FAQ"],
              ].map(([href, label]) => (
                <a key={href} href={href} className="flex items-center justify-between py-2 border-b border-divider last:border-0 text-sm text-ink/55 no-underline hover:text-ink transition-colors group">
                  {label}
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                </a>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* Difficulty Guide */}
      <section id="difficulty" className="py-24 border-b-2 border-divider">
        <div className="max-w-content mx-auto px-10">
          <SectionLabel>Fitness Guide</SectionLabel>
          <h2 className="font-fraunces text-4xl font-bold tracking-tight mb-12">Our 5-level difficulty scale</h2>
          <div className="flex flex-col gap-4">
            {difficultyLevels.map((d) => (
              <div key={d.level} className="border-2 border-divider rounded-card bg-white p-6 flex items-start gap-8">
                <div
                  className="w-1.5 self-stretch rounded-full flex-shrink-0"
                  style={{ background: `hsl(${100 - d.level * 18}, 55%, ${50 - d.level * 3}%)` }}
                />
                <div className="flex gap-1 flex-shrink-0 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`w-2.5 h-2.5 rounded-full ${i < d.level ? "bg-forest" : "bg-divider"}`} />
                  ))}
                </div>
                <div className="flex-1">
                  <div className="font-fraunces text-xl font-bold mb-1">{d.name}</div>
                  <p className="text-sm text-ink/65 mb-3">{d.desc}</p>
                  <div className="flex gap-6 text-xs text-ink/45 font-mono">
                    <span>Example: {d.example}</span>
                    <span>Suits: {d.suits}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pack list */}
      <section id="pack" className="py-24 border-b-2 border-divider">
        <div className="max-w-content mx-auto px-10">
          <SectionLabel>Pack List</SectionLabel>
          <h2 className="font-fraunces text-4xl font-bold tracking-tight mb-4">What to pack</h2>
          <p className="text-base text-ink/55 max-w-[520px] mb-12">
            A general pack list for Balkans hiking. Your pre-trip info will include a tour-specific version.
          </p>
          <div className="grid grid-cols-[repeat(3,1fr)] gap-6">
            {packCategories.map((cat) => (
              <div key={cat.title} className="bg-white border-2 border-divider rounded-card p-6">
                <h3 className="font-fraunces text-lg font-bold mb-4">{cat.title}</h3>
                <ul className="list-none flex flex-col gap-2">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-ink/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-forest flex-shrink-0 mt-1.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="bg-terra/8 border-2 border-terra/25 rounded-card p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-fraunces text-lg font-bold mb-2">Missing something?</h3>
                <p className="text-sm text-ink/65">Rent quality kit directly from us in Prishtina. Poles, sleeping bags, rain shells and more.</p>
              </div>
              <Link href="/gear" className="mt-6 inline-flex items-center gap-1.5 text-terra font-semibold text-sm no-underline hover:gap-2.5 transition-all">
                Browse gear rental <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Best time to visit */}
      <section id="seasons" className="py-24 border-b-2 border-divider">
        <div className="max-w-content mx-auto px-10">
          <SectionLabel>When to Go</SectionLabel>
          <h2 className="font-fraunces text-4xl font-bold tracking-tight mb-12">Best time to visit</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="text-left font-mono text-[11px] text-ink/40 tracking-[0.08em] uppercase pb-3 pr-6">Country / Route</th>
                  {seasonal.months.map((m) => (
                    <th key={m} className="font-mono text-[11px] text-ink/40 tracking-[0.06em] uppercase pb-3 px-1 text-center">{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {seasonal.countries.map((row) => (
                  <tr key={row.name}>
                    <td className="text-sm font-medium pr-6 py-2 whitespace-nowrap">{row.name}</td>
                    {row.data.map((status, i) => (
                      <td key={i} className="px-0.5 py-2">
                        <div className={`rounded-md px-1 py-1.5 text-center font-mono text-[9px] font-medium ${seasonColors[status]}`}>
                          {seasonLabels[status]}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-6 mt-4">
            {Object.entries(seasonLabels).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2 text-xs">
                <span className={`w-3 h-3 rounded ${seasonColors[key]}`} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visas */}
      <section id="visas" className="py-24 border-b-2 border-divider">
        <div className="max-w-content mx-auto px-10">
          <SectionLabel>Entry Requirements</SectionLabel>
          <h2 className="font-fraunces text-4xl font-bold tracking-tight mb-4">Visas &amp; entry</h2>
          <p className="text-base text-ink/55 max-w-[520px] mb-12">Most nationalities require no visa. We handle all border crossing admin for group tours.</p>
          <div className="flex flex-col gap-0">
            {visaInfo.map((item, i) => (
              <div key={item.group} className={`border-2 border-divider rounded-card bg-white p-6 ${i > 0 ? "-mt-0.5" : ""}`}>
                <div className="font-fraunces text-lg font-bold mb-2">{item.group}</div>
                <p className="text-sm text-ink/65 leading-relaxed">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Health & Safety */}
      <section id="health" className="py-24 border-b-2 border-divider">
        <div className="max-w-content mx-auto px-10">
          <SectionLabel>Safety</SectionLabel>
          <h2 className="font-fraunces text-4xl font-bold tracking-tight mb-12">Health &amp; safety</h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              { title: "Travel Insurance", body: "Mandatory for all Summit Balkans tours. Must include medical evacuation and trip cancellation. We recommend World Nomads or SafetyWing for hikers." },
              { title: "Emergency Contacts", body: "Albania: 127 · Montenegro: 112 · Kosovo: 192. Your guide carries a satellite communicator on all multi-day tours." },
              { title: "Altitude & Weather", body: "Passes on the Peaks trail reach 1,800m. Afternoon storms are common in summer. Your guide monitors forecasts daily and adjusts the route if needed." },
            ].map((card) => (
              <div key={card.title} className="border-2 border-divider rounded-card bg-white p-7">
                <h3 className="font-fraunces text-xl font-bold mb-3">{card.title}</h3>
                <p className="text-sm leading-relaxed text-ink/65">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gear rental banner */}
      <div className="border-b-2 border-divider bg-dark py-6">
        <div className="max-w-content mx-auto px-10 flex items-center justify-between gap-8">
          <div>
            <span className="font-fraunces text-xl font-bold text-white mr-3">Missing something?</span>
            <span className="text-white/55 text-sm">Rent quality kit directly from us in Prishtina.</span>
          </div>
          <Link href="/gear" className="inline-flex items-center gap-2 bg-terra text-white px-5 py-2.5 rounded-lg font-semibold text-sm no-underline hover:opacity-90 flex-shrink-0">
            Browse Gear <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="max-w-content mx-auto px-10">
          <SectionLabel>Common Questions</SectionLabel>
          <h2 className="font-fraunces text-4xl font-bold tracking-tight mb-12">FAQ</h2>
          <div className="grid grid-cols-2 gap-x-16 gap-y-0">
            {faqs.map((item, i) => (
              <div key={i} className="border-b-2 border-divider py-6">
                <h3 className="font-fraunces text-lg font-bold mb-2">{item.q}</h3>
                <p className="text-sm leading-relaxed text-ink/65">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
