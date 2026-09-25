import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

// Root-level not-found renders outside the (public) layout, so it brings its own chrome.
export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content" className="bg-bone min-h-[70vh] grid place-items-center px-6 pt-[140px] pb-24 text-center">
        <div>
          <p className="font-mono text-sm text-ink/50">404</p>
          <h1 className="font-fraunces font-bold text-4xl text-ink tracking-tight mt-2">This trail doesn’t exist</h1>
          <p className="text-[17px] text-ink/70 mt-4">The page may have moved. Head back to base camp.</p>
          <div className="mt-10 flex gap-3.5 justify-center flex-wrap">
            <Link
              href="/"
              className="bg-brand text-white px-7 py-4 rounded-xl font-semibold text-[15px] no-underline hover:opacity-90 transition-opacity"
            >
              Back to home
            </Link>
            <Link
              href="/tours"
              className="text-ink border-2 border-ink/20 px-7 py-4 rounded-xl font-medium text-[15px] no-underline hover:border-ink/50 transition-colors"
            >
              Browse tours
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
