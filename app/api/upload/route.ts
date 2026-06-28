import { NextRequest, NextResponse } from 'next/server';
import { getMissingR2ConfigKeys, optimizeAndUploadImage } from '@/lib/r2/client';
import { getSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  // Only authenticated admins can upload
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const missingConfig = getMissingR2ConfigKeys();
  if (missingConfig.length > 0) {
    return NextResponse.json(
      { error: `Upload storage is not configured. Missing: ${missingConfig.join(', ')}` },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = (formData.get('folder') as string) || 'general';

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const basename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const variants = await optimizeAndUploadImage(file, folder, basename);

    return NextResponse.json(variants);
  } catch (error) {
    console.error('Image upload failed:', error);
    return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
  }
}
