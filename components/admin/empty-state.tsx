import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';

type Props = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
};

export function EmptyState({
  title = 'Nothing here yet',
  description = 'Items will appear here once they are created.',
  action,
  icon: Icon = Inbox,
  className,
}: Props) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 px-8 py-16 text-center', className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-gray-700">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-gray-400">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
