import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function CTABand() {
  return (
    <section className="bg-dark py-24 text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.12]">
        <Image
          src="/images/CTA bg image.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          aria-hidden="true"
          priority={false}
        />
      </div>

      <div className="relative z-10 max-w-content mx-auto px-10">
        <h2
          className="font-fraunces font-bold text-white tracking-tight leading-[1.1] max-w-[720px] mx-auto mb-4"
          style={{ fontSize: "clamp(32px, 4vw, 56px)", fontVariationSettings: "'opsz' 48" }}
        >
          Tell us your dates and your level — we&apos;ll design the route.
        </h2>
        <p className="text-[17px] text-white/55 mb-10">
          Private trips from 2 people. Response within 24 hours.
        </p>

        <div className="flex gap-3.5 justify-center flex-wrap">
          <Link
            href="/private-trips"
            className="bg-brand text-white px-7 py-4 rounded-xl font-semibold text-[15px] no-underline hover:opacity-90 transition-opacity"
          >
            Request a Private Trip
          </Link>
          <a
            href="https://wa.me/38348300155"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white border-2 border-white/35 px-7 py-4 rounded-xl font-medium text-[15px] no-underline hover:border-white/65 hover:bg-white/6 transition-[border-color,background-color]"
          >
            <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
            Message on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
