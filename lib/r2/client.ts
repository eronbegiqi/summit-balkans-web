import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.R2_PUBLIC_URL!;

export type ImageVariants = {
  original: string;
  large: string;
  medium: string;
  thumb: string;
};

/**
 * Upload a raw buffer directly to R2 under the given key.
 */
export async function uploadImage(
  buffer: Buffer,
  key: string,
  contentType = 'image/webp'
): Promise<string> {
  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );
  return `${PUBLIC_URL}/${key}`;
}

/**
 * Delete an object from R2 by key.
 */
export async function deleteImage(key: string): Promise<void> {
  await r2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

/**
 * Accepts a File (from FormData) or Buffer, generates 4 size variants via
 * sharp, uploads all to R2, and returns their public URLs.
 *
 * Key structure: uploads/{folder}/{basename}-{variant}.webp
 */
export async function optimizeAndUploadImage(
  file: File | Buffer,
  folder: string,
  basename: string
): Promise<ImageVariants> {
  const buffer = file instanceof File
    ? Buffer.from(await file.arrayBuffer())
    : file;

  const pipeline = sharp(buffer).rotate(); // auto-orient from EXIF

  const [thumbBuf, mediumBuf, largeBuf] = await Promise.all([
    pipeline.clone().resize(300, 300, { fit: 'cover' }).webp({ quality: 80 }).toBuffer(),
    pipeline.clone().resize(800, undefined, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toBuffer(),
    pipeline.clone().resize(1600, undefined, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 90 }).toBuffer(),
  ]);

  // Detect original content type
  const originalContentType = file instanceof File ? file.type : 'image/jpeg';

  const prefix = `uploads/${folder}/${basename}`;

  const [thumb, medium, large, original] = await Promise.all([
    uploadImage(thumbBuf, `${prefix}-thumb.webp`),
    uploadImage(mediumBuf, `${prefix}-medium.webp`),
    uploadImage(largeBuf, `${prefix}-large.webp`),
    uploadImage(buffer, `${prefix}-original`, originalContentType),
  ]);

  return { original, large, medium, thumb };
}

/**
 * Extract the R2 key from a public URL (for deletion).
 */
export function urlToKey(url: string): string {
  return url.replace(`${PUBLIC_URL}/`, '');
}
