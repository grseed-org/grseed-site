import {describe, expect, it} from 'vitest';

import {
  type CollectionEntry,
  DEFAULT_LOCALE,
  mediaAssets,
  type PayloadLike,
  registry,
  seedAll,
} from '@grseed/seed';

// Guards the @grseed/seed bootstrap contract: seed writes every authored locale,
// is idempotent, resolves relationships fail-loud, and never overwrites content
// that already exists in Payload. This unit test uses only the structural
// PayloadLike surface; it does not require a Payload runtime or database.

interface DocStore {
  id: number;
  slug: string;
  byLocale: Map<string, Record<string, unknown>>;
}

interface Recorder {
  payload: PayloadLike;
  globals: Map<string, Map<string, Record<string, unknown>>>;
  globalWrites: Array<{slug: string; locale: string}>;
  collections: Map<string, Map<string, DocStore>>;
  collWrites: Array<{collection: string; slug: string; locale: string}>;
}

function makeRecorder(): Recorder {
  const globals = new Map<string, Map<string, Record<string, unknown>>>();
  const globalWrites: Array<{slug: string; locale: string}> = [];
  const collections = new Map<string, Map<string, DocStore>>();
  const collWrites: Array<{
    collection: string;
    slug: string;
    locale: string;
  }> = [];
  let nextId = 1;
  const payload: PayloadLike = {
    async findGlobal({slug, locale}) {
      return globals.get(slug)?.get(locale ?? DEFAULT_LOCALE) ?? {};
    },
    async updateGlobal({slug, locale, data}) {
      const loc = locale ?? DEFAULT_LOCALE;
      globalWrites.push({slug, locale: loc});
      const byLocale = globals.get(slug) ?? new Map();
      byLocale.set(loc, {...data});
      globals.set(slug, byLocale);
      return data;
    },
    async find({collection, where}) {
      const byKey = collections.get(collection) ?? new Map<string, DocStore>();
      const [whereField, whereFilter] =
        Object.entries((where ?? {}) as Record<string, {equals?: string}>)[0] ??
        [];
      const wantValue = whereFilter?.equals;
      const docs = [...byKey.values()]
        .filter(d => {
          if (whereField === undefined || wantValue === undefined) return true;
          if (whereField === 'slug') return d.slug === wantValue;
          return d.byLocale.get(DEFAULT_LOCALE)?.[whereField] === wantValue;
        })
        .map(d => ({
          id: d.id,
          slug: d.slug,
          ...(d.byLocale.get(DEFAULT_LOCALE) ?? {}),
        }));
      return {docs, totalDocs: docs.length};
    },
    async create({collection, locale, data}) {
      const loc = locale ?? DEFAULT_LOCALE;
      const slug = (data as {slug: string}).slug;
      const byKey = collections.get(collection) ?? new Map<string, DocStore>();
      const doc: DocStore = {id: nextId++, slug, byLocale: new Map()};
      doc.byLocale.set(loc, {...data});
      byKey.set(slug, doc);
      collections.set(collection, byKey);
      collWrites.push({collection, slug, locale: loc});
      return {id: doc.id, ...data};
    },
  };
  for (const asset of mediaAssets) {
    const doc: DocStore = {
      id: nextId++,
      slug: asset.key,
      byLocale: new Map([
        [
          DEFAULT_LOCALE,
          {
            slug: asset.key,
            assetKey: asset.key,
            alt: asset.alt,
            filename: asset.filename,
          },
        ],
      ]),
    };
    const media = collections.get('media') ?? new Map<string, DocStore>();
    media.set(asset.key, doc);
    collections.set('media', media);
  }
  return {payload, globals, globalWrites, collections, collWrites};
}

const snapshot = (r: Recorder) =>
  JSON.stringify({
    globals: [...r.globals.entries()].map(([slug, byLocale]) => [
      slug,
      [...byLocale.entries()].sort(),
    ]),
    collections: [...r.collections.entries()].map(([coll, byKey]) => [
      coll,
      [...byKey.entries()]
        .sort()
        .map(([s, d]) => [s, [...d.byLocale.entries()].sort()]),
    ]),
  });

