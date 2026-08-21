import {setRequestLocale} from 'next-intl/server';

import type {Locale} from '@/i18n/routing';
import {SECTIONS} from '@/data/sections';
import {loadExplorer, type ExplorerSearch} from '@/lib/explorer';
import {getService} from '@/lib/globals';
import SectionExplorerView from '@/view/SectionExplorerView';

export default async function ServicePage({
  params,
  searchParams,
}: {
  params: Promise<{locale: Locale}>;
  searchParams: Promise<ExplorerSearch>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const [service, data] = await Promise.all([
    getService(locale),
    loadExplorer(locale, await searchParams, SECTIONS.service),
  ]);
  return (
    <SectionExplorerView
      basePath="/pages/service"
      pageTitle={service.title ?? ''}
      pageDescription={service.summary ?? ''}
      {...data}
    />
  );
}
