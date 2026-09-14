export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { db } from "@/lib/db/client";
import { blogPosts } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { BlogDraftReady } from "@/emails/BlogDraftReady";
import { SITE_URL } from "@/lib/seo";
import { estimateReadingMinutes } from "@/lib/utils";

const getResend = () => new Resend(process.env.RESEND_API_KEY ?? '');
const FROM = process.env.RESEND_FROM ?? "Summit Balkans <info@summitbalkans.com>";
const ADMIN = process.env.ADMIN_EMAIL ?? "info@summitbalkans.com";

const BRAND_BRIEF =
  "Summit Balkans runs small-group guided and self-guided hiking tours in Albania, Montenegro and Kosovo " +
  "(based in Mitrovica, Kosovo), including the flagship multi-day Peaks of the Balkans trail and shorter " +
  "trips like the Rugova via ferrata and the Durmitor Ring. Audience: independent-minded hikers researching " +
  "Balkans trekking before booking.";

// Weekly automated blog draft. Runs research (web search) then a structured
// writing pass, and always lands as an unpublished draft — never auto-publishes.
// See PR discussion: automated content ships as a draft for human review by
// design, both for quality control and to stay clear of Google's stance on
// unsupervised mass-produced content.
const CATEGORIES = ["TRAVEL_TIPS", "DESTINATION_GUIDE", "EQUIPMENT", "STORIES", "NEWS"] as const;

interface BlogDraft {
  title: string;
  excerpt: string;
  contentHtml: string;
  category: (typeof CATEGORIES)[number];
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  targetKeyword: string;
}

const SUBMIT_DRAFT_TOOL_NAME = "submit_blog_draft";

const SUBMIT_DRAFT_TOOL = {
  name: SUBMIT_DRAFT_TOOL_NAME,
  description: "Submit the completed blog post draft.",
  strict: true,
  input_schema: {
    type: "object" as const,
    properties: {
      title: { type: "string", description: "SEO-friendly, compelling title, under 70 characters" },
      excerpt: { type: "string", description: "1-2 sentence summary, under 160 characters" },
      contentHtml: {
        type: "string",
        description: "Full post body as semantic HTML using only h2/h3/p/ul/ol/li/strong/em tags, 800-1300 words",
      },
      category: { type: "string", enum: CATEGORIES },
      tags: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 6 },
      seoTitle: { type: "string", description: "Under 60 characters, includes the target keyword" },
      seoDescription: { type: "string", description: "Under 155 characters" },
      targetKeyword: { type: "string" },
    },
    required: [
      "title", "excerpt", "contentHtml", "category", "tags", "seoTitle", "seoDescription", "targetKeyword",
    ],
    additionalProperties: false,
  },
};

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let i = 2;
  while ((await db.select({ id: blogPosts.id }).from(blogPosts).where(eq(blogPosts.slug, slug)))[0]) {
    slug = `${base}-${i++}`;
  }
  return slug;
}

const WEB_SEARCH_TOOL = { type: "web_search_20260209" as const, name: "web_search" as const, max_uses: 8 };

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const client = new Anthropic();

    const recentPosts = await db
      .select({ title: blogPosts.title })
      .from(blogPosts)
      .orderBy(desc(blogPosts.createdAt))
      .limit(40);

    // Phase 1 — research a target keyword and gather current facts via web search
    const researchMessages: Anthropic.MessageParam[] = [
      {
        role: "user",
        content: `${BRAND_BRIEF}

Find ONE good target keyword/topic for this week's blog post — something real people search for that Summit Balkans could realistically rank for, tied to hiking in Albania, Montenegro, or Kosovo (trail guides, gear, seasons, permits, logistics, comparisons, etc).

Already-published post titles to avoid repeating (do not pick an overlapping topic):
${recentPosts.map((p) => `- ${p.title}`).join("\n") || "(none yet)"}

Use web search to check current search interest and gather accurate, up-to-date facts for the topic you pick (trail conditions, seasonal timing, permits, prices, safety notes, comparisons to other treks — whatever is relevant). Then write a short research brief: the chosen keyword, why it's a good pick, and the key facts you found with their sources.`,
      },
    ];

    let researchResponse = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      tools: [WEB_SEARCH_TOOL],
      messages: researchMessages,
    });

    while (researchResponse.stop_reason === "pause_turn") {
      researchMessages.push({ role: "assistant", content: researchResponse.content });
      researchResponse = await client.messages.create({
        model: "claude-opus-5",
        max_tokens: 16000,
        thinking: { type: "adaptive" },
        tools: [WEB_SEARCH_TOOL],
        messages: researchMessages,
      });
    }

    const researchBrief = researchResponse.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n\n")
      .trim();

    if (!researchBrief) {
      throw new Error("Research phase produced no usable brief");
    }

    // Phase 2 — turn the research into a structured, ready-to-review draft.
    // Forced tool use (not a fixed schema helper) so the response is always
    // strictly-validated JSON, independent of the zod version installed.
    const draftResponse = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      tools: [SUBMIT_DRAFT_TOOL],
      tool_choice: { type: "tool", name: SUBMIT_DRAFT_TOOL_NAME },
      messages: [
        {
          role: "user",
          content: `${BRAND_BRIEF}

Using this research brief, write a complete blog post draft:

${researchBrief}

Write in a warm, knowledgeable, non-salesy voice — like a local guide sharing real advice, not marketing copy. Do not invent specific prices, dates, or statistics that weren't in the research brief above.`,
        },
      ],
    });

    const toolUse = draftResponse.content.find(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use" && b.name === SUBMIT_DRAFT_TOOL_NAME
    );
    if (!toolUse) {
      throw new Error("Structured draft generation did not return the expected tool call");
    }
    const draft = toolUse.input as BlogDraft;

    const slug = await uniqueSlug(slugify(draft.title));

    const [result] = await db.insert(blogPosts).values({
      slug,
      title: draft.title,
      excerpt: draft.excerpt,
      content: draft.contentHtml,
      category: draft.category,
      tags: draft.tags,
      seoTitle: draft.seoTitle,
      seoDescription: draft.seoDescription,
      readingTimeMinutes: estimateReadingMinutes(draft.contentHtml),
      published: false,
    });
    const newId = Number((result as unknown as { insertId: number }).insertId);

    await getResend().emails.send({
      from: FROM,
      to: ADMIN,
      subject: `New blog draft ready for review — ${draft.title}`,
      html: await render(
        BlogDraftReady({
          title: draft.title,
          excerpt: draft.excerpt,
          targetKeyword: draft.targetKeyword,
          editUrl: `${SITE_URL}/admin/blog/${newId}/edit`,
        })
      ),
    });

    console.log(`[cron/blog-post] created draft id=${newId} slug=${slug} keyword="${draft.targetKeyword}"`);

    return NextResponse.json({ ok: true, id: newId, slug, targetKeyword: draft.targetKeyword });
  } catch (err) {
    console.error('[cron/blog-post]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
