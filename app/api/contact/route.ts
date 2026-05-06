export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { contactSchema } from "@/lib/schemas";
import { db } from "@/lib/db/client";
import { inquiries } from "@/lib/db/schema";
import { ContactAutoReply } from "@/emails/ContactAutoReply";
import { AdminContactAlert } from "@/emails/AdminContactAlert";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM ?? "Summit Balkans <info@summitbalkans.com>";
const ADMIN = process.env.ADMIN_EMAIL ?? "info@summitbalkans.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid data", issues: result.error.issues }, { status: 400 });
    }

    const { name, email, phone, subject, message } = result.data;

    await Promise.all([
      // Save to DB
      db.insert(inquiries).values({
        type: "CONTACT",
        name,
        email,
        phone: phone ?? undefined,
        subject,
        message,
        sourcePage: req.headers.get("referer") ?? undefined,
        ipAddress: req.headers.get("x-forwarded-for")?.split(",")[0] ?? undefined,
        status: "NEW",
      }),
      // Emails
      resend.emails.send({
        from: FROM,
        to: email,
        subject: "We got your message — Summit Balkans",
        html: await render(ContactAutoReply({ name, subject, message })),
      }),
      resend.emails.send({
        from: FROM,
        to: ADMIN,
        replyTo: email,
        subject: `New contact: ${name} — ${subject}`,
        html: await render(AdminContactAlert({ name, email, phone, subject, message })),
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/contact]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
