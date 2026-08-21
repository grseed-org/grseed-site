import {setRequestLocale} from 'next-intl/server';

import type {Locale} from '@/i18n/routing';
import {listCategories} from '@/lib/categories';
import {listProducts} from '@/lib/product';
import {getHome} from '@/lib/globals';
import Home from '@/view/Home';

export default async function HomePage({
  params,
}: {
  params: Promise<{locale: Locale}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const [home, productList, researchCategories] = await Promise.all([
    getHome(locale),
    listProducts({limit: 8}, {locale}),
    listCategories({locale, group: 'research'}),
  ]);
  return (
    <Home
      home={home}
      productItems={productList.products}
      researchCategories={researchCategories.categories}
    />
  );
}
