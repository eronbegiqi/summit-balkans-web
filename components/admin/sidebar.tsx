'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Backpack,
  CalendarDays,
  Calendar,
  FileText,
  Globe,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  Menu,
  Mountain,
  Settings,
  Star,
  UserCircle,
  Users,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
};

type NavGroup = { title?: string; items: NavItem[] };

type Props = {
  newBookingsCount: number;
  newInquiriesCount: number;
};

export function AdminSidebar({ newBookingsCount, newInquiriesCount }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile drawer after navigating.
  useEffect(() => setOpen(false), [pathname]);

  const groups: NavGroup[] = [
    { items: [{ label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard }] },
    {
      title: 'Sales',
      items: [
        { label: 'Bookings', href: '/admin/bookings', icon: Calendar, badge: newBookingsCount },
        { label: 'Inquiries', href: '/admin/inquiries', icon: Inbox, badge: newInquiriesCount },
        { label: 'Customers', href: '/admin/customers', icon: UserCircle },
      ],
    },
    {
      title: 'Trips',
      items: [
        { label: 'Tours', href: '/admin/tours', icon: Mountain },
        { label: 'Departures', href: '/admin/departures', icon: CalendarDays },
        { label: 'Destinations', href: '/admin/destinations', icon: Globe },
        { label: 'Guides', href: '/admin/guides', icon: Users },
        { label: 'Gear & Inventory', href: '/admin/gear', icon: Backpack },
      ],
    },
    {
      title: 'Website',
      items: [
        { label: 'Blog', href: '/admin/blog', icon: FileText },
        { label: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
        { label: 'Reviews', href: '/admin/reviews', icon: Star },
      ],
    },
    {
      title: 'Admin',
      items: [
        { label: 'Activity Log', href: '/admin/activity', icon: Activity },
        { label: 'Settings', href: '/admin/settings', icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="fixed left-3 top-[10px] z-40 flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile backdrop */}
      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col transition-transform duration-200 lg:z-40 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ backgroundColor: '#0E1310' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5">
          <img src="/logo-white.svg" alt="Summit Balkans" className="h-8 pt-2 w-auto" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="rounded-lg p-2 text-white/60 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {groups.map((group, i) => (
            <div key={group.title ?? i} className={cn(i > 0 && 'mt-5')}>
              {group.title && (
                <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                  {group.title}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map(({ label, href, icon: Icon, badge }) => {
                  const active = pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href));
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                          active ? 'text-white' : 'text-white/55 hover:bg-white/5 hover:text-white/80'
                        )}
                        style={active ? { backgroundColor: '#2e8a57' } : undefined}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1">{label}</span>
                        {badge !== undefined && badge > 0 && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-[11px] font-semibold text-white">
                            {badge > 99 ? '99+' : badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Admin badge */}
        <div className="shrink-0 border-t border-white/10 px-4 py-3">
          <p className="text-[10px] text-white/25 tracking-widest uppercase">Admin Panel v1</p>
        </div>
      </aside>
    </>
  );
}
