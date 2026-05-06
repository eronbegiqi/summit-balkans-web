import { notFound } from 'next/navigation';
import { getBlogPostById } from '@/lib/db/queries/blog';
import { BlogForm } from '@/components/admin/blog/blog-form';

type Props = { params: Promise<{ id: string }> };

export default async function BlogEditPage({ params }: Props) {
  const { id } = await params;
  const post = await getBlogPostById(parseInt(id));
  if (!post) notFound();
  return <BlogForm post={post} />;
}
