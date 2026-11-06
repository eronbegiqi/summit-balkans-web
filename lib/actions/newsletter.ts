'use server';

import { setNewsletterConsent, verifyUnsubscribe } from '@/lib/newsletter';

export async function unsubscribe(formData: FormData): Promise<{ ok: boolean }> {
  const email = String(formData.get('e') ?? '');
  const token = String(formData.get('t') ?? '');
  if (!email || !verifyUnsubscribe(email, token)) return { ok: false };
  await setNewsletterConsent(email, false);
  return { ok: true };
}
