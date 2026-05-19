import Link from 'next/link';
import { Calendar, DollarSign, Inbox, TrendingUp } from 'lucide-react';
import {
  getDashboardStats,
  getBookingsChartData,
  getRevenueChartData,
  getRecentBookings,
  getRecentInquiries,
  getUpcomingDepartures,
} from '@/lib/db/queries/dashboard';
import { BookingsBarChart, RevenueLineChart } from '@/components/admin/dashboard/charts';
import { StatusBadge } from '@/components/admin/status-badge';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  const [stats, bookingsChart, revenueChart, recentBookings, recentInquiries, upcomingDepartures] =
    await Promise.all([
      getDashboardStats(),
      getBookingsChartData(),
      getRevenueChartData(),
      getRecentBookings(),
      getRecentInquiries(),
      getUpcomingDepartures(),
    ]);

  const statCards = [
    {
      label: 'Pending Bookings',
      value: stats.pendingBookings,
      icon: Calendar,
      href: '/admin/bookings?status=NEW',
      color: '#3b82f6',
    },
    {
      label: 'Revenue This Month',
      value: `€${stats.revenueThisMonth.toLocaleString()}`,
      icon: DollarSign,
      href: '/admin/bookings',
      color: '#2e8a57',
    },
    {
      label: 'Upcoming Departures',
      value: stats.upcomingDepartures,
      icon: TrendingUp,
      href: '/admin/departures',
      color: '#8b5cf6',
    },
    {
      label: 'Open Inquiries',
      value: stats.openInquiries,
      icon: Inbox,
      href: '/admin/inquiries',
      color: '#f59e0b',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of Summit Balkans operations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{label}</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{value}</p>
              </div>
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${color}18` }}
              >
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <BookingsBarChart data={bookingsChart} />
        <RevenueLineChart data={revenueChart} />
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent Bookings */}
        <div className="xl:col-span-2 rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-sm font-semibold text-gray-900">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-xs font-medium text-emerald-600 hover:underline">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            {recentBookings.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-gray-400">No bookings yet</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50">
                    {['Reference', 'Customer', 'Tour', 'Total', 'Payment', 'Status'].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link href={`/admin/bookings/${b.id}`} className="font-mono text-xs font-semibold text-emerald-700 hover:underline">
                          {b.bookingReference}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{b.customerName}</td>
                      <td className="px-4 py-3 text-gray-500 max-w-[160px] truncate">{b.tourTitle}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">€{parseFloat(b.totalEur).toLocaleString()}</td>
                      <td className="px-4 py-3"><StatusBadge status={b.paymentStatus} /></td>
                      <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Recent Inquiries */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-900">Recent Inquiries</h2>
              <Link href="/admin/inquiries" className="text-xs font-medium text-emerald-600 hover:underline">
                View all →
              </Link>
            </div>
            {recentInquiries.length === 0 ? (
              <p className="px-5 py-6 text-center text-sm text-gray-400">No inquiries yet</p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {recentInquiries.map((inq) => (
                  <li key={inq.id}>
                    <Link href={`/admin/inquiries/${inq.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-800">{inq.name}</p>
                        <p className="text-xs text-gray-400">{inq.type.replace('_', ' ')}</p>
                      </div>
                      <StatusBadge status={inq.status} className="ml-3 shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Upcoming Departures */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-900">Upcoming Departures</h2>
              <Link href="/admin/departures" className="text-xs font-medium text-emerald-600 hover:underline">
                View all →
              </Link>
            </div>
            {upcomingDepartures.length === 0 ? (
              <p className="px-5 py-6 text-center text-sm text-gray-400">No upcoming departures</p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {upcomingDepartures.map((dep) => {
                  const spotsLeft = dep.capacity - dep.bookedCount;
                  const pct = (dep.bookedCount / dep.capacity) * 100;
                  return (
                    <li key={dep.id} className="px-5 py-3">
                      <p className="truncate text-sm font-medium text-gray-800">{dep.tourTitle}</p>
                      <p className="text-xs text-gray-400">{dep.startDate}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 overflow-hidden rounded-full bg-gray-100 h-1.5">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min(pct, 100)}%`,
                              backgroundColor: pct >= 90 ? '#ef4444' : pct >= 60 ? '#f59e0b' : '#2e8a57',
                            }}
                          />
                        </div>
                        <span className="shrink-0 text-xs text-gray-500">{spotsLeft} left</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
