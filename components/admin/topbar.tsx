import { headers } from 'next/headers';
import { logout } from '@/lib/auth/actions';
import { LogOut } from 'lucide-react';

type Props = {
  breadcrumbs?: { label: string; href?: string }[];
};

export async function AdminTopbar({ breadcrumbs = [] }: Props) {
  const h = await headers();
  const adminName = h.get('x-admin-name') ?? 'Admin';
  const initials = adminName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="fixed inset-x-0 top-0 z-30 ml-[250px] flex h-[60px] items-center justify-between border-b border-gray-100 bg-white px-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm">
        <span className="text-gray-400">Admin</span>
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="text-gray-300">/</span>
            {crumb.href ? (
              <a href={crumb.href} className="text-gray-500 hover:text-gray-800 transition-colors">
                {crumb.label}
              </a>
            ) : (
              <span className="font-medium text-gray-800">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* User */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: '#2e8a57' }}
        >
          {initials}
        </div>
        <span className="text-sm font-medium text-gray-700 hidden sm:block">{adminName}</span>
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
