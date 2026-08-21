import 'server-only';

import type {Product, Tag} from '@/payload-types';

import {getPayloadClient} from './payload';
import type {Locale} from './types';

type ProductTag = Tag & {
  showInAbout?: boolean | null;
  aboutOrder?: number | null;
};
type AboutProduct = Product & {
  tags?: (number | ProductTag)[] | null;
  displayOrder?: number | null;
};

export interface AboutProductGroup {
  slug: string;
  title: string;
  description?: string;
  order: number;
  varieties: Array<{id: string; slug: string; name: string}>;
}

export interface AboutApprovals {
  national: Array<{id: string; slug: string; name: string}>;
  provincial: Array<{id: string; slug: string; name: string}>;
  trial: Array<{id: string; slug: string; name: string}>;
}

export interface AboutDerived {
  productGroups: AboutProductGroup[];
  approvals: AboutApprovals;
  stats: Array<{
    key: 'products' | 'groups' | 'national' | 'provincial';
    value: string;
  }>;
}

const asTag = (value: number | ProductTag): ProductTag | undefined =>
  typeof value === 'object' ? value : undefined;

const isTag = (value: ProductTag | undefined): value is ProductTag => !!value;

type ProductCredential = NonNullable<Product['credentials']>[number];

const asCredential = (value: ProductCredential) =>
  typeof value === 'object' ? value : undefined;

const productSummary = (product: AboutProduct) => ({
  id: String(product.id),
  slug: product.slug,
  name: product.name,
});

const byDisplayOrder = (a: AboutProduct, b: AboutProduct) =>
  (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999) ||
  a.name.localeCompare(b.name);

export function deriveAboutContent(products: AboutProduct[]): AboutDerived {
  const sorted = [...products].sort(byDisplayOrder);
  const groups = new Map<string, AboutProductGroup>();
  const approvals: AboutApprovals = {national: [], provincial: [], trial: []};

  for (const product of sorted) {
    for (const tag of (product.tags ?? []).map(asTag).filter(isTag)) {
      if (!tag.showInAbout) continue;
      const group = groups.get(tag.slug) ?? {
        slug: tag.slug,
        title: tag.name,
        description: tag.description ?? undefined,
        order: tag.aboutOrder ?? 9999,
        varieties: [],
      };
      group.varieties.push(productSummary(product));
      groups.set(tag.slug, group);
    }

    const structuredLevels = new Set(
      (product.credentials ?? [])
        .map(asCredential)
        .filter(credential => credential?.type === 'approval')
        .map(credential => credential?.level)
        .filter(
          (level): level is keyof AboutApprovals =>
            level === 'national' || level === 'provincial' || level === 'trial',
        ),
    );
    for (const level of ['national', 'provincial', 'trial'] as const) {
      if (structuredLevels.has(level)) {
        approvals[level].push(productSummary(product));
      }
    }
  }

  const productGroups = [...groups.values()].sort(
    (a, b) => a.order - b.order || a.title.localeCompare(b.title),
  );

  return {
    productGroups,
    approvals,
    stats: [
      {key: 'products', value: String(sorted.length)},
      {key: 'groups', value: String(productGroups.length)},
      {key: 'national', value: String(approvals.national.length)},
      {key: 'provincial', value: String(approvals.provincial.length)},
    ],
  };
}

export async function getAboutDerived(locale: Locale): Promise<AboutDerived> {
  const payload = await getPayloadClient();
  const products = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 300,
    locale,
    sort: 'displayOrder',
  });
  return deriveAboutContent(products.docs as AboutProduct[]);
}
