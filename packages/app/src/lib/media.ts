import type {Media} from '@/payload-types';

export interface MediaSlot {
  key?: string | null;
  image?: number | Media | null;
  alt?: string | null;
  caption?: string | null;
}

export const mediaUrl = (m?: number | Media | null): string | undefined =>
  m && typeof m === 'object' ? (m.url ?? undefined) : undefined;

export const mediaSlot = (
  slots: MediaSlot[] | null | undefined,
  key: string,
): MediaSlot | undefined => slots?.find(slot => slot?.key === key);
