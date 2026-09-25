import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";

// /tours/page.tsx is a client component and can't export metadata itself.
// Child routes ([slug], book) set their own title/canonical and override this.
export const metadata: Metadata = {
  title: "Guided & Self-Guided Hiking Tours",
  description:
    "Compare every Summit Balkans trek — guided and self-guided Peaks of the Balkans routes. Pick your dates and book online.",
  ...pageSeo("/tours"),
};

export default function ToursLayout({ children }: { children: React.ReactNode }) {
  return children;
}
