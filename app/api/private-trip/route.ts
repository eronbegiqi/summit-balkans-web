import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { inquiries } from "@/lib/db/schema";
import { PrivateTripAutoReply } from "@/emails/PrivateTripAutoReply";
import { AdminPrivateTripAlert } from "@/emails/AdminPrivateTripAlert";

const privateTripSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  notes: z.string().optional(),
  destinations: z.array(z.string()),
  groupSize: z.number().min(2).max(12),
  experiences: z.array(z.string()),
  dateOption: z.string(),
  customFrom: z.string().optional(),
  customTo: z.string().optional(),
});

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM ?? "Summit Balkans <info@summitbalkans.com>";
const ADMIN = process.env.ADMIN_EMAIL ?? "info@summitbalkans.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = privateTripSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid data", issues: result.error.issues }, { status: 400 });
    }

    const data = result.data;

    const message = [
      `Destinations: ${data.destinations.join(", ")}`,
      `Group: ${data.groupSize} people`,
      `When: ${data.dateOption}`,
      `Experience: ${data.experiences.join(", ")}`,
      data.notes ? `Notes: ${data.notes}` : "",
    ].filter(Boolean).join("\n");

    await Promise.all([
      // Save to DB
      db.insert(inquiries).values({
        type: "PRIVATE_TRIP",
        name: data.name,
        email: data.email,
        phone: data.phone ?? undefined,
        subject: `Private: ${data.destinations.join(", ")} · ${data.groupSize}p`,
        message,
        groupSize: data.groupSize,
        countriesOfInterest: data.destinations,
        preferredDatesStart: data.customFrom ? new Date(data.customFrom) : undefined,
        preferredDatesEnd: data.customTo ? new Date(data.customTo) : undefined,
        sourcePage: req.headers.get("referer") ?? undefined,
        status: "NEW",
      }),
      // Emails
      resend.emails.send({
        from: FROM,
        to: data.email,
        subject: "We'll design your Balkans route — Summit Balkans",
        html: await render(PrivateTripAutoReply({
          name: data.name,
          destinations: data.destinations,
          groupSize: data.groupSize,
          experiences: data.experiences,
          dateOption: data.dateOption,
        })),
      }),
      resend.emails.send({
        from: FROM,
        to: ADMIN,
        replyTo: data.email,
        subject: `Private trip enquiry — ${data.name} · ${data.groupSize} people · ${data.destinations.join(", ")}`,
        html: await render(AdminPrivateTripAlert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          notes: data.notes,
          destinations: data.destinations,
          groupSize: data.groupSize,
          experiences: data.experiences,
          dateOption: data.dateOption,
          customFrom: data.customFrom,
          customTo: data.customTo,
        })),
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/private-trip]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
