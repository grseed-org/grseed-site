import {setRequestLocale} from 'next-intl/server';

import type {Locale} from '@/i18n/routing';
import {SECTIONS} from '@/data/sections';
import {loadExplorer, type ExplorerSearch} from '@/lib/explorer';
import {getProductIndex} from '@/lib/globals';
import SectionExplorerView from '@/view/SectionExplorerView';

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{locale: Locale}>;
  searchParams: Promise<ExplorerSearch>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const [productIndex, data] = await Promise.all([
    getProductIndex(locale),
    loadExplorer(locale, await searchParams, SECTIONS.product),
  ]);
  return (
    <SectionExplorerView
      basePath="/product"
      pageTitle={productIndex.title ?? ''}
      pageDescription={productIndex.summary ?? ''}
      {...data}
    />
  );
}
