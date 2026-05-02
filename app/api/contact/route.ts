import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { contactSchema } from "@/lib/schemas";
import { saveSubmission } from "@/lib/airtable";
import { ContactAutoReply } from "@/emails/ContactAutoReply";
import { AdminContactAlert } from "@/emails/AdminContactAlert";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const FROM = process.env.RESEND_FROM ?? "Summit Balkans <info@summitbalkans.com>";
  const ADMIN = process.env.ADMIN_EMAIL ?? "info@summitbalkans.com";
  try {
    const body = await req.json();
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid data", issues: result.error.issues }, { status: 400 });
    }

    const { name, email, phone, subject, message } = result.data;

    // Run email sends + Airtable write in parallel
    await Promise.all([
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
      saveSubmission("contact", {
        Name: name,
        Email: email,
        Phone: phone ?? "",
        Subject: subject,
        Message: message,
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/contact]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
