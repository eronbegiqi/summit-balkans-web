'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Backpack,
  CalendarDays,
  Calendar,
  FileText,
  Globe,
  Inbox,
  LayoutDashboard,
  Mountain,
  Settings,
  Star,
  UserCircle,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
};

type Props = {
  newBookingsCount: number;
  newInquiriesCount: number;
};

export function AdminSidebar({ newBookingsCount, newInquiriesCount }: Props) {
  const pathname = usePathname();

  const nav: NavItem[] = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Bookings', href: '/admin/bookings', icon: Calendar, badge: newBookingsCount },
    { label: 'Inquiries', href: '/admin/inquiries', icon: Inbox, badge: newInquiriesCount },
    { label: 'Tours', href: '/admin/tours', icon: Mountain },
    { label: 'Departures', href: '/admin/departures', icon: CalendarDays },
    { label: 'Destinations', href: '/admin/destinations', icon: Globe },
    { label: 'Guides', href: '/admin/guides', icon: Users },
    { label: 'Gear & Inventory', href: '/admin/gear', icon: Backpack },
    { label: 'Customers', href: '/admin/customers', icon: UserCircle },
    { label: 'Blog', href: '/admin/blog', icon: FileText },
    { label: 'Reviews', href: '/admin/reviews', icon: Star },
    { label: 'Activity Log', href: '/admin/activity', icon: Activity },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[250px] flex-col" style={{ backgroundColor: '#0E1310' }}>
      {/* Logo */}
      <div className="flex h-[60px] shrink-0 items-center border-b border-white/10 px-6">
        <span className="text-sm font-bold tracking-wider text-white" style={{ fontFamily: 'monospace', letterSpacing: '0.1em' }}>
          SUMMIT BALKANS
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {nav.map(({ label, href, icon: Icon, badge }) => {
            const active = pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href));
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'text-white'
                      : 'text-white/55 hover:bg-white/5 hover:text-white/80'
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
      </nav>

      {/* Admin badge */}
      <div className="shrink-0 border-t border-white/10 px-4 py-3">
        <p className="text-[10px] font-mono text-white/25 tracking-widest uppercase">Admin Panel v1</p>
      </div>
    </aside>
  );
}
