import { db } from '@/lib/db/client';
import { gearUnits, gearRentals } from '@/lib/db/schema';
import { inArray, sql } from 'drizzle-orm';

export async function getAvailableUnitCount(
  gearItemId: number,
  startDate: string,
  endDate: string
): Promise<number> {
  const rows = await db.execute(sql`
    SELECT COUNT(*) AS available
    FROM gear_units gu
    WHERE gu.gear_item_id = ${gearItemId}
      AND gu.status NOT IN ('MAINTENANCE', 'RETIRED')
      AND gu.id NOT IN (
        SELECT gr.gear_unit_id
        FROM gear_rentals gr
        WHERE gr.status NOT IN ('RETURNED', 'CANCELLED', 'LOST')
          AND gr.rental_start_date <= ${endDate}
          AND gr.rental_end_date >= ${startDate}
      )
  `);
  return Number((rows as unknown as Array<{ available: number }>)[0]?.available ?? 0);
}

export async function getAvailableUnitIds(
  gearItemId: number,
  startDate: string,
  endDate: string,
  limit: number
): Promise<number[]> {
  const rows = await db.execute(sql`
    SELECT gu.id
    FROM gear_units gu
    WHERE gu.gear_item_id = ${gearItemId}
      AND gu.status NOT IN ('MAINTENANCE', 'RETIRED')
      AND gu.id NOT IN (
        SELECT gr.gear_unit_id
        FROM gear_rentals gr
        WHERE gr.status NOT IN ('RETURNED', 'CANCELLED', 'LOST')
          AND gr.rental_start_date <= ${endDate}
          AND gr.rental_end_date >= ${startDate}
      )
    LIMIT ${limit}
  `);
  return (rows as unknown as Array<{ id: number }>).map((r) => r.id);
}

export async function reserveUnits(
  gearItemId: number,
  quantity: number,
  startDate: string,
  endDate: string,
  expectedReturnDate: string,
  bookingId: number,
  dailyRateEur: number,
  depositEur?: number
): Promise<number[]> {
  const unitIds = await getAvailableUnitIds(gearItemId, startDate, endDate, quantity);

  if (unitIds.length < quantity) {
    throw new Error(
      `Only ${unitIds.length} unit(s) available for the selected dates. Requested ${quantity}.`
    );
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  const totalEur = dailyRateEur * totalDays;

  const toReserve = unitIds.slice(0, quantity);

  await db.transaction(async (tx) => {
    await tx.update(gearUnits)
      .set({ status: 'RENTED' })
      .where(inArray(gearUnits.id, toReserve));

    await tx.insert(gearRentals).values(
      toReserve.map((unitId) => ({
        bookingId,
        gearUnitId: unitId,
        rentalStartDate: new Date(startDate),
        rentalEndDate: new Date(endDate),
        expectedReturnDate: new Date(expectedReturnDate),
        dailyRateEur: String(dailyRateEur),
        totalDays,
        totalEur: String(totalEur),
        depositEur: depositEur ? String(depositEur) : undefined,
        status: 'RESERVED' as const,
      }))
    );
  });

  return toReserve;
}

export async function releaseReservation(gearRentalIds: number[]): Promise<void> {
  if (gearRentalIds.length === 0) return;

  await db.transaction(async (tx) => {
    const rentals = await tx
      .select({ gearUnitId: gearRentals.gearUnitId })
      .from(gearRentals)
      .where(inArray(gearRentals.id, gearRentalIds));

    const unitIds = rentals.map((r) => r.gearUnitId);

    await Promise.all([
      tx.update(gearRentals)
        .set({ status: 'RETURNED' })
        .where(inArray(gearRentals.id, gearRentalIds)),
      tx.update(gearUnits)
        .set({ status: 'AVAILABLE' })
        .where(inArray(gearUnits.id, unitIds)),
    ]);
  });
}
