import {setRequestLocale} from 'next-intl/server';

import type {Locale} from '@/i18n/routing';
import {getAboutDerived} from '@/lib/about';
import {getAbout} from '@/lib/globals';
import About from '@/view/pages/About';

export default async function AboutPage({
  params,
}: {
  params: Promise<{locale: Locale}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const [about, derived] = await Promise.all([
    getAbout(locale),
    getAboutDerived(locale),
  ]);
  return <About about={about} derived={derived} />;
}
