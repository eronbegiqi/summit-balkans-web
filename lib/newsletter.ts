import { createHmac, timingSafeEqual } from 'crypto';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { customers } from '@/lib/db/schema';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.summitbalkans.com';

function sign(email: string): string {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) throw new Error('ADMIN_JWT_SECRET is not set');
  return createHmac('sha256', secret).update(`unsubscribe:${email.toLowerCase()}`).digest('hex');
}

/** Per-person unsubscribe link, safe to put in every newsletter. */
export function unsubscribeUrl(email: string): string {
  return `${SITE}/unsubscribe?e=${encodeURIComponent(email)}&t=${sign(email)}`;
}

export function verifyUnsubscribe(email: string, token: string): boolean {
  try {
    const a = Buffer.from(sign(email));
    const b = Buffer.from(token);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Record an explicit newsletter opt-in. People who only sent an enquiry become a
 * customer row with 0 bookings so there is one list. The date and source go in
 * `notes` as proof of consent.
 */
export async function recordNewsletterOptIn(input: { email: string; name?: string; source: string }) {
  const email = input.email.trim();
  const [first, ...rest] = (input.name ?? '').trim().split(/\s+/);
  const line = `Newsletter opt-in ${new Date().toISOString().slice(0, 10)} via ${input.source}`;
  const [existing] = await db.select().from(customers).where(eq(customers.email, email)).limit(1);
  if (existing) {
    await db
      .update(customers)
      .set({ marketingConsent: true, notes: [existing.notes, line].filter(Boolean).join('\n') })
      .where(eq(customers.id, existing.id));
  } else {
    await db.insert(customers).values({
      email,
      firstName: first || 'Subscriber',
      lastName: rest.join(' '),
      marketingConsent: true,
      notes: line,
    });
  }
}

export async function setNewsletterConsent(email: string, consent: boolean) {
  await db.update(customers).set({ marketingConsent: consent }).where(eq(customers.email, email));
}
