import Link from 'next/link';
import { getBlogPosts } from '@/lib/db/queries/blog';
import { toggleBlogPublished } from '@/lib/actions/content';
import { EmptyState } from '@/components/admin/empty-state';
import { FileText, Plus } from 'lucide-react';

const CATEGORY_LABELS: Record<string, string> = {
  TRAVEL_TIPS: 'Travel Tips',
  DESTINATION_GUIDE: 'Destination Guide',
  EQUIPMENT: 'Equipment',
  STORIES: 'Stories',
  NEWS: 'News',
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Blog</h1>
        <Link href="/admin/blog/new" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: '#2e8a57' }}>
          <Plus className="h-4 w-4" /> New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <EmptyState icon={FileText} title="No blog posts" description="Write your first post." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Title', 'Category', 'Author', 'Published', 'Status', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 max-w-[260px] truncate">{p.title}</p>
                    <p className="text-xs text-gray-400 font-mono">{p.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{CATEGORY_LABELS[p.category] ?? p.category}</td>
                  <td className="px-4 py-3 text-gray-500">{p.author?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {p.publishedAt ? String(p.publishedAt).split('T')[0] : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <form action={async () => { 'use server'; await toggleBlogPublished(p.id, !p.published); }}>
                      <button type="submit" className={`rounded-full px-2.5 py-1 text-xs font-medium ${p.published ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.published ? 'Live' : 'Draft'}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/blog/${p.id}/edit`} className="text-xs font-medium text-emerald-600 hover:underline">Edit →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
