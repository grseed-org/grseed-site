import {Buffer} from 'node:buffer';

import {mediaAssets} from '@grseed/seed';
import type {File as PayloadFile, Payload} from 'payload';

const PUBLIC_MEDIA_ORIGIN = 'https://www.grseed.com';

export const publicMediaFileUrl = (filename: string) =>
  `${PUBLIC_MEDIA_ORIGIN}/api/media/file/${filename}`;

function mimeFromFilename(filename: string): string {
  if (filename.endsWith('.png')) return 'image/png';
  if (filename.endsWith('.webp')) return 'image/webp';
  if (filename.endsWith('.gif')) return 'image/gif';
  return 'image/jpeg';
}

async function downloadProductionFile(filename: string): Promise<PayloadFile> {
  const url = publicMediaFileUrl(filename);
  const response = await fetch(url, {redirect: 'follow'});
  const contentType = response.headers.get('content-type') ?? '';
  if (!response.ok || !contentType.startsWith('image/')) {
    throw new Error(
      `[media] failed to fetch ${url}: ${response.status} ${contentType}`,
    );
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.byteLength === 0) {
    throw new Error(`[media] empty response from ${url}`);
  }
  return {
    data: bytes,
    mimetype: contentType.split(';')[0] || mimeFromFilename(filename),
    name: filename,
    size: bytes.byteLength,
  };
}

export async function seedMediaAssets(payload: Payload): Promise<void> {
  payload.logger.info(
    `[media] seeding ${mediaAssets.length} assets from ${PUBLIC_MEDIA_ORIGIN}`,
  );

  for (const asset of mediaAssets) {
    payload.logger.info(`[media] checking ${asset.key}`);
    const existing = await payload.find({
      collection: 'media',
      where: {assetKey: {equals: asset.key}},
      limit: 1,
    });

    const data = {
      alt: asset.alt,
      assetKey: asset.key,
      sourcePath: asset.sourcePath,
      sourceUrl: asset.sourceUrl,
    };

    if (existing.docs[0]) {
      payload.logger.info(`[media] skip ${asset.key} (already exists)`);
      continue;
    }

    payload.logger.info(`[media] importing ${asset.key}`);
    await payload.create({
      collection: 'media',
      data,
      file: await downloadProductionFile(asset.filename),
    });
    payload.logger.info(`[media] imported ${asset.key}`);
  }

  payload.logger.info('[media] import complete');
}
