import {setRequestLocale} from 'next-intl/server';

import type {Locale} from '@/i18n/routing';
import {SECTIONS} from '@/data/sections';
import {loadExplorer, type ExplorerSearch} from '@/lib/explorer';
import {getBlogIndex} from '@/lib/globals';
import SectionExplorerView from '@/view/SectionExplorerView';

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{locale: Locale}>;
  searchParams: Promise<ExplorerSearch>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const [blogIndex, data] = await Promise.all([
    getBlogIndex(locale),
    loadExplorer(locale, await searchParams, SECTIONS.blog),
  ]);
  return (
    <SectionExplorerView
      basePath="/blog"
      pageTitle={blogIndex.title ?? ''}
      pageDescription={blogIndex.summary ?? ''}
      {...data}
    />
  );
}
