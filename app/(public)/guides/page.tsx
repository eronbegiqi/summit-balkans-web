import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "Our Guides",
  description: "Meet the Summit Balkans guides — local experts born in the mountains they lead.",
};

export default function GuidesPage() {
  return (
    <>
      <section className="bg-bone border-b-2 border-divider pt-[72px]">
        <div className="max-w-content mx-auto px-10 py-16">
          <SectionLabel>The Team</SectionLabel>
          <h1
            className="font-fraunces font-bold tracking-tight leading-[1.05]"
            style={{ fontSize: "clamp(36px, 5vw, 60px)" }}
          >
            Local guides. Born here.
          </h1>
          <p className="text-xl text-ink/55 mt-4 max-w-[560px]">
            Every Summit Balkans guide grew up within a day&apos;s walk of the routes they lead. This page is coming soon with full profiles.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-content mx-auto px-10">
          <div className="border-2 border-divider rounded-card-hero bg-white p-16 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-forest" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h2 className="font-fraunces text-3xl font-bold tracking-tight mb-4">Guide profiles coming soon</h2>
            <p className="text-ink/55 mb-8 leading-relaxed">
              We&apos;re putting together full profiles for each of our guides — certifications, languages, home regions, and the stories behind why they guide. Check back soon.
            </p>
            <p className="text-sm text-ink/40 mb-8">In the meantime, you can read about our team on the About page.</p>
            <Link href="/about" className="inline-flex items-center gap-2 bg-terra text-white px-6 py-3.5 rounded-xl font-semibold no-underline hover:opacity-90">
              Meet the team on About
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
