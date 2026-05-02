import { readFileSync } from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { mdxComponents } from "@/components/legal/mdxComponents";
import { extractHeadings, formatLegalDate } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy | Summit Balkans",
  description:
    "Learn how Summit Balkans collects, uses, and protects your personal data. GDPR-compliant privacy policy for our guided hiking tours.",
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  const filePath = path.join(process.cwd(), "content/legal/privacy-policy.md");
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
