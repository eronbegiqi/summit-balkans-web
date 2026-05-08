import { notFound } from 'next/navigation';
import { getTourById } from '@/lib/db/queries/tours';
import { getGuides } from '@/lib/db/queries/guides';
import { TourForm } from '@/components/admin/tours/tour-form';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = { params: Promise<{ id: string }> };

export default async function TourEditPage({ params }: Props) {
  const { id } = await params;
  const [tour, guides] = await Promise.all([getTourById(parseInt(id)), getGuides()]);
  if (!tour) notFound();
  return <TourForm tour={tour} guides={guides} />;
}
