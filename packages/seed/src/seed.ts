import {DEFAULT_LOCALE, LOCALES} from './locales';
import {registry} from './registry';
import type {AnyEntry, CollectionEntry, GlobalEntry} from './types';

// Minimal Payload Local-API surface this engine uses. Kept structural so the
// seed package needs no runtime dependency on payload's types.
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PayloadLike {
  // Rest-arg methods keep this structural contract compatible with Payload's
  // generic Local API overloads while seed code still passes normal option objects.
  findGlobal: (...args: any[]) => Promise<any>;
  updateGlobal: (...args: any[]) => Promise<any>;
  find: (...args: any[]) => Promise<{docs: any[]; totalDocs: number}>;
  create: (...args: any[]) => Promise<any>;
  logger?: {info: (msg: string) => void};
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const log = (p: PayloadLike, msg: string) => p.logger?.info(`[seed] ${msg}`);

// Build the data written for a given locale: non-localized `shared` fields plus
// that locale's editorial copy. Returns null when the locale has no authored
// copy (e.g. en is omitted — fallback covers reads).
function dataFor(
  entry: AnyEntry,
  locale: string,
): Record<string, unknown> | null {
  const localeData = (entry.locales as Record<string, unknown>)[locale];
  if (!localeData) return null;
  return {...(entry.shared ?? {}), ...(localeData as object)};
}

// A global "counts as empty" (eligible for seed) when none of the authored
// default-locale keys have a value yet.
function isGlobalEmpty(
  current: Record<string, unknown>,
  entry: AnyEntry,
): boolean {
  const keys = Object.keys(entry.locales[DEFAULT_LOCALE] ?? {});
  return keys.every(k => {
    const v = current?.[k];
    return v == null || (Array.isArray(v) && v.length === 0) || v === '';
  });
}

async function writeGlobal(p: PayloadLike, entry: GlobalEntry<unknown>) {
  const refs = await resolveRefs(p, entry);
  for (const locale of LOCALES) {
    const data = dataFor(entry, locale);
    if (data)
      await p.updateGlobal({
        slug: entry.slug,
        locale,
        data: mergeDeep(data, refs),
      });
  }
}

function setPath(
  target: Record<string, unknown>,
  path: string,
  value: number | string | (number | string)[],
) {
  const parts = path.split('.');
  let cursor: any = target;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]!;
    const nextPart = parts[i + 1];
    const isArrayIndex = /^\d+$/.test(nextPart ?? '');
    if (cursor[part] == null) cursor[part] = isArrayIndex ? [] : {};
    cursor = cursor[part];
  }
  cursor[parts[parts.length - 1]!] = value;
}

function mergeDeep<T>(base: T, patch: unknown): T {
  if (Array.isArray(base) && Array.isArray(patch)) {
    const out = [...base] as unknown[];
    patch.forEach((value, index) => {
      out[index] = out[index] == null ? value : mergeDeep(out[index], value);
    });
    return out as T;
  }
  if (
    base &&
    patch &&
    typeof base === 'object' &&
    typeof patch === 'object' &&
    !Array.isArray(base) &&
    !Array.isArray(patch)
  ) {
    const out: Record<string, unknown> = {...(base as object)};
    for (const [key, value] of Object.entries(patch)) {
      out[key] =
        key in out && out[key] != null ? mergeDeep(out[key], value) : value;
    }
    return out as T;
  }
  return patch as T;
}

// Resolve an entry's `refs` (stable key → id) against the DB. Each key must resolve to a
// persisted doc; a miss throws rather than dropping the relation — the inverse of a
// silent `.filter(Boolean)`, which once left seeded data untagged and invisible.
// Relationships are non-localized, so this runs once per entry. References
// default to slug, but media imports use assetKey. Referenced docs must be
// persisted earlier in the same pass or imported before seed.
async function resolveRefs(
  p: PayloadLike,
  entry: CollectionEntry<unknown> | GlobalEntry<unknown>,
): Promise<Record<string, number | string | (number | string)[]>> {
  const out: Record<string, number | string | (number | string)[]> = {};
  if (!entry.refs) return out;
  for (const [field, ref] of Object.entries(entry.refs)) {
    const keys = 'keys' in ref ? ref.keys : [ref.key];
    const keyField = 'field' in ref ? ref.field : 'slug';
    const ids: (number | string)[] = [];
    for (const key of keys) {
      const res = await p.find({
        collection: ref.collection,
        where: {[keyField]: {equals: key}},
        limit: 1,
      });
      const id = res.docs[0]?.id as number | string | undefined;
      if (id == null)
        throw new Error(
          `[seed] ${entry.slug}${entry.kind === 'collection' ? `/${entry.key}` : ''}: ref "${field}" → no ${ref.collection} with ${keyField} "${key}"`,
        );
      ids.push(id);
    }
    setPath(out, field, 'keys' in ref ? ids : ids[0]!);
  }
  return out;
}

async function writeCollection(
  p: PayloadLike,
  entry: CollectionEntry<unknown>,
) {
  const refs = await resolveRefs(p, entry);
  for (const locale of LOCALES) {
    const data = dataFor(entry, locale);
    if (!data) continue;
    await p.create({
      collection: entry.slug,
      locale,
      data: {...mergeDeep(data, refs), slug: entry.key},
    });
  }
}
async function globalEmpty(
  p: PayloadLike,
  entry: GlobalEntry<unknown>,
): Promise<boolean> {
  for (const locale of LOCALES) {
    const current = await p.findGlobal({
      slug: entry.slug,
      locale,
      fallbackLocale: false,
    });
    if (!isGlobalEmpty(current, entry)) return false;
  }
  return true;
}
async function collectionEmpty(
  p: PayloadLike,
  entry: CollectionEntry<unknown>,
) {
  const existing = await p.find({
    collection: entry.slug,
    where: {slug: {equals: entry.key}},
    limit: 1,
  });
  return existing.totalDocs === 0;
}

/**
 * Non-destructive bootstrap: create only missing or uninitialized content.
 * Existing Payload documents are never updated or overwritten by seed.
 */
export async function seedAll(p: PayloadLike): Promise<void> {
  for (const entry of registry) {
    if (entry.kind === 'global') {
      if (await globalEmpty(p, entry)) {
        await writeGlobal(p, entry);
        log(p, `seeded global ${entry.slug}`);
      } else log(p, `skip global ${entry.slug} (already populated)`);
    } else {
      if (await collectionEmpty(p, entry)) {
        await writeCollection(p, entry);
        log(p, `seeded ${entry.slug}/${entry.key}`);
      } else log(p, `skip ${entry.slug}/${entry.key} (exists)`);
    }
  }
}
