import { readFileSync } from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { mdxComponents } from "@/components/legal/mdxComponents";
import { extractHeadings, formatLegalDate } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Booking Terms & Conditions | Summit Balkans",
  description:
    "Read our booking terms and conditions for Summit Balkans tours in Albania, Montenegro, and Kosovo. Includes payment, cancellation, and liability policies.",
  robots: { index: true, follow: true },
};

export default function BookingTermsPage() {
  const filePath = path.join(process.cwd(), "content/legal/booking-terms.md");
  const raw = readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const headings = extractHeadings(content);
  const lastUpdated = formatLegalDate(data.lastUpdated as string);

  return (
    <LegalPageLayout
      title={data.title as string}
      lastUpdated={lastUpdated}
      headings={headings}
    >
      <MDXRemote source={content} components={mdxComponents} />
    </LegalPageLayout>
  );
}
