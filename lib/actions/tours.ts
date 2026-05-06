'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db/client';
import { tours } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';

type TourPayload = Omit<typeof tours.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>;

async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  return session;
}

export async function saveTour(id: number | null, data: TourPayload) {
  await requireAdmin();

  if (id) {
    await db.update(tours).set(data).where(eq(tours.id, id));
  } else {
    const [result] = await db.insert(tours).values(data);
    const newId = Number((result as unknown as { insertId: number }).insertId);
    revalidatePath('/admin/tours');
    redirect(`/admin/tours/${newId}/edit`);
  }

  revalidatePath('/admin/tours');
  revalidatePath(`/admin/tours/${id}/edit`);
}

export async function toggleTourPublished(id: number, published: boolean) {
  await requireAdmin();
  await db.update(tours).set({ published }).where(eq(tours.id, id));
  revalidatePath('/admin/tours');
  revalidatePath(`/admin/tours/${id}/edit`);
}

export async function deleteTour(id: number) {
  await requireAdmin();
  await db.delete(tours).where(eq(tours.id, id));
  revalidatePath('/admin/tours');
  redirect('/admin/tours');
}
