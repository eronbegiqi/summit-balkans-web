import { NextRequest, NextResponse } from "next/server";

// Receives Content-Security-Policy-Report-Only violations (see next.config.ts)
// and logs a compact line per report — read them in the Vercel function logs.

// ponytail: in-memory fixed window, per function instance. Fluid Compute reuses
// instances so this throttles floods, but it isn't global — move to a Vercel
// Firewall rate-limit rule (or Upstash) if the logs still get spammed.
const WINDOW_MS = 60_000;
const PER_IP_LIMIT = 20; // a real page rarely triggers more than a handful
const GLOBAL_LIMIT = 300; // caps log volume from many IPs at once
let windowStart = 0;
let globalCount = 0;
const hits = new Map<string, number>();

function isRateLimited(ip: string, now = Date.now()): boolean {
  if (now - windowStart >= WINDOW_MS) {
    windowStart = now;
    globalCount = 0;
    hits.clear(); // also bounds memory: the map never outlives one window
  }
  const count = (hits.get(ip) ?? 0) + 1;
  hits.set(ip, count);
  globalCount++;
  return count > PER_IP_LIMIT || globalCount > GLOBAL_LIMIT;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (isRateLimited(ip)) return new NextResponse(null, { status: 429 });

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
