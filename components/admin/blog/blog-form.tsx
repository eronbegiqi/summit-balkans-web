'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { saveBlogPost } from '@/lib/actions/content';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { ImageUploader } from '@/components/admin/image-uploader';
import { DeleteBlogPostButton } from '@/components/admin/blog/delete-blog-post-button';
import type { BlogPostWithAuthor } from '@/lib/db/queries/blog';

type Props = { post: BlogPostWithAuthor | null };

const CATEGORIES = ['TRAVEL_TIPS', 'DESTINATION_GUIDE', 'EQUIPMENT', 'STORIES', 'NEWS'] as const;
const CATEGORY_LABELS: Record<string, string> = {
  TRAVEL_TIPS: 'Travel Tips', DESTINATION_GUIDE: 'Destination Guide',
  EQUIPMENT: 'Equipment', STORIES: 'Stories', NEWS: 'News',
};

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

export function BlogForm({ post }: Props) {
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [category, setCategory] = useState<typeof CATEGORIES[number]>(post?.category ?? 'STORIES');
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle ?? '');
  const [seoDescription, setSeoDescription] = useState(post?.seoDescription ?? '');
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string | null>(post?.featuredImageUrl ?? null);
  const [published, setPublished] = useState(post?.published ?? false);

  const inputCls = 'w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500';
  const labelCls = 'mb-1.5 block text-sm font-medium text-gray-700';

  function save() {
    if (!title || !slug) { toast.error('Title and slug are required'); return; }
    startTransition(async () => {
      await saveBlogPost(post?.id ?? null, {
        title, slug, excerpt: excerpt || undefined, content: content || undefined,
        category: category as typeof CATEGORIES[number],
        featuredImageUrl: featuredImageUrl || undefined,
        seoTitle: seoTitle || undefined, seoDescription: seoDescription || undefined,
        published,
      });
      toast.success('Post saved');
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          {post && (
            <Link href="/admin/blog" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900">
              ← Back to blog posts
            </Link>
          )}
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{post ? `Edit: ${post.title}` : 'New Post'}</h1>
        </div>
        <button onClick={save} disabled={pending} className="rounded-lg px-5 py-2 text-sm font-semibold text-white disabled:opacity-60" style={{ backgroundColor: '#2e8a57' }}>
          {pending ? 'Saving…' : 'Save post'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className={labelCls}>Title</label>
            <input value={title} onChange={(e) => { setTitle(e.target.value); if (!post) setSlug(slugify(e.target.value)); }} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Slug</label>
            <input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} className={`${inputCls} font-mono`} />
          </div>
          <div>
            <label className={labelCls}>Excerpt</label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className={labelCls}>Content</label>
            <RichTextEditor value={content} onChange={setContent} placeholder="Write your post…" />
          </div>
          <div>
            <label className={labelCls}>SEO title</label>
            <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className={inputCls} maxLength={60} />
          </div>
          <div>
            <label className={labelCls}>SEO description</label>
            <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={2} className={`${inputCls} resize-none`} maxLength={160} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Settings</h3>
            <div>
              <label className={labelCls}>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as typeof CATEGORIES[number])} className={inputCls}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="rounded" />
              <span className="text-sm text-gray-700">{published ? 'Published' : 'Draft'}</span>
            </label>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <label className="mb-3 block text-sm font-semibold text-gray-900">Featured image</label>
            <ImageUploader
              value={featuredImageUrl ? { original: featuredImageUrl, large: featuredImageUrl, medium: featuredImageUrl, thumb: featuredImageUrl } : null}
              onChange={(img) => setFeaturedImageUrl(img?.large ?? null)}
              folder="blog"
            />
          </div>
          <button onClick={save} disabled={pending} className="w-full rounded-lg py-3 text-sm font-semibold text-white disabled:opacity-60" style={{ backgroundColor: '#2e8a57' }}>
            {pending ? 'Saving…' : 'Save post'}
          </button>
          {post && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-5">
              <h3 className="text-sm font-semibold text-red-900">Danger zone</h3>
              <p className="mt-1.5 text-sm leading-6 text-red-700/80">
                Permanently delete this blog post from the site.
              </p>
              <div className="mt-4">
                <DeleteBlogPostButton postId={post.id} title={post.title} redirectTo="/admin/blog" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
