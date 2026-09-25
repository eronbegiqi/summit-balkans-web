import { NextRequest, NextResponse } from "next/server";

// Receives Content-Security-Policy-Report-Only violations (see next.config.ts)
// and logs a compact line per report — read them in the Vercel function logs.
export async function POST(request: NextRequest) {
  const body = (await request.text()).slice(0, 4000); // untrusted, cap it
  try {
    const report = JSON.parse(body)["csp-report"] ?? {};
    console.warn(
      "[csp]",
      report["effective-directive"] ?? report["violated-directive"],
      report["blocked-uri"],
      "on",
      report["document-uri"],
    );
  } catch {
    console.warn("[csp] unparseable report", body.slice(0, 200));
  }
  return new NextResponse(null, { status: 204 });
}
