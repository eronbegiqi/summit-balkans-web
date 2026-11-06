import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { customers } from '@/lib/db/schema';
import { unsubscribeUrl } from '@/lib/newsletter';

export const dynamic = 'force-dynamic';

const q = (v: string | null) => `"${(v ?? '').replace(/"/g, '""')}"`;

// /admin/* is behind proxy.ts (admin session required).
export async function GET() {
  const rows = await db.select().from(customers).where(eq(customers.marketingConsent, true));
  const csv = [
    'email,first_name,last_name,country,unsubscribe_url',
    ...rows.map((c) => [c.email, c.firstName, c.lastName, c.country, unsubscribeUrl(c.email)].map(q).join(',')),
  ].join('\n');
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
