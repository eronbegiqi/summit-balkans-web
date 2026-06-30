import { getTours } from '@/lib/db/queries/tours';
import { getGuides } from '@/lib/db/queries/guides';
import { DepartureForm } from '@/components/admin/departures/departure-form';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function NewDeparturePage() {
  const [tours, guides] = await Promise.all([getTours(), getGuides()]);
  return <DepartureForm departure={null} tours={tours} guides={guides} />;
}
