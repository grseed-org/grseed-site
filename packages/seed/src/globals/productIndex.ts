import type {GlobalEntry, ProductIndex} from '../types';

export const productIndex = {
  kind: 'global',
  slug: 'productIndex',
  locales: {
    'zh-hans': {
      title: '产品推介',
      summary: '按产品标签筛选，或输入关键词搜索。',
    },
    en: {
      title: 'Product recommendations',
      summary: 'Browse by product tags and search.',
    },
  },
} satisfies GlobalEntry<ProductIndex>;
