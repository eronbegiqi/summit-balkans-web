import { getGalleryImages } from '@/lib/db/queries/gallery';
import { GalleryManager } from '@/components/admin/gallery/gallery-manager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Gallery</h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload photos for the homepage gallery and /gallery page. Uploads are converted to WebP automatically.
        </p>
      </div>

      <GalleryManager images={images} />
    </div>
  );
}
