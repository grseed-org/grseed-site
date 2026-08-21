import 'server-only';

import type {Category} from '@/payload-types';

import {getPayloadClient} from './payload';
import type {CategoryItem, CategoryListResponse, Locale} from './types';

export type WithLocale = {locale: Locale; draft?: boolean};

export const mapCategory = (category: Category): CategoryItem => ({
  id: String(category.id),
  name: category.name,
  slug: category.slug,
  description: category.description ?? undefined,
});

export const mapCategories = (
  categories?: (number | Category)[] | null,
): CategoryItem[] =>
  (categories ?? [])
    .map(c => (typeof c === 'object' ? mapCategory(c) : undefined))
    .filter((c): c is CategoryItem => !!c);

export async function resolveCategoryId(
  slug: string | undefined,
  opts: WithLocale & {group: Category['group']},
): Promise<number | undefined> {
  if (!slug) return undefined;
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: 'categories',
    where: {
      slug: {equals: slug},
      group: {equals: opts.group},
    },
    limit: 1,
    locale: opts.locale,
  });
  return res.docs[0]?.id;
}

export async function listCategories(
  opts: WithLocale & {limit?: number; group: Category['group']},
): Promise<CategoryListResponse> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: 'categories',
    where: {group: {equals: opts.group}},
    limit: opts.limit ?? 200,
    sort: 'order',
    locale: opts.locale,
  });
  return {
    categories: res.docs.map(mapCategory),
    total: res.totalDocs,
  };
}
