import type {Metadata} from 'next';
import {draftMode} from 'next/headers';
import {notFound} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';

import type {Locale} from '@/i18n/routing';
import {getProductBySlug} from '@/lib/product';
import ProductView from '@/view/product/ProductView';

type Params = {params: Promise<{locale: Locale; productSlug: string}>};

function decodeSlug(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale, productSlug} = await params;
  const product = await getProductBySlug(decodeSlug(productSlug), {locale});
  return {title: product?.name, description: product?.description};
}

export default async function ProductPage({params}: Params) {
  const {locale, productSlug} = await params;
  setRequestLocale(locale);
  const {isEnabled} = await draftMode();
  const product = await getProductBySlug(decodeSlug(productSlug), {
    locale,
    draft: isEnabled,
  });
  if (!product) notFound();
  return <ProductView product={product} />;
}
