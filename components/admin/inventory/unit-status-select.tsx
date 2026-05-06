'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { updateUnitStatus } from '@/lib/actions/inventory';

type Status = 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'RETIRED';

const STATUS_COLORS: Record<Status, string> = {
  AVAILABLE: 'text-emerald-700 bg-emerald-50',
  RENTED: 'text-blue-700 bg-blue-50',
  MAINTENANCE: 'text-yellow-700 bg-yellow-50',
  RETIRED: 'text-gray-600 bg-gray-100',
};

export function UnitStatusSelect({ unitId, currentStatus }: { unitId: number; currentStatus: string }) {
  const [pending, startTransition] = useTransition();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as Status;
    startTransition(async () => {
      await updateUnitStatus(unitId, newStatus);
      toast.success(`Unit status → ${newStatus}`);
    });
  }

  return (
    <select
      value={currentStatus}
      onChange={onChange}
      disabled={pending}
      className={`rounded-md border-0 px-2 py-1 text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60 ${STATUS_COLORS[currentStatus as Status] ?? 'text-gray-600 bg-gray-100'}`}
    >
      <option value="AVAILABLE">AVAILABLE</option>
      <option value="RENTED">RENTED</option>
      <option value="MAINTENANCE">MAINTENANCE</option>
      <option value="RETIRED">RETIRED</option>
    </select>
  );
}
