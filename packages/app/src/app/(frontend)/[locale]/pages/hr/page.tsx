import {setRequestLocale} from 'next-intl/server';

import type {Locale} from '@/i18n/routing';
import {getHr} from '@/lib/globals';
import Hr from '@/view/pages/Hr';

export default async function HrPage({
  params,
}: {
  params: Promise<{locale: Locale}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const hr = await getHr(locale);
  return <Hr hr={hr} />;
}
