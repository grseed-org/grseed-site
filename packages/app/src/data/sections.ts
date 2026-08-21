import type {PostSection} from '@/lib/types';

/**
 * The section routes (`/blog`, `/product`, `/pages/service`, `/pages/research`).
 * Each pins one collection in code. URL `?type` is intentionally gone; a route's
 * path selects product vs post, while category/tag/q narrow the route's list.
 */
interface ProductSectionConfig {
  kind: 'product';
  detailBasePath: string;
}

interface PostSectionConfig {
  kind: 'post';
  postSection: PostSection;
  detailBasePath: string;
}

export type SectionConfig = ProductSectionConfig | PostSectionConfig;

type SectionKey = 'blog' | 'product' | 'service' | 'research';

// Section routes pin collection choice in code. Post sections are narrowed by
// category group; products stay exclusive to the products collection.
export const SECTIONS = {
  blog: {
    kind: 'post',
    postSection: 'blog',
    detailBasePath: '/blog',
  },
  product: {kind: 'product', detailBasePath: '/product'},
  service: {
    kind: 'post',
    postSection: 'service',
    detailBasePath: '/pages/service',
  },
  research: {
    kind: 'post',
    postSection: 'research',
    detailBasePath: '/pages/research',
  },
} as const satisfies Record<SectionKey, SectionConfig>;
