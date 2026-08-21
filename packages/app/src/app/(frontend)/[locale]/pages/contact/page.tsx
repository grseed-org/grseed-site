import {setRequestLocale} from 'next-intl/server';

import type {Locale} from '@/i18n/routing';
import {getContact} from '@/lib/globals';
import Contact from '@/view/pages/Contact';

export default async function ContactPage({
  params,
}: {
  params: Promise<{locale: Locale}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const contact = await getContact(locale);
  return <Contact contact={contact} />;
}
