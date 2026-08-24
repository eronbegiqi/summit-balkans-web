import { GuideForm } from '@/components/admin/guides/guide-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function NewGuidePage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/guides" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-3.5 w-3.5" /> Guides
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">New Guide</h1>
      </div>
      <GuideForm />
    </div>
  );
}
