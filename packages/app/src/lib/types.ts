/**
 * Frontend + CMS-content locale codes. Intentionally `zh-hans` (not `zh`) — the
 * Payload admin-UI language pack is keyed `zh` separately; do not unify them.
 */
export type Locale = 'en' | 'zh-hans';

export interface TagItem {
  id: string;
  name: string;
  slug: string;
  kind?: 'crop' | 'lineage' | 'series' | 'trait' | 'region';
  description?: string;
}

export interface TagListResponse {
  tags: TagItem[];
  total?: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface CategoryListResponse {
  categories: CategoryItem[];
  total?: number;
}

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  description?: string;
  body?: unknown;
  coverUrl?: string;
  facts: Array<{
    group:
      | 'overview'
      | 'yield'
      | 'quality'
      | 'resistance'
      | 'cultivation'
      | 'region';
    label: string;
    value: string;
  }>;
  gallery: Array<{url: string; alt?: string; caption?: string}>;
  credentials: CredentialItem[];
  tags: TagItem[];
  publishedAt?: string;
  updatedAt?: string;
}

export interface ProductListResponse {
  products: ProductItem[];
  total?: number;
}

export type PostSection = 'blog' | 'service' | 'research' | 'hr';

export interface PostItem {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  content?: unknown;
  coverUrl?: string;
  category?: CategoryItem;
  credentials: CredentialItem[];
  tags: TagItem[];
  publishedAt?: string;
  updatedAt?: string;
}

export interface PostListResponse {
  posts: PostItem[];
  total?: number;
}

export interface CredentialItem {
  id: string;
  slug: string;
  title: string;
  type:
    | 'approval'
    | 'plant-variety-right'
    | 'patent'
    | 'award'
    | 'tech-achievement';
  level?: 'national' | 'provincial' | 'municipal' | 'registration' | 'trial';
  summary?: string;
  year?: string;
  displayOrder?: number;
  documentImages: Array<{url: string; alt?: string; caption?: string}>;
}

export interface SectionExplorerItem {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  coverUrl?: string;
  tags: string[];
  href: string;
}

export interface SectionFilters {
  category?: string;
  tag?: string | string[];
  q?: string;
  limit?: number;
}
