import { db } from '@/lib/db/client';
import { gearItems, gearUnits, gearRentals, bookings, customers } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export type GearItemWithStats = typeof gearItems.$inferSelect & {
  totalUnitsCount: number;
  availableCount: number;
  rentedCount: number;
  maintenanceCount: number;
};

export type GearUnitWithRental = typeof gearUnits.$inferSelect & {
  gearItem: typeof gearItems.$inferSelect;
  activeRental: {
    id: number;
    bookingReference: string;
    customerName: string;
    rentalEndDate: string;
    status: string;
  } | null;
};

export type RentalForCalendar = {
  unitId: number;
  unitCode: string;
  gearItemName: string;
  bookingReference: string;
  customerName: string;
  startDate: string;
  endDate: string;
  status: string;
};

export async function getGearItemsWithStats(): Promise<GearItemWithStats[]> {
  const rows = await db.execute(sql`
    SELECT
      gi.*,
      COUNT(gu.id) AS total_units_count,
      SUM(CASE WHEN gu.status = 'AVAILABLE' THEN 1 ELSE 0 END) AS available_count,
      SUM(CASE WHEN gu.status = 'RENTED' THEN 1 ELSE 0 END) AS rented_count,
      SUM(CASE WHEN gu.status = 'MAINTENANCE' THEN 1 ELSE 0 END) AS maintenance_count
    FROM gear_items gi
    LEFT JOIN gear_units gu ON gu.gear_item_id = gi.id
    GROUP BY gi.id
    ORDER BY gi.display_order ASC, gi.name ASC
  `);
  return (rows as unknown as Array<Record<string, unknown>>).map((r) => ({
    ...r,
    totalUnitsCount: Number(r.total_units_count ?? 0),
    availableCount: Number(r.available_count ?? 0),
    rentedCount: Number(r.rented_count ?? 0),
    maintenanceCount: Number(r.maintenance_count ?? 0),
  })) as GearItemWithStats[];
}

export async function getGearUnitsWithRentals(gearItemId?: number): Promise<GearUnitWithRental[]> {
  const rows = await db.execute(sql`
    SELECT
      gu.*,
      gi.name AS gear_item_name,
      gi.category AS gear_item_category,
      gi.photo_url AS gear_item_photo,
      gi.day_rate_eur AS gear_item_day_rate,
      gi.deposit_eur AS gear_item_deposit,
      gi.sizes AS gear_item_sizes,
      gr.id AS rental_id,
      gr.status AS rental_status,
      gr.rental_end_date AS rental_end_date,
      b.booking_reference,
      CONCAT(c.first_name, ' ', c.last_name) AS customer_name
    FROM gear_units gu
    JOIN gear_items gi ON gi.id = gu.gear_item_id
    LEFT JOIN gear_rentals gr ON gr.gear_unit_id = gu.id
      AND gr.status IN ('RESERVED', 'CHECKED_OUT')
    LEFT JOIN bookings b ON b.id = gr.booking_id
    LEFT JOIN customers c ON c.id = b.customer_id
    ${gearItemId ? sql`WHERE gu.gear_item_id = ${gearItemId}` : sql``}
    ORDER BY gi.name ASC, gu.unit_code ASC
  `);

  return (rows as unknown as Array<Record<string, unknown>>).map((r) => ({
    id: r.id,
    gearItemId: r.gear_item_id,
    unitCode: r.unit_code,
    size: r.size,
    conditionStatus: r.condition_status,
    status: r.status,
    purchasedDate: r.purchased_date,
    notes: r.notes,
    damageNotes: r.damage_notes,
    availableFrom: r.available_from,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    gearItem: {
      id: r.gear_item_id,
      name: r.gear_item_name,
      category: r.gear_item_category,
      photoUrl: r.gear_item_photo,
      dayRateEur: r.gear_item_day_rate,
      depositEur: r.gear_item_deposit,
      sizes: r.gear_item_sizes,
    },
    activeRental: r.rental_id
      ? {
          id: Number(r.rental_id),
          bookingReference: r.booking_reference as string,
          customerName: r.customer_name as string,
          rentalEndDate: r.rental_end_date as string,
          status: r.rental_status as string,
        }
      : null,
  })) as GearUnitWithRental[];
}

export async function getGearUnitById(id: number) {
  const [unit] = await db.select().from(gearUnits).where(eq(gearUnits.id, id));
  if (!unit) return null;

  const [item] = await db.select().from(gearItems).where(eq(gearItems.id, unit.gearItemId));
  const rentals = await db.select().from(gearRentals).where(eq(gearRentals.gearUnitId, id));

  return { ...unit, gearItem: item, rentals };
}

export async function getRentalsForCalendar(daysAhead = 60): Promise<RentalForCalendar[]> {
  const rows = await db.execute(sql`
    SELECT
      gu.id AS unit_id,
      gu.unit_code,
      gi.name AS gear_item_name,
      b.booking_reference,
      CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
      gr.rental_start_date AS start_date,
      gr.rental_end_date AS end_date,
      gr.status
    FROM gear_rentals gr
    JOIN gear_units gu ON gu.id = gr.gear_unit_id
    JOIN gear_items gi ON gi.id = gu.gear_item_id
    JOIN bookings b ON b.id = gr.booking_id
    JOIN customers c ON c.id = b.customer_id
    WHERE gr.rental_end_date >= CURDATE()
      AND gr.rental_start_date <= DATE_ADD(CURDATE(), INTERVAL ${daysAhead} DAY)
      AND gr.status NOT IN ('RETURNED', 'LOST')
    ORDER BY gi.name ASC, gu.unit_code ASC, gr.rental_start_date ASC
  `);
  return rows as unknown as RentalForCalendar[];
}

export async function getLateRentals() {
  const rows = await db.execute(sql`
    SELECT
      gr.id,
      gr.expected_return_date,
      gr.status,
      gu.unit_code,
      gi.name AS gear_item_name,
      b.booking_reference,
      CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
      c.email AS customer_email
    FROM gear_rentals gr
    JOIN gear_units gu ON gu.id = gr.gear_unit_id
    JOIN gear_items gi ON gi.id = gu.gear_item_id
    JOIN bookings b ON b.id = gr.booking_id
    JOIN customers c ON c.id = b.customer_id
    WHERE gr.expected_return_date < CURDATE()
      AND gr.actual_return_date IS NULL
      AND gr.status IN ('CHECKED_OUT', 'LATE')
    ORDER BY gr.expected_return_date ASC
  `);
  return rows as unknown as Array<{
    id: number;
    expected_return_date: string;
    status: string;
    unit_code: string;
    gear_item_name: string;
    booking_reference: string;
    customer_name: string;
    customer_email: string;
  }>;
}
