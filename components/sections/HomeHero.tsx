import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export function HomeHero() {
  return (
    <section
      className="relative h-screen min-h-[680px] flex items-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=85"
          alt="Mountain trail in the Balkans"
          fill
          sizes="100vw"
          className="object-cover"
          quality={70}
          priority
          fetchPriority="high"
        />
      </div>

      {/* Overlay - Changed to 20% black */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 max-w-content mx-auto px-10 pt-[72px] w-full">
        <div className="font-mono text-xs font-medium text-gold tracking-[0.12em] uppercase mb-6 flex items-center gap-2">
          <span className="block w-6 h-px bg-gold" />
          Albania · Montenegro · Kosovo
        </div>

        <h1
          className="font-fraunces font-bold text-white leading-[1.0] tracking-[-0.03em] mb-6 max-w-[820px]"
          style={{ fontSize: "clamp(52px, 7vw, 96px)", fontVariationSettings: "'opsz' 72" }}
        >
          Your journey to the heart of the Balkans.
        </h1>

        <p className="text-xl text-white/80 mb-10 tracking-[0.01em]">
          Small groups. Local guides. Real trails.
        </p>

        <div className="flex gap-3.5 flex-wrap mb-10">
          <Link
            href="/tours"
            className="flex items-center gap-2 bg-brand text-white px-7 py-4 rounded-xl font-semibold text-[15px] no-underline hover:opacity-90 hover:-translate-y-0.5 transition-[opacity,transform]"
          >
            View Upcoming Tours
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
          <Link
            href="/private-trips"
            className="flex items-center gap-2 text-white border-2 border-white/45 px-7 py-4 rounded-xl font-medium text-[15px] no-underline hover:border-white/75 hover:bg-white/6 transition-[border-color,background-color]"
          >
            Plan a Private Trip
          </Link>
        </div>

        {/* Trust line */}
        <div className="flex items-center gap-5 text-[13px] text-white/65 flex-wrap">
          <span className="text-gold text-sm tracking-[1px]">★★★★★ 5.0 ·</span>
          <span className="w-[3px] h-[3px] rounded-full bg-white/35" />
          <span>Local Guides</span>
          <span className="w-[3px] h-[3px] rounded-full bg-white/35" />
          <span>Small Groups</span>
          <a
            href="https://wa.me/38348300155"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-white/55 hover:text-white transition-colors no-underline ml-2"
          >
            <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
