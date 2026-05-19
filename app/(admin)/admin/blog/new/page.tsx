import { BlogForm } from '@/components/admin/blog/blog-form';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export default function NewBlogPostPage() { return <BlogForm post={null} />; }
