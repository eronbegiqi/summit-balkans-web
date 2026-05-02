import React from "react";
import Link from "next/link";
import { LegalTOC } from "./LegalTOC";
import { PrintButton } from "./PrintButton";
import { CONTACT } from "@/lib/constants";

interface Props {
  title: string;
  lastUpdated: string;
  headings: { id: string; label: string }[];
  children: React.ReactNode;
}

export function LegalPageLayout({ title, lastUpdated, headings, children }: Props) {
  return (
    <div className="bg-bone min-h-screen legal-page">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-16 md:py-24">
        {/* Hero */}
        <div className="mb-10">
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-brand mb-3">
            Legal
          </div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <h1 className="font-fraunces text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]">
              {title}
            </h1>
            <PrintButton />
          </div>
          <p className="text-sm text-ink/40 font-mono mt-3">Last updated: {lastUpdated}</p>
          <hr className="border-mist mt-8" />
        </div>

        {/* Two-column: prose + TOC */}
        <div className="xl:grid xl:grid-cols-[1fr_220px] xl:gap-16 items-start">
          <article className="prose prose-lg max-w-none">
            {children}
          </article>
          <LegalTOC headings={headings} />
        </div>

        {/* Footer contact */}
        <div className="mt-16 pt-8 border-t border-mist">
          <p className="text-sm text-ink/50">
            Have questions?{" "}
            <Link
              href={CONTACT.emailLink}
              className="text-brand underline underline-offset-2 hover:text-brand-700 transition-colors"
            >
              {CONTACT.email}
            </Link>
            {" "}or{" "}
            <Link
              href={CONTACT.phoneLink}
              className="text-brand underline underline-offset-2 hover:text-brand-700 transition-colors"
            >
              {CONTACT.phone}
            </Link>
          </p>
          <div className="flex items-center gap-2 mt-3">
            <Link href="/legal/booking-terms" className="text-xs text-ink/35 hover:text-ink font-mono transition-colors no-underline">
              Booking Terms
            </Link>
            <span className="text-ink/20 font-mono">·</span>
            <Link href="/legal/privacy-policy" className="text-xs text-ink/35 hover:text-ink font-mono transition-colors no-underline">
              Privacy Policy
            </Link>
            <span className="text-ink/20 font-mono">·</span>
            <Link href="/legal/cookie-policy" className="text-xs text-ink/35 hover:text-ink font-mono transition-colors no-underline">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
