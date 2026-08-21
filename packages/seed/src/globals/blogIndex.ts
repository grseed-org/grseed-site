import type {BlogIndex, GlobalEntry} from '../types';

export const blogIndex = {
  kind: 'global',
  slug: 'blogIndex',
  locales: {
    'zh-hans': {
      title: '新闻博客',
      summary: '按标签筛选内容，或输入关键词搜索。',
    },
    en: {
      title: 'News blog',
      summary: 'Browse by tags and search.',
    },
  },
} satisfies GlobalEntry<BlogIndex>;
