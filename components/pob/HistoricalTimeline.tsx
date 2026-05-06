"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const eras = [
  {
    period: "Pre-2000s",
    title: "Isolation & Tradition",
    desc: "For decades, the mountainous border regions between Kosovo, Albania, and Montenegro remained isolated. Political tensions and strict border controls limited movement, even for local communities sharing language, traditions, and family ties. The isolation preserved one of Europe's most untouched natural environments.",
    details: ["Semi-nomadic shepherding", "Traditional agriculture", "Strong community hospitality"],
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  },
  {
    period: "2009–2012",
    title: "Development Phase",
    desc: "The trail emerged from a sustainable tourism initiative by Deutsche Gesellschaft für Internationale Zusammenarbeit (GIZ), aiming to promote peace, support rural development, and empower local communities across three countries.",
    details: ["Ancient shepherd trails mapped & connected", "Standardized trail markings installed", "Residents trained as guides", "Cross-border permit system established"],
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
  },
  {
    period: "2012",
    title: "Official Launch",
    desc: "The trail officially opened, becoming one of the first hiking routes in Europe to allow multi-country trekking through remote border regions. It quickly gained attention for its authenticity, cultural depth, and untouched landscapes.",
    details: ["First cross-border hiking route", "International media coverage", "UNESCO recognition pathway"],
    image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80",
  },
  {
    period: "2013–Present",
    title: "Growth & Recognition",
    desc: "The Peaks of the Balkans has become a top destination for adventure travelers and a benchmark for cross-border cooperation through sustainable tourism, with ongoing expansions in guiding, infrastructure, and international visibility.",
    details: ["Professional guiding services", "Improved trail marking & apps", "Expanded guesthouse network", "International adventure travel awards"],
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
  },
];

export function HistoricalTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !pinRef.current || !trackRef.current) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const totalScroll = trackRef.current!.scrollWidth - window.innerWidth + 80;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${totalScroll}`,
          pin: pinRef.current,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      tl.to(trackRef.current, { x: -totalScroll, ease: "none" });

      return () => tl.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="history"
      ref={sectionRef}
      className="bg-ink overflow-hidden"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30Z' fill='none' stroke='%23ffffff' stroke-width='0.3' opacity='0.04'/%3E%3C/svg%3E\")",
      }}
    >
      <div ref={pinRef} className="py-20 md:py-28">
        <div className="max-w-content mx-auto px-5 md:px-10 mb-12">
          <div className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-terra mb-3">
            The Story
          </div>
          <h2 className="font-fraunces text-[clamp(2rem,4vw,2.8rem)] font-bold tracking-tight text-white">
            How the trail was born
          </h2>
        </div>

        {/* Horizontal scroll track */}
        <div ref={trackRef} className="flex gap-6 px-5 md:px-10 pb-8 md:will-change-transform">
          {eras.map((era, i) => (
            <div
              key={era.period}
              className="flex-shrink-0 w-[calc(100vw-40px)] md:w-[520px] bg-white/[0.05] border border-white/10 rounded-card-hero overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={era.image}
                  alt={era.title}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
                    {String(i + 1).padStart(2, "0")} / {String(eras.length).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="font-mono text-[11px] font-semibold tracking-[0.14em] uppercase text-terra mb-2">
                  {era.period}
                </div>
                <h3 className="font-fraunces text-2xl font-bold text-white mb-3 tracking-tight">
                  {era.title}
                </h3>
                <p className="text-white/55 text-[14px] leading-[1.75] mb-5">{era.desc}</p>
                <ul className="space-y-2">
                  {era.details.map((d) => (
                    <li key={d} className="flex items-start gap-2.5 text-[13px] text-white/45">
                      <span className="text-terra mt-0.5 flex-shrink-0">—</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          {/* End spacer */}
          <div className="flex-shrink-0 w-10 md:w-20" />
        </div>

        {/* Scroll hint — desktop only */}
        <div className="hidden md:flex items-center gap-2 px-10 mt-2">
          <div className="w-12 h-px bg-white/20" />
          <span className="font-mono text-[10px] text-white/25 uppercase tracking-widest">
            Scroll to explore
          </span>
        </div>
      </div>
    </section>
  );
}
