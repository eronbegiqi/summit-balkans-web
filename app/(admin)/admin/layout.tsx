import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminTopbar } from '@/components/admin/topbar';
import { getNewBookingsCount, getNewInquiriesCount } from '@/lib/db/queries/dashboard';
import { isDbOffline } from '@/lib/db/cache';

// Admin routes must never be statically prerendered — they require auth + live DB
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [newBookingsCount, newInquiriesCount] = await Promise.all([
    getNewBookingsCount(),
    getNewInquiriesCount(),
  ]);

  // The count queries above just hit the DB; if they failed to connect, we're
  // serving cached snapshots and should tell the admin the data may be stale.
  const offline = isDbOffline();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar
        newBookingsCount={newBookingsCount}
        newInquiriesCount={newInquiriesCount}
      />
      <div className="ml-[250px]">
        <AdminTopbar />
        {offline && (
          <div className="fixed right-4 top-[72px] z-40 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2 text-sm text-amber-800 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Offline — showing the last data loaded while connected
          </div>
        )}
        <main className="min-h-[calc(100vh-60px)] p-8 pt-[calc(60px+32px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