const globalEntries = registry.filter(e => e.kind === 'global');
const collectionEntries = registry.filter(
  (e): e is CollectionEntry<unknown> => e.kind === 'collection',
);

describe('seedAll', () => {
  it('seeds the default locale for every global', async () => {
    const r = makeRecorder();
    await seedAll(r.payload);
    for (const entry of globalEntries) {
      expect(r.globals.get(entry.slug)?.has(DEFAULT_LOCALE)).toBe(true);
    }
  });

  it('seeds every authored locale (not only the default)', async () => {
    const r = makeRecorder();
    await seedAll(r.payload);
    for (const entry of registry) {
      for (const locale of Object.keys(entry.locales)) {
        const written =
          entry.kind === 'global'
            ? r.globalWrites.some(
                w => w.slug === entry.slug && w.locale === locale,
              )
            : r.collWrites.some(
                w =>
                  w.collection === entry.slug &&
                  w.slug === entry.key &&
                  w.locale === locale,
              );
        expect(written).toBe(true);
      }
    }
  });

  it('is idempotent — running twice yields one identical document set', async () => {
    const r = makeRecorder();
    await seedAll(r.payload);
    const afterFirst = snapshot(r);
    await seedAll(r.payload);
    expect(snapshot(r)).toBe(afterFirst);
  });

  it('creates one collection document per seed key', async () => {
    const r = makeRecorder();
    await seedAll(r.payload);
    await seedAll(r.payload);
    const expectedByCollection = new Map<string, Set<string>>();
    for (const entry of collectionEntries) {
      const keys = expectedByCollection.get(entry.slug) ?? new Set<string>();
      keys.add(entry.key);
      expectedByCollection.set(entry.slug, keys);
    }
    for (const [collection, keys] of expectedByCollection) {
      const docs = r.collections.get(collection);
      expect(docs?.size).toBe(keys.size);
      for (const key of keys) expect(docs?.has(key)).toBe(true);
    }
  });

  it('throws when a ref slug resolves to no document', async () => {
    const r = makeRecorder();
    const refEntry = collectionEntries.find(e =>
      Object.values(e.refs ?? {}).some(ref => ref.collection !== 'media'),
    );
    expect(refEntry).toBeDefined();
    const ref = Object.values(refEntry!.refs!).find(
      candidate => candidate.collection !== 'media',
    )!;
    const {collection} = ref;
    const keyField = 'field' in ref ? ref.field : 'slug';
    const keys = 'keys' in ref ? ref.keys : [ref.key];
    const missing = keys[0];
    const create = r.payload.create;
    r.payload.create = async args =>
      args.collection === collection &&
      (args.data as {slug?: string}).slug === missing
        ? {id: 0}
        : create(args);
    await expect(seedAll(r.payload)).rejects.toThrow(
      `no ${collection} with ${keyField} "${missing}"`,
    );
  });

  it('never deletes editor-created (unregistered) tags', async () => {
    const r = makeRecorder();
    await r.payload.create({
      collection: 'tags',
      locale: DEFAULT_LOCALE,
      data: {slug: 'editor-only', name: '编辑标签'},
    });
    await seedAll(r.payload);
    expect(r.collections.get('tags')?.has('editor-only')).toBe(true);
  });

  it('never overwrites an editor-modified global', async () => {
    const r = makeRecorder();
    await seedAll(r.payload);
    const home = r.globals.get('home')?.get(DEFAULT_LOCALE);
    expect(home).toBeDefined();
    home!.title = 'editor change';
    const writesBefore = r.globalWrites.length;
    await seedAll(r.payload);
    expect(r.globals.get('home')?.get(DEFAULT_LOCALE)?.title).toBe(
      'editor change',
    );
    expect(r.globalWrites.length).toBe(writesBefore);
  });
});
