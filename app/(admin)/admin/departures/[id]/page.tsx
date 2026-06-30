import { notFound } from 'next/navigation';
import { getDepartureById } from '@/lib/db/queries/departures';
import { getTours } from '@/lib/db/queries/tours';
import { getGuides } from '@/lib/db/queries/guides';
import { DepartureForm } from '@/components/admin/departures/departure-form';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = { params: Promise<{ id: string }> };

export default async function DepartureEditPage({ params }: Props) {
  const { id } = await params;
  const [departure, tours, guides] = await Promise.all([
    getDepartureById(parseInt(id)),
    getTours(),
    getGuides(),
  ]);
  if (!departure) notFound();
  return <DepartureForm departure={departure} tours={tours} guides={guides} />;
}
