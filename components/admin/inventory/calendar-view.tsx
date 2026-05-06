'use client';

import type { RentalForCalendar } from '@/lib/db/queries/inventory';

type Props = { rentals: RentalForCalendar[] };

function getDays(start: Date, count: number): Date[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function toYMD(d: Date) {
  return d.toISOString().split('T')[0];
}

const STATUS_COLORS: Record<string, string> = {
  RESERVED: 'bg-blue-400',
  CHECKED_OUT: 'bg-orange-400',
  LATE: 'bg-red-500',
  DAMAGED: 'bg-red-700',
};

export function GearCalendarView({ rentals }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const DAYS = 42;
  const days = getDays(today, DAYS);

  // Group rentals by unit
  const byUnit = new Map<string, RentalForCalendar[]>();
  rentals.forEach((r) => {
    const key = `${r.unitId}-${r.unitCode}`;
    if (!byUnit.has(key)) byUnit.set(key, []);
    byUnit.get(key)!.push(r);
  });

  if (byUnit.size === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-gray-400">
        No active rentals in the next 6 weeks
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: `${100 + DAYS * 28}px` }}>
        {/* Header */}
        <div className="flex border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="w-48 shrink-0 px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Unit</div>
          {days.map((d) => (
            <div
              key={toYMD(d)}
              className={`w-7 shrink-0 py-2 text-center text-[10px] font-medium ${
                toYMD(d) === toYMD(today) ? 'text-emerald-700 font-bold' : 'text-gray-400'
              }`}
            >
              {d.getDate()}
            </div>
          ))}
        </div>

        {/* Rows */}
        {Array.from(byUnit.entries()).map(([key, unitRentals]) => {
          const [, unitCode] = key.split('-');
          const gearItemName = unitRentals[0].gearItemName;

          return (
            <div key={key} className="flex border-b border-gray-50 hover:bg-gray-50">
              <div className="w-48 shrink-0 px-3 py-2">
                <p className="text-xs font-semibold text-gray-700 truncate">{gearItemName}</p>
                <p className="text-[11px] text-gray-400 font-mono">{unitCode}</p>
              </div>
              {days.map((d) => {
                const ymd = toYMD(d);
                const rental = unitRentals.find((r) => r.startDate <= ymd && r.endDate >= ymd);
                const isStart = rental && toYMD(new Date(rental.startDate)) === ymd;

                return (
                  <div key={ymd} className="relative w-7 shrink-0 py-2">
                    {rental && (
                      <div
                        title={`${rental.bookingReference} · ${rental.customerName}`}
                        className={`absolute inset-y-2 left-0 right-0 opacity-80 ${STATUS_COLORS[rental.status] ?? 'bg-gray-300'}`}
                      />
                    )}
                    {rental && isStart && (
                      <div className="absolute inset-y-2 left-0 right-0 flex items-center justify-start pl-1 overflow-hidden">
                        <span className="text-[9px] font-bold text-white truncate leading-none">
                          {rental.bookingReference}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <span key={status} className="flex items-center gap-1.5">
            <span className={`inline-block h-3 w-3 rounded-sm ${color}`} />
            {status}
          </span>
        ))}
      </div>
    </div>
  );
}
