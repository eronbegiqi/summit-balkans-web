import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminTopbar } from '@/components/admin/topbar';
import { getNewBookingsCount, getNewInquiriesCount } from '@/lib/db/queries/dashboard';

// Admin routes must never be statically prerendered — they require auth + live DB
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [newBookingsCount, newInquiriesCount] = await Promise.all([
    getNewBookingsCount(),
    getNewInquiriesCount(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar
        newBookingsCount={newBookingsCount}
        newInquiriesCount={newInquiriesCount}
      />
      <div className="ml-[250px]">
        <AdminTopbar />
        <main className="min-h-[calc(100vh-60px)] p-8 pt-[calc(60px+32px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
