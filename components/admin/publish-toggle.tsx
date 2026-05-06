'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import * as Switch from '@radix-ui/react-switch';

type Props = {
  published: boolean;
  onToggle: (published: boolean) => Promise<void>;
  label?: string;
};

export function PublishToggle({ published, onToggle, label = 'Published' }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-400">
          {published ? 'Visible on the public website' : 'Hidden from the public website'}
        </p>
      </div>
      <Switch.Root
        checked={published}
        onCheckedChange={(checked) =>
          startTransition(async () => {
            await onToggle(checked);
            toast.success(checked ? 'Published' : 'Unpublished');
          })
        }
        disabled={pending}
        className="relative h-6 w-11 cursor-pointer rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-50 data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-gray-200"
      >
        <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow-md transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[22px]" />
      </Switch.Root>
    </div>
  );
}
