import { getGuides } from '@/lib/db/queries/guides';
import { TourForm } from '@/components/admin/tours/tour-form';

export default async function NewTourPage() {
  const guides = await getGuides();
  return <TourForm tour={null} guides={guides} />;
}
