import 'server-only';

import type {Where} from 'payload';

import type {Credential, Media, Post} from '@/payload-types';

import {getPayloadClient} from './payload';
import {mapCategory, resolveCategoryId} from './categories';
import {
  hasAllTagIds,
  mapTags,
  normalizeTagSlugs,
  resolveTagIds,
  type WithLocale,
} from './tags';
import type {
  CredentialItem,
  PostItem,
  PostListResponse,
  PostSection,
  SectionFilters,
} from './types';

const MULTI_TAG_CANDIDATE_LIMIT = 1000;

const mediaUrl = (m?: (number | null) | Media): string | undefined =>
  m && typeof m === 'object' ? (m.url ?? undefined) : undefined;

const mediaAlt = (m?: (number | null) | Media): string | undefined =>
  m && typeof m === 'object' ? (m.alt ?? undefined) : undefined;

type ImageItem = {url: string; alt?: string; caption?: string};

const isImageItem = (item: ImageItem | undefined): item is ImageItem =>
  item !== undefined;

const asCredential = (
  value: number | Credential | null | undefined,
): Credential | undefined =>
  value && typeof value === 'object' ? value : undefined;

const firstCredentialDocumentUrl = (
  credential: Credential | undefined,
): string | undefined => mediaUrl(credential?.documentImages?.[0]?.image);

const mapCredential = (credential: Credential): CredentialItem => ({
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

const mapPost = (post: Post): PostItem => {
  const credentialDocs = (post.credentials ?? [])
    .map(asCredential)
    .filter((item): item is Credential => !!item);
  const coverCredential = asCredential(post.coverCredential);
  const derivedCoverCredential = coverCredential ?? credentialDocs[0];

  return {
    id: String(post.id),
    slug: post.slug,
    title: post.title,
    summary: post.summary ?? undefined,
    content: post.content ?? undefined,
    coverUrl:
      mediaUrl(post.cover) ??
      firstCredentialDocumentUrl(derivedCoverCredential) ??
      undefined,
    category:
      post.category && typeof post.category === 'object'
        ? mapCategory(post.category)
        : undefined,
    credentials: credentialDocs
      .map(item => (typeof item === 'object' ? mapCredential(item) : undefined))
      .filter((item): item is CredentialItem => !!item),
    tags: mapTags(post.tags),
    publishedAt: post.publishedAt ?? undefined,
    updatedAt: post.updatedAt,
  };
};

function postWhere(
  section: PostSection,
  filters: SectionFilters,
  categoryId: number | undefined,
  tagIds: number[],
): Where {
  const where: Where = {'category.group': {equals: section}};
  if (categoryId) where.category = {equals: categoryId};
  if (tagIds.length > 0) {
    where.tags = {in: tagIds};
  }
  if (filters.q) {
    where.or = [
      {title: {contains: filters.q}},
      {content: {contains: filters.q}},
    ];
  }
  return where;
}

export async function listPosts(
  section: PostSection,
  filters: SectionFilters,
  opts: WithLocale,
): Promise<PostListResponse> {
  const tagSlugs = normalizeTagSlugs(filters.tag);
  const [categoryId, tagIds] = await Promise.all([
    resolveCategoryId(filters.category, {...opts, group: section}),
    resolveTagIds(tagSlugs, opts),
  ]);
  if (filters.category && !categoryId) return {posts: [], total: 0};
  if (tagSlugs.length !== tagIds.length) return {posts: [], total: 0};
  const limit = filters.limit ?? 30;
  const multiTagAnd = tagIds.length > 1;

  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: 'posts',
    where: postWhere(section, filters, categoryId, tagIds),
    limit: multiTagAnd ? MULTI_TAG_CANDIDATE_LIMIT : limit,
    sort: '-publishedAt',
    depth: 2,
    locale: opts.locale,
    draft: opts.draft,
  });
  const posts = res.docs.map(mapPost);
  if (!multiTagAnd) return {posts, total: res.totalDocs ?? posts.length};

  // Payload relationship predicates reliably find candidates with any selected
  // tag; requiring every selected tag is checked after relation hydration.
  const filtered = posts.filter(post => hasAllTagIds(post.tags, tagIds));
  return {posts: filtered.slice(0, limit), total: filtered.length};
}

export async function getPostBySlug(
  section: PostSection,
  slug: string,
  opts: WithLocale,
): Promise<PostItem | undefined> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: 'posts',
    where: {
      slug: {equals: slug},
      'category.group': {equals: section},
    },
    limit: 1,
    depth: 2,
    locale: opts.locale,
    draft: opts.draft,
  });
  return res.docs[0] ? mapPost(res.docs[0]) : undefined;
}
