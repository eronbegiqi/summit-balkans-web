'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { MonthlyPoint } from '@/lib/db/queries/dashboard';

function formatMonth(month: string) {
  const [year, m] = month.split('-');
  return new Date(parseInt(year), parseInt(m) - 1).toLocaleDateString('en-GB', {
    month: 'short',
    year: '2-digit',
  });
}

export function BookingsBarChart({ data }: { data: MonthlyPoint[] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">Bookings — Last 6 Months</h3>
      {data.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-sm text-gray-400">No data yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tickFormatter={formatMonth} tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(v) => [v, 'Bookings']}
              labelFormatter={(label) => formatMonth(String(label))}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Bar dataKey="value" fill="#2e8a57" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function RevenueLineChart({ data }: { data: MonthlyPoint[] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">Revenue (€) — Last 6 Months</h3>
      {data.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-sm text-gray-400">No data yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tickFormatter={formatMonth} tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `€${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
            <Tooltip
              formatter={(v) => [`€${Number(v).toLocaleString()}`, 'Revenue']}
              labelFormatter={(label) => formatMonth(String(label))}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Line dataKey="value" stroke="#2e8a57" strokeWidth={2} dot={{ fill: '#2e8a57', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
