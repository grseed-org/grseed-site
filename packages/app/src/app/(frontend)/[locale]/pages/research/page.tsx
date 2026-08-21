import {getTranslations, setRequestLocale} from 'next-intl/server';

import type {Locale} from '@/i18n/routing';
import {SECTIONS} from '@/data/sections';
import {loadExplorer, type ExplorerSearch} from '@/lib/explorer';
import {getResearch} from '@/lib/globals';
import SectionExplorerView from '@/view/SectionExplorerView';

export default async function ResearchPage({
  params,
  searchParams,
}: {
  params: Promise<{locale: Locale}>;
  searchParams: Promise<ExplorerSearch>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const [research, data, t] = await Promise.all([
    getResearch(locale),
    loadExplorer(locale, await searchParams, SECTIONS.research),
    getTranslations({locale, namespace: 'Explorer'}),
  ]);
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-10/12 max-w-6xl space-y-6 py-8">
        <div>
          <h1 className="text-2xl font-semibold">{research.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {research.summary}
          </p>
        </div>
      </section>

      <SectionExplorerView
        basePath="/pages/research"
        pageTitle={t('listTitle', {title: research.title ?? ''})}
        pageDescription=""
        {...data}
      />
    </main>
  );
}
