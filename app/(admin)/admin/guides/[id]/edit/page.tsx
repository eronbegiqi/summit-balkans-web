import { notFound } from 'next/navigation';
import { getGuideById } from '@/lib/db/queries/guides';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { GuideForm } from '@/components/admin/guides/guide-form';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = { params: Promise<{ id: string }> };

export default async function GuideEditPage({ params }: Props) {
  const { id } = await params;
  const guide = await getGuideById(parseInt(id));
  if (!guide) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/guides" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-3.5 w-3.5" /> Guides
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit: {guide.name}</h1>
      </div>
      <GuideForm guide={guide} />
    </div>
  );
}
