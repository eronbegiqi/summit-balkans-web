'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db/client';
import { departures } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';

type DeparturePayload = Omit<typeof departures.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>;

export type SaveDepartureResult = { ok: true; id: number } | { ok: false; error: string };

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  return session;
}

export async function saveDeparture(id: number | null, data: DeparturePayload): Promise<SaveDepartureResult> {
  await requireAdmin();

  // Validate on the server too — never trust the client, and guard against the
  // corrupt-date bug where an unparseable value used to slip through.
  const startDate = String(data.startDate ?? '');
  const endDate = String(data.endDate ?? '');
  if (!data.tourId) return { ok: false, error: 'Please select a tour.' };
  if (!DATE_RE.test(startDate) || !DATE_RE.test(endDate)) {
    return { ok: false, error: 'Valid start and end dates are required.' };
  }
  if (endDate < startDate) {
    return { ok: false, error: 'End date must be on or after the start date.' };
  }
  if (!data.capacity || data.capacity < 1) {
    return { ok: false, error: 'Capacity must be at least 1.' };
  }

  if (id) {
    await db.update(departures).set(data).where(eq(departures.id, id));
    revalidatePath('/admin/departures');
    revalidatePath(`/admin/departures/${id}`);
    return { ok: true, id };
  }

  const [result] = await db.insert(departures).values(data);
  const newId = Number((result as unknown as { insertId: number }).insertId);
  revalidatePath('/admin/departures');
  return { ok: true, id: newId };
}

export async function deleteDeparture(id: number) {
  await requireAdmin();
  await db.delete(departures).where(eq(departures.id, id));
  revalidatePath('/admin/departures');
  redirect('/admin/departures');
}
