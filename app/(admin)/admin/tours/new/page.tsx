import { getGuides } from '@/lib/db/queries/guides';
import { TourForm } from '@/components/admin/tours/tour-form';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function NewTourPage() {
  const guides = await getGuides();
  return <TourForm tour={null} guides={guides} />;
}
