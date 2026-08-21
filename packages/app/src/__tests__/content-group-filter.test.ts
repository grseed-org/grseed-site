import {beforeEach, describe, expect, it, vi} from 'vitest';

// Guards the taxonomy contract: posts are section-scoped by category group,
// while product filters use shared group-less tags.

vi.mock('server-only', () => ({}));

type FindArgs = {collection: string; where: Record<string, unknown>};
const findCalls: FindArgs[] = [];

vi.mock('@/lib/payload', () => ({
  getPayloadClient: async () => ({
    find: async ({collection, where}: FindArgs) => {
      findCalls.push({collection, where});
      if (collection === 'categories') {
        return {
          docs: [{id: 5, name: 'Category', slug: 'category'}],
          totalDocs: 1,
        };
      }
      if (collection === 'tags') {
        const slug = (where.slug as {equals?: string} | undefined)?.equals;
        const docsBySlug = {
          foo: {id: 7, name: 'Foo', slug: 'foo'},
          bar: {id: 9, name: 'Bar', slug: 'bar'},
        };
        const doc = slug ? docsBySlug[slug as keyof typeof docsBySlug] : null;
        return {docs: doc ? [doc] : [], totalDocs: doc ? 1 : 0};
      }
      if (collection === 'products') {
        return {
          docs: [
            {
              id: 1,
              slug: 'both',
              name: 'Both',
              facts: [],
              gallery: [],
              credentials: [],
              tags: [
                {id: 7, name: 'Foo', slug: 'foo'},
                {id: 9, name: 'Bar', slug: 'bar'},
              ],
              updatedAt: '2026-01-01T00:00:00.000Z',
            },
            {
              id: 2,
              slug: 'foo-only',
              name: 'Foo only',
              facts: [],
              gallery: [],
              credentials: [],
              tags: [{id: 7, name: 'Foo', slug: 'foo'}],
              updatedAt: '2026-01-01T00:00:00.000Z',
            },
          ],
          totalDocs: 2,
        };
      }
      if (collection === 'posts') {
        return {
          docs: [
            {
              id: 1,
              slug: 'both',
              title: 'Both',
              category: {id: 5, name: 'Category', slug: 'category'},
              credentials: [],
              tags: [
                {id: 7, name: 'Foo', slug: 'foo'},
                {id: 9, name: 'Bar', slug: 'bar'},
              ],
              updatedAt: '2026-01-01T00:00:00.000Z',
            },
            {
              id: 2,
              slug: 'foo-only',
              title: 'Foo only',
              category: {id: 5, name: 'Category', slug: 'category'},
              credentials: [],
              tags: [{id: 7, name: 'Foo', slug: 'foo'}],
              updatedAt: '2026-01-01T00:00:00.000Z',
            },
          ],
          totalDocs: 2,
        };
      }
      return {docs: [], totalDocs: 0};
    },
  }),
}));

import {listPosts} from '@/lib/post';
import {listProducts} from '@/lib/product';

const whereFor = (collection: string) =>
  findCalls.find(call => call.collection === collection)?.where;

describe('section group scoping', () => {
  beforeEach(() => {
    findCalls.length = 0;
  });

  it('scopes post lists to their section category group', async () => {
    await listPosts('service', {}, {locale: 'zh-hans'});
    const where = whereFor('posts')!;
    expect(where['category.group']).toEqual({equals: 'service'});
    expect(where.tags).toBeUndefined();
  });

  it('keeps the group filter when a specific post category narrows the query', async () => {
    await listPosts('service', {category: 'category'}, {locale: 'zh-hans'});
    const where = whereFor('posts')!;
    expect(where.category).toEqual({equals: 5});
    expect(where['category.group']).toEqual({equals: 'service'});
  });

  it('narrows product lists by shared tag without a tag group filter', async () => {
    await listProducts({tag: 'foo'}, {locale: 'zh-hans'});
    const where = whereFor('products')!;
    expect(where.tags).toEqual({in: [7]});
    expect(where['tags.group']).toBeUndefined();
  });

  it('requires every selected product tag to match', async () => {
    const res = await listProducts({tag: ['foo', 'bar']}, {locale: 'zh-hans'});
    const where = whereFor('products')!;
    expect(where.tags).toEqual({in: [7, 9]});
    expect(where.and).toBeUndefined();
    expect(res.products.map(product => product.slug)).toEqual(['both']);
    expect(res.total).toBe(1);
  });

  it('combines post category and selected tags as narrowing filters', async () => {
    const res = await listPosts(
      'service',
      {category: 'category', tag: ['foo', 'bar']},
      {locale: 'zh-hans'},
    );
    const where = whereFor('posts')!;
    expect(where.category).toEqual({equals: 5});
    expect(where['category.group']).toEqual({equals: 'service'});
    expect(where.tags).toEqual({in: [7, 9]});
    expect(where.and).toBeUndefined();
    expect(res.posts.map(post => post.slug)).toEqual(['both']);
    expect(res.total).toBe(1);
  });
});
