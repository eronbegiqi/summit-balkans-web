import { Home, UtensilsCrossed, BookOpen } from "lucide-react";

const pillars = [
  {
    icon: Home,
    title: "Architecture",
    desc: "Traditional stone towers (kullas) and wooden guesthouses mark the landscape. These centuries-old structures are still lived in — preserved not as monuments, but as homes.",
  },
  {
    icon: UtensilsCrossed,
    title: "Hospitality",
    desc: "Besa — the ancient Albanian code of honour — means every guest is sacred. Hosts welcome strangers with the same warmth as family. It is not hospitality as a service; it is hospitality as identity.",
  },
  {
    icon: BookOpen,
    title: "Cuisine",
    desc: "Home-cooked meals with locally sourced produce: aged cheese, fresh bread baked in embers, lamb raised in the valley. Every meal reflects centuries-old recipes, prepared by hand every morning.",
  },
];

export function CulturalSection() {
  return (
    <section id="culture" className="py-20 md:py-28 bg-white">
      <div className="max-w-content mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left — image + pull quote */}
          <div>
            <div className="relative rounded-card-hero overflow-hidden mb-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&q=85"
                alt="Stone kulla tower — traditional Albanian highland architecture"
                className="w-full h-[420px] object-cover"
              />
            </div>

            {/* Pull quote */}
            <blockquote className="border-l-4 border-terra pl-6">
              <p className="font-fraunces text-[1.5rem] leading-[1.4] font-medium text-ink/80 italic mb-3">
                &ldquo;Generations of families maintaining ancient lifestyles.&rdquo;
              </p>
              <cite className="font-mono text-[11px] text-ink/40 not-italic uppercase tracking-[0.12em]">
                From the trail guidebook
              </cite>
            </blockquote>
          </div>

          {/* Right — three pillars */}
          <div>
            <div className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-terra mb-4">
              Cultural Experience
            </div>
            <h2 className="font-fraunces text-[clamp(2rem,4vw,2.8rem)] font-bold tracking-tight mb-6 leading-tight">
              A living culture, not a museum
            </h2>
            <p className="text-ink/65 leading-[1.85] mb-10 text-[16px]">
              Beyond the mountains, this trail offers rare immersion in the traditions of
              highland Albania — one of Europe's oldest continuously maintained cultures.
              Villages along the route have welcomed travelers for centuries, and that
              tradition holds today.
            </p>

            <div className="space-y-8">
              {pillars.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-xl border-2 border-divider flex items-center justify-center flex-shrink-0 mt-0.5 bg-bone">
                    <Icon className="w-5 h-5 text-forest" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-fraunces text-lg font-bold mb-2">{title}</h3>
                    <p className="text-[14px] leading-[1.75] text-ink/60">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
