import 'server-only';

import type {Credential, Media} from '@/payload-types';

import {getPayloadClient} from './payload';
import type {CredentialItem, Locale} from './types';

const mediaUrl = (m?: number | Media | null): string | undefined =>
  m && typeof m === 'object' ? (m.url ?? undefined) : undefined;

const mediaAlt = (m?: number | Media | null): string | undefined =>
  m && typeof m === 'object' ? (m.alt ?? undefined) : undefined;

type ImageItem = {url: string; alt?: string; caption?: string};

const isImageItem = (item: ImageItem | undefined): item is ImageItem =>
  item !== undefined;

export const mapCredential = (credential: Credential): CredentialItem => ({
  id: String(credential.id),
  slug: credential.slug,
  title: credential.title,
  type: credential.type,
  level: credential.level ?? undefined,
  summary: credential.summary ?? undefined,
  year: credential.year ?? undefined,
  displayOrder: credential.displayOrder ?? undefined,
  documentImages: (credential.documentImages ?? [])
    .map(item => {
      const url = mediaUrl(item.image);
      return url
        ? {
            url,
            ...(mediaAlt(item.image) ? {alt: mediaAlt(item.image)} : {}),
            ...(item.caption ? {caption: item.caption} : {}),
          }
        : undefined;
    })
    .filter(isImageItem),
});

export async function listCredentials(locale: Locale): Promise<CredentialItem[]> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: 'credentials',
    where: {},
    limit: 200,
    sort: 'displayOrder',
    depth: 1,
    locale,
  });
  return res.docs.map(mapCredential);
}
