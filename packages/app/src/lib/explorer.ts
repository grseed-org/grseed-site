import 'server-only';

import type {SectionConfig} from '@/data/sections';

import {listCategories} from './categories';
import {listPosts} from './post';
import {listProducts} from './product';
import {listTags, normalizeTagSlugs} from './tags';
import type {Locale, PostItem, ProductItem, SectionExplorerItem} from './types';

type SearchValue = string | string[] | undefined;

export type ExplorerSearch = {
  category?: SearchValue;
  tag?: SearchValue;
  q?: SearchValue;
};

const firstValue = (value: SearchValue): string | undefined =>
  Array.isArray(value) ? value[0] : value;

const productItem = (
  product: ProductItem,
  detailBasePath: string,
): SectionExplorerItem => ({
  id: product.id,
  slug: product.slug,
  title: product.name,
  summary: product.description,
  coverUrl: product.coverUrl,
  tags: product.tags.map(tag => tag.name),
  href: `${detailBasePath}/${product.slug}`,
});

const postItem = (
  post: PostItem,
  detailBasePath: string,
): SectionExplorerItem => ({
  id: post.id,
  slug: post.slug,
  title: post.title,
  summary: post.summary,
  coverUrl: post.coverUrl,
  tags: post.tags.map(tag => tag.name),
  href: `${detailBasePath}/${post.slug}`,
});

// Shared server loader for section list routes. The route supplies the section;
// post URLs narrow by category and tags, product URLs narrow by tags, and both
// accept q. Multiple tags are AND filters in the collection query.
export async function loadExplorer(
  locale: Locale,
  sp: ExplorerSearch,
  section: SectionConfig,
) {
  const tagSlugs = normalizeTagSlugs(sp.tag);
  const q = firstValue(sp.q);
  const filters = {
    tag: tagSlugs,
    q,
    limit: 30,
  };

  if (section.kind === 'product') {
    const [list, tagsRes] = await Promise.all([
      listProducts(filters, {locale}),
      listTags({locale, limit: 200}),
    ]);
    return {
      items: list.products.map(product =>
        productItem(product, section.detailBasePath),
      ),
      total: list.total,
      categories: [],
      tags: tagsRes.tags,
      activeTags: tagSlugs,
      activeQ: q ?? '',
    };
  }

  const category = firstValue(sp.category);
  const postFilters = {
    category,
    tag: tagSlugs,
    q,
    limit: 30,
  };

  const [list, categoriesRes, tagsRes] = await Promise.all([
    listPosts(section.postSection, postFilters, {locale}),
    listCategories({locale, limit: 200, group: section.postSection}),
    listTags({locale, limit: 200}),
  ]);

  return {
    items: list.posts.map(post => postItem(post, section.detailBasePath)),
    total: list.total,
    categories: categoriesRes.categories,
    tags: tagsRes.tags,
    activeCategory: category,
    activeTags: tagSlugs,
    activeQ: q ?? '',
  };
}
