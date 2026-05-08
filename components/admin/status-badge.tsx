import { cn } from '@/lib/utils';

type Variant = 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple' | 'orange';

const statusMap: Record<string, Variant> = {
  // Booking status
  NEW: 'blue',
  CONFIRMED: 'green',
  PRE_TRIP: 'purple',
  IN_PROGRESS: 'orange',
  COMPLETED: 'green',
  CANCELLED: 'red',
  REFUNDED: 'gray',
  // Payment status
  PENDING: 'yellow',
  DEPOSIT_PAID: 'blue',
  PAID: 'green',
  PARTIALLY_REFUNDED: 'orange',
  FAILED: 'red',
  // Departure status
  AVAILABLE: 'green',
  LIMITED: 'yellow',
  SOLD_OUT: 'red',
  // Inquiry status (IN_PROGRESS already defined above)
  REPLIED: 'green',
  CLOSED: 'gray',
  SPAM: 'red',
  // Gear unit status
  RENTED: 'blue',
  MAINTENANCE: 'yellow',
  RETIRED: 'gray',
  // Gear rental status
  RESERVED: 'blue',
  CHECKED_OUT: 'orange',
  RETURNED: 'green',
  LATE: 'red',
  DAMAGED: 'red',
  LOST: 'red',
};

const variantStyles: Record<Variant, string> = {
  blue: 'bg-blue-50 text-blue-700 ring-blue-200',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  yellow: 'bg-yellow-50 text-yellow-700 ring-yellow-200',
  red: 'bg-red-50 text-red-700 ring-red-200',
  gray: 'bg-gray-100 text-gray-600 ring-gray-200',
  purple: 'bg-purple-50 text-purple-700 ring-purple-200',
  orange: 'bg-orange-50 text-orange-700 ring-orange-200',
};

type Props = {
  status: string;
  className?: string;
};

export function StatusBadge({ status, className }: Props) {
  if (!status) return null;
  const variant = statusMap[status] ?? 'gray';
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        variantStyles[variant],
        className
      )}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}
