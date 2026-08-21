import 'server-only';

import type {Where} from 'payload';

import type {Credential, Media, Product} from '@/payload-types';

import {getPayloadClient} from './payload';
import {
  hasAllTagIds,
  mapTags,
  normalizeTagSlugs,
  resolveTagIds,
  type WithLocale,
} from './tags';
import type {ProductItem, ProductListResponse, SectionFilters} from './types';

const MULTI_TAG_CANDIDATE_LIMIT = 1000;

const mediaUrl = (m?: (number | null) | Media): string | undefined =>
  m && typeof m === 'object' ? (m.url ?? undefined) : undefined;

const mediaAlt = (m?: (number | null) | Media): string | undefined =>
  m && typeof m === 'object' ? (m.alt ?? undefined) : undefined;

type ImageItem = {url: string; alt?: string; caption?: string};

const isImageItem = (item: ImageItem | undefined): item is ImageItem =>
  item !== undefined;

const mapCredential = (credential: Credential) => ({
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

const mapProduct = (product: Product): ProductItem => ({
  id: String(product.id),
  slug: product.slug,
  name: product.name,
  description: product.description ?? undefined,
  body: product.body ?? undefined,
  coverUrl: mediaUrl(product.gallery?.[0]?.image) ?? undefined,
  facts: (product.facts ?? []).map(item => ({
    group: item.group,
    label: item.label,
    value: item.value,
  })),
  gallery: (product.gallery ?? [])
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
  credentials: (product.credentials ?? [])
    .map(item => (typeof item === 'object' ? mapCredential(item) : undefined))
    .filter((item): item is ReturnType<typeof mapCredential> => !!item),
  tags: mapTags(product.tags),
  publishedAt: product.publishedAt ?? undefined,
  updatedAt: product.updatedAt,
});

function productWhere(filters: SectionFilters, tagIds: number[]): Where {
  const where: Where = {};
  if (tagIds.length > 0) {
    where.tags = {in: tagIds};
  }
  if (filters.q) {
    where.or = [
      {name: {contains: filters.q}},
      {description: {contains: filters.q}},
    ];
  }
  return where;
}

export async function listProducts(
  filters: SectionFilters,
  opts: WithLocale,
): Promise<ProductListResponse> {
  const tagSlugs = normalizeTagSlugs(filters.tag);
  const tagIds = await resolveTagIds(tagSlugs, opts);
  if (tagSlugs.length !== tagIds.length) return {products: [], total: 0};
  const limit = filters.limit ?? 30;
  const multiTagAnd = tagIds.length > 1;

  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: 'products',
    where: productWhere(filters, tagIds),
    limit: multiTagAnd ? MULTI_TAG_CANDIDATE_LIMIT : limit,
    sort: 'displayOrder',
    depth: 2,
    locale: opts.locale,
    draft: opts.draft,
  });
  const products = res.docs.map(mapProduct);
  if (!multiTagAnd) return {products, total: res.totalDocs ?? products.length};

  // Payload relationship predicates reliably find candidates with any selected
  // tag; requiring every selected tag is checked after relation hydration.
  const filtered = products.filter(product =>
    hasAllTagIds(product.tags, tagIds),
  );
  return {products: filtered.slice(0, limit), total: filtered.length};
}

export async function getProductBySlug(
  slug: string,
  opts: WithLocale,
): Promise<ProductItem | undefined> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: 'products',
    where: {
      slug: {equals: slug},
    },
    limit: 1,
    depth: 2,
    locale: opts.locale,
    draft: opts.draft,
  });
  return res.docs[0] ? mapProduct(res.docs[0]) : undefined;
}
