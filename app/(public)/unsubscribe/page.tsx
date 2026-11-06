import type { Metadata } from 'next';
import { unsubscribe } from '@/lib/actions/newsletter';
import { verifyUnsubscribe } from '@/lib/newsletter';

export const metadata: Metadata = { title: 'Unsubscribe', robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ e?: string; t?: string; done?: string }> };

export default async function UnsubscribePage({ searchParams }: Props) {
  const { e = '', t = '', done } = await searchParams;
  const valid = !!e && verifyUnsubscribe(e, t);

  async function action(formData: FormData) {
    'use server';
    const { ok } = await unsubscribe(formData);
    const { redirect } = await import('next/navigation');
    redirect(ok ? '/unsubscribe?done=1' : '/unsubscribe');
  }

  return (
    <section className="py-32 bg-bone">
      <div className="max-w-md mx-auto px-5 text-center">
        <h1 className="font-fraunces text-3xl font-bold mb-4">Unsubscribe</h1>
        {done ? (
          <p className="text-ink/70">You have been unsubscribed. You will not receive our newsletter again.</p>
        ) : valid ? (
          <form action={action}>
            <input type="hidden" name="e" value={e} />
            <input type="hidden" name="t" value={t} />
            <p className="text-ink/70 mb-6">Stop sending trip news to {e}?</p>
            <button type="submit" className="bg-brand text-white px-8 py-3 rounded-xl font-semibold">
              Unsubscribe
            </button>
          </form>
        ) : (
          <p className="text-ink/70">This unsubscribe link is not valid. Email info@summitbalkans.com and we will remove you.</p>
        )}
      </div>
    </section>
  );
}
