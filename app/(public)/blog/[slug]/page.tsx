import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPostBySlug } from "@/lib/db/queries/blog";
import { ArrowLeft, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, string> = {
  TRAVEL_TIPS: "Travel Tips",
  DESTINATION_GUIDE: "Destination Guide",
  EQUIPMENT: "Equipment",
  STORIES: "Stories",
  NEWS: "News",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.seoTitle ?? `${post.title} — Summit Balkans`,
    description: post.seoDescription ?? post.excerpt ?? undefined,
    openGraph: post.featuredImageUrl
      ? { images: [post.featuredImageUrl] }
      : undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="pt-[72px]">
      {/* Hero */}
      {post.featuredImageUrl && (
        <div className="relative h-[40vh] min-h-[280px] max-h-[500px] overflow-hidden bg-ink">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.featuredImageUrl}
            alt={post.title}
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
        </div>
      )}

      {/* Header */}
      <div className="bg-bone border-b-2 border-divider">
        <div className="max-w-[760px] mx-auto px-5 md:px-10 py-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-ink/45 hover:text-ink no-underline mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            Back to Blog
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-divider text-terra tracking-[0.06em] uppercase">
              {CATEGORY_LABELS[post.category] ?? post.category}
            </span>
            {post.readingTimeMinutes && (
              <span className="flex items-center gap-1 font-mono text-[11px] text-ink/35">
                <Clock className="w-3 h-3" strokeWidth={1.5} />
                {post.readingTimeMinutes} min read
              </span>
            )}
            {post.publishedAt && (
              <span className="font-mono text-[11px] text-ink/35">
                {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            )}
          </div>

          <h1 className="font-fraunces text-[clamp(2rem,5vw,3.2rem)] font-bold tracking-tight leading-[1.1] mb-4">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg text-ink/60 leading-relaxed">{post.excerpt}</p>
          )}

          {post.author && (
            <div className="mt-6 flex items-center gap-3 pt-6 border-t border-divider">
              <div className="w-9 h-9 rounded-full bg-terra/15 flex items-center justify-center text-sm font-semibold text-terra">
                {post.author.name.charAt(0)}
              </div>
              <span className="text-sm text-ink/60">By {post.author.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {post.content ? (
        <div className="max-w-[760px] mx-auto px-5 md:px-10 py-12">
          <div
            className="prose prose-md max-w-none prose-headings:font-fraunces prose-headings:tracking-tight prose-a:text-terra prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      ) : (
        <div className="max-w-[760px] mx-auto px-5 md:px-10 py-12 text-ink/40 text-sm">
          Content not yet available.
        </div>
      )}

      {/* Footer nav */}
      <div className="border-t-2 border-divider py-12">
        <div className="max-w-[760px] mx-auto px-5 md:px-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 border-2 border-divider text-ink px-5 py-2.5 rounded-lg text-sm font-medium no-underline hover:border-ink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            All posts
          </Link>
        </div>
      </div>
    </article>
  );
}
