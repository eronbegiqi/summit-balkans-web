import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getBlogPosts } from "@/lib/db/queries/blog";

export const metadata: Metadata = {
  title: "Blog — Trail Notes from the Balkans",
  description: "Stories, guides, and trail reports from Summit Balkans guides and travellers.",
};

const CATEGORY_LABELS: Record<string, string> = {
  TRAVEL_TIPS: "Travel Tips",
  DESTINATION_GUIDE: "Destination Guide",
  EQUIPMENT: "Equipment",
  STORIES: "Stories",
  NEWS: "News",
};

export default async function BlogPage() {
  const posts = await getBlogPosts(true);

  return (
    <>
      <section className="bg-bone border-b-2 border-divider pt-[72px]">
        <div className="max-w-content mx-auto px-5 md:px-10 py-16">
          <SectionLabel>Trail Notes</SectionLabel>
          <h1
            className="font-fraunces font-bold tracking-tight leading-[1.05]"
            style={{ fontSize: "clamp(36px, 5vw, 60px)" }}
          >
            From the trail.
          </h1>
          <p className="text-xl text-ink/55 mt-4 max-w-[540px]">
            Reports, guides, and stories from our guides and the people who travel with us.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-content mx-auto px-5 md:px-10">
          {posts.length === 0 ? (
            <div className="border-2 border-divider rounded-card bg-white p-10 text-center max-w-xl mx-auto">
              <h3 className="font-fraunces text-2xl font-bold mb-3">Posts coming soon</h3>
              <p className="text-sm text-ink/55 mb-6">
                We&apos;re writing up trail reports, gear reviews, and destination guides. Follow us on
                Instagram for updates.
              </p>
              <a
                href="https://instagram.com/summitbalkans"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-2 border-divider text-ink px-5 py-2.5 rounded-lg text-sm font-medium no-underline hover:border-ink transition-colors"
              >
                Follow on Instagram
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="border-2 border-divider rounded-card bg-white overflow-hidden hover:border-terra hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  {post.featuredImageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.featuredImageUrl}
                      alt={post.title}
                      className="w-full h-[220px] object-cover block"
                      loading="lazy"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-divider text-terra tracking-[0.06em] uppercase">
                        {CATEGORY_LABELS[post.category] ?? post.category}
                      </span>
                      {post.publishedAt && (
                        <span className="font-mono text-[11px] text-ink/35">
                          {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                    <h2 className="font-fraunces text-xl font-bold tracking-tight mb-3 leading-[1.2]">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm leading-relaxed text-ink/60 mb-5">{post.excerpt}</p>
                    )}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-[13px] font-semibold text-terra group-hover:gap-2.5 transition-all no-underline"
                    >
                      Read more →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
