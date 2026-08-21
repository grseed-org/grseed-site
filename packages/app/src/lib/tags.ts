import 'server-only';

import type {Tag} from '@/payload-types';

import {getPayloadClient} from './payload';
import type {Locale, TagItem, TagListResponse} from './types';

export type WithLocale = {locale: Locale; draft?: boolean};

export const mapTag = (tag: Tag): TagItem => ({
  id: String(tag.id),
  name: tag.name,
  slug: tag.slug,
  kind: tag.kind ?? undefined,
  description: tag.description ?? undefined,
});

export const mapTags = (tags?: (number | Tag)[] | null): TagItem[] =>
  (tags ?? [])
    .map(t => (typeof t === 'object' ? mapTag(t) : undefined))
    .filter((t): t is TagItem => !!t);

export const normalizeTagSlugs = (
  value: string | string[] | undefined,
): string[] => {
  const values = Array.isArray(value) ? value : [value];
  return Array.from(
    new Set(
      values.map(item => item?.trim()).filter((item): item is string => !!item),
    ),
  );
};

export const hasAllTagIds = (tags: TagItem[], tagIds: number[]): boolean => {
  const ids = new Set(tags.map(tag => tag.id));
  return tagIds.every(id => ids.has(String(id)));
};

export async function resolveTagId(
  slug: string | undefined,
  opts: WithLocale,
): Promise<number | undefined> {
  if (!slug) return undefined;
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: 'tags',
    where: {
      slug: {equals: slug},
    },
    limit: 1,
    locale: opts.locale,
  });
  return res.docs[0]?.id;
}

export async function resolveTagIds(
  slugs: string[],
  opts: WithLocale,
): Promise<number[]> {
  if (slugs.length === 0) return [];
  const ids = await Promise.all(slugs.map(slug => resolveTagId(slug, opts)));
  return ids.filter((id): id is number => typeof id === 'number');
}

export async function listTags(
  opts: WithLocale & {limit?: number},
): Promise<TagListResponse> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: 'tags',
    where: {},
    limit: opts.limit ?? 200,
    sort: 'name',
    locale: opts.locale,
  });
  return {
    tags: res.docs.map(mapTag),
    total: res.totalDocs,
  };
}
