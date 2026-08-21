// @vitest-environment jsdom
import * as React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';

// Locks the product/post split: section routes own their collection choice, and
// public list URLs expose category, tag, and search filters.

const routerReplace = vi.hoisted(() => vi.fn());

vi.mock('server-only', () => ({}));
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) => {
    if (key === 'itemsCount') return `${values?.visible}/${values?.total}`;
    return key;
  },
}));
vi.mock('@/components/RouteProgressBar', () => ({
  startRouteProgress: vi.fn(),
}));
vi.mock('@/lib/product', () => ({
  listProducts: vi.fn(async () => ({products: [], total: 0})),
}));
vi.mock('@/lib/post', () => ({
  listPosts: vi.fn(async () => ({posts: [], total: 0})),
}));
vi.mock('@/lib/categories', () => ({
  listCategories: vi.fn(async () => ({categories: [], total: 0})),
}));
vi.mock('@/lib/tags', () => ({
  listTags: vi.fn(async () => ({tags: [], total: 0})),
  normalizeTagSlugs: (value: string | string[] | undefined) =>
    Array.isArray(value) ? value : value ? [value] : [],
}));
vi.mock('@/i18n/navigation', () => ({
  Link: ({href, children}: {href: string; children: React.ReactNode}) => (
    <a href={href}>{children}</a>
  ),
  useRouter: () => ({replace: routerReplace}),
}));

import ContentCard from '@/components/Content/ContentCard';
import {SECTIONS} from '@/data/sections';
import {loadExplorer} from '@/lib/explorer';
import {listCategories} from '@/lib/categories';
import {listPosts} from '@/lib/post';
import {listProducts} from '@/lib/product';
import {listTags} from '@/lib/tags';
import SectionExplorerView from '@/view/SectionExplorerView';

describe('SECTIONS', () => {
  it('pins one collection per public section', () => {
    expect(SECTIONS.blog.kind).toBe('post');
    expect(SECTIONS.product.kind).toBe('product');
    expect(SECTIONS.service.postSection).toBe('service');
    expect(SECTIONS.research.postSection).toBe('research');
  });
});

describe('loadExplorer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    routerReplace.mockClear();
  });

  it('loads product sections through the product API', async () => {
    await loadExplorer(
      'zh-hans',
      {tag: ['jietian-rice', 'high-yield'], q: '稻'},
      SECTIONS.product,
    );

    expect(vi.mocked(listProducts).mock.calls[0][0]).toEqual({
      tag: ['jietian-rice', 'high-yield'],
      q: '稻',
      limit: 30,
    });
    expect(vi.mocked(listTags).mock.calls[0][0]).toEqual({
      locale: 'zh-hans',
      limit: 200,
    });
    expect(listPosts).not.toHaveBeenCalled();
  });

  it('loads post sections through the post API', async () => {
    await loadExplorer(
      'zh-hans',
      {category: 'technical-guidance', tag: ['rice', 'approval']},
      SECTIONS.service,
    );

    expect(vi.mocked(listPosts).mock.calls[0][0]).toBe('service');
    expect(vi.mocked(listPosts).mock.calls[0][1]).toEqual({
      category: 'technical-guidance',
      tag: ['rice', 'approval'],
      q: undefined,
      limit: 30,
    });
    expect(vi.mocked(listCategories).mock.calls[0][0].group).toBe('service');
    expect(vi.mocked(listTags).mock.calls[0][0]).toEqual({
      locale: 'zh-hans',
      limit: 200,
    });
    expect(listProducts).not.toHaveBeenCalled();
  });
});

describe('SectionExplorerView filters', () => {
  beforeEach(() => routerReplace.mockClear());

  it('keeps category while toggling and clearing multi-selected tags', () => {
    render(
      <SectionExplorerView
        activeCategory="guidance"
        activeTags={['rice']}
        basePath="/pages/service"
        categories={[{id: '1', name: 'Guidance', slug: 'guidance'}]}
        items={[]}
        tags={[
          {id: '2', name: 'Rice', slug: 'rice'},
          {id: '3', name: 'High yield', slug: 'high-yield'},
        ]}
      />,
    );

    fireEvent.click(screen.getByRole('button', {name: 'High yield'}));
    expect(routerReplace).toHaveBeenLastCalledWith(
      '/pages/service?category=guidance&tag=rice&tag=high-yield',
    );

    fireEvent.click(screen.getAllByRole('button', {name: 'all'})[1]);
    expect(routerReplace).toHaveBeenLastCalledWith(
      '/pages/service?category=guidance',
    );
  });
});

describe('ContentCard', () => {
  it('links to the section-owned detail route without a type badge', () => {
    render(
      <ContentCard
        item={{
          id: '1',
          slug: 'a',
          title: 'A',
          tags: ['新闻'],
          href: '/blog/a',
        }}
      />,
    );

    expect(screen.getByRole('link', {name: 'A'}).getAttribute('href')).toBe(
      '/blog/a',
    );
    expect(screen.queryByText('POST')).toBeNull();
  });
});
