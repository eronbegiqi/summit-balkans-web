import type { Metadata } from "next";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "Blog — Trail Notes from the Balkans",
  description: "Stories, guides, and trail reports from Summit Balkans guides and travellers.",
};

const placeholderPosts = [
  {
    slug: "peaks-of-the-balkans-2025-season",
    title: "Peaks of the Balkans: What We Learned from the 2025 Season",
    date: "2025-10-12",
    category: "Trail Report",
    excerpt: "Eight departures, 96 travellers, one broken bone (not our fault), and countless guesthouse breakfasts. Here's what stood out this year.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  },
  {
    slug: "rugova-via-ferrata-beginners-guide",
    title: "Rugova Via Ferrata: A Beginner's Complete Guide",
    date: "2025-07-22",
    category: "Trail Guide",
    excerpt: "What to expect, what fitness level you need, and why most people find it easier than they feared — and harder than they expected.",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
  },
  {
    slug: "best-guesthouses-theth-valbona",
    title: "The Best Guesthouses in Theth & Valbona",
    date: "2025-06-05",
    category: "Accommodation",
    excerpt: "We've stayed in all of them — many times. Here's an honest breakdown of where to sleep on the Albania section of the Peaks trail.",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
  },
];

export default function BlogPage() {
  return (
    <>
      <section className="bg-bone border-b-2 border-divider pt-[72px]">
        <div className="max-w-content mx-auto px-10 py-16">
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
        <div className="max-w-content mx-auto px-10">
          <div className="grid grid-cols-3 gap-6">
            {placeholderPosts.map((post) => (
              <article key={post.slug} className="border-2 border-divider rounded-card bg-white overflow-hidden hover:border-terra hover:-translate-y-0.5 transition-all duration-200 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-[220px] object-cover block"
                  loading="lazy"
                />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-divider text-terra tracking-[0.06em] uppercase">{post.category}</span>
                    <span className="font-mono text-[11px] text-ink/35">
                      {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <h2 className="font-fraunces text-xl font-bold tracking-tight mb-3 leading-[1.2]">{post.title}</h2>
                  <p className="text-sm leading-relaxed text-ink/60 mb-5">{post.excerpt}</p>
                  <span className="text-[13px] font-semibold text-terra group-hover:gap-2.5 transition-all">
                    Read more →
                  </span>
                </div>
              </article>
            ))}
          </div>

          {/* Coming soon note */}
          <div className="mt-16 border-2 border-divider rounded-card bg-white p-10 text-center max-w-xl mx-auto">
            <h3 className="font-fraunces text-2xl font-bold mb-3">More posts coming soon</h3>
            <p className="text-sm text-ink/55 mb-6">We&apos;re writing up trail reports, gear reviews, and destination guides. Follow us on Instagram for updates.</p>
            <a
              href="https://instagram.com/summitbalkans"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-divider text-ink px-5 py-2.5 rounded-lg text-sm font-medium no-underline hover:border-ink transition-colors"
            >
              Follow on Instagram
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
