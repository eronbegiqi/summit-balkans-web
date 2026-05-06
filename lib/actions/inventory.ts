'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db/client';
import { gearUnits, gearRentals, activityLog } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';

type UnitStatus = typeof gearUnits.$inferSelect['status'];
type ConditionStatus = typeof gearUnits.$inferSelect['conditionStatus'];
type RentalStatus = typeof gearRentals.$inferSelect['status'];

async function getAdminSession() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  return session;
}

export async function updateUnitStatus(unitId: number, status: UnitStatus) {
  const session = await getAdminSession();

  await db.update(gearUnits).set({ status }).where(eq(gearUnits.id, unitId));

  await db.insert(activityLog).values({
    adminUserId: session.adminUserId,
    entityType: 'gear_unit',
    entityId: unitId,
    action: 'status_change',
    changes: { status: { from: null, to: status } },
  });

  revalidatePath('/admin/gear/inventory');
  revalidatePath(`/admin/gear/units/${unitId}`);
}

export async function updateUnitCondition(
  unitId: number,
  conditionStatus: ConditionStatus,
  notes?: string
) {
  const session = await getAdminSession();

  await db.update(gearUnits)
    .set({ conditionStatus, ...(notes ? { damageNotes: notes } : {}) })
    .where(eq(gearUnits.id, unitId));

  await db.insert(activityLog).values({
    adminUserId: session.adminUserId,
    entityType: 'gear_unit',
    entityId: unitId,
    action: 'condition_update',
    changes: { condition: { from: null, to: conditionStatus } },
  });

  revalidatePath(`/admin/gear/units/${unitId}`);
  revalidatePath('/admin/gear/inventory');
}

export async function returnRental(
  rentalId: number,
  returnCondition: typeof gearRentals.$inferSelect['returnCondition'],
  damageNotes?: string,
  damageChargeEur?: number
) {
  const session = await getAdminSession();

  const [rental] = await db.select().from(gearRentals).where(eq(gearRentals.id, rentalId)).limit(1);
  if (!rental) throw new Error('Rental not found');

  const isDamaged = returnCondition === 'DAMAGED' || returnCondition === 'LOST';

  await Promise.all([
    db.update(gearRentals).set({
      status: isDamaged ? 'DAMAGED' : 'RETURNED',
      returnCondition,
      actualReturnDate: new Date(),
      damageNotes: damageNotes || undefined,
      damageChargeEur: damageChargeEur ? String(damageChargeEur) : '0',
    }).where(eq(gearRentals.id, rentalId)),

    db.update(gearUnits).set({
      status: isDamaged ? 'MAINTENANCE' : 'AVAILABLE',
      ...(isDamaged && damageNotes ? { damageNotes } : {}),
    }).where(eq(gearUnits.id, rental.gearUnitId)),
  ]);

  await db.insert(activityLog).values({
    adminUserId: session.adminUserId,
    entityType: 'gear_rental',
    entityId: rentalId,
    action: 'returned',
    changes: { condition: { from: null, to: returnCondition } },
  });

  revalidatePath('/admin/gear/inventory');
  revalidatePath(`/admin/gear/units/${rental.gearUnitId}`);
}
