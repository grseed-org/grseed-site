import type {Metadata} from 'next';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {SidebarProvider} from '@/components/ui/sidebar';

import type {Locale} from '@/i18n/routing';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {notFound} from 'next/navigation';
import {getNavigation, getSiteSettings} from '@/lib/globals';

// Render the public site dynamically (SSR per request) rather than prerendering
// at build. Two payoffs: (1) `next build` needs no DB connection, so the image
// can be built locally/in CI without Postgres; (2) editor changes in /admin show
// up immediately instead of being frozen into build-time HTML. The whole
// (frontend) subtree inherits this from the locale layout.
export const dynamic = 'force-dynamic';

// Hard-coded fallbacks used when SiteSettings/seo is blank or the DB is
// unavailable at build/render time.
const DEFAULT_TITLE = '安徽国瑞种业有限公司';
const DEFAULT_DESCRIPTION =
  '安徽国瑞种业有限公司，集农作物种子科研、繁育与推广为一体的民营科技型企业。';

// Per-locale metadata sourced from the SiteSettings global (seo title/description,
// localized), falling back to the bundled defaults when blank or unavailable.
export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  let title = DEFAULT_TITLE;
  let description = DEFAULT_DESCRIPTION;
  if (hasLocale(routing.locales, locale)) {
    try {
      const s = await getSiteSettings(locale as Locale);
      title = s.seo?.title || s.siteName || title;
      description = s.seo?.description || description;
    } catch {
      // DB unavailable at build/render — fall back to bundled defaults.
    }
  }
  return {
    title,
    description,
    keywords: [
      '水稻',
      '安徽国瑞种业有限公司',
      '种业',
      '农作物种子',
      '繁育',
      '推广',
    ],
    icons: {icon: '/logo-out-mini.jpg'},
  };
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({locale}));
}

export default async function FrontendLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  // Opt into static rendering for this locale (next-intl + App Router).
  setRequestLocale(locale as Locale);
  const [navigation, siteSettings] = await Promise.all([
    getNavigation(locale as Locale),
    getSiteSettings(locale as Locale),
  ]);

  return (
    <NextIntlClientProvider>
      <SidebarProvider defaultOpen={false} className="flex-col">
        <Header navigation={navigation} siteSettings={siteSettings} />
        {/* Grow to fill the viewport so the footer always sits at the
                bottom of the screen, even on short pages. */}
        <main className="flex-1">{children}</main>
        <Footer />
      </SidebarProvider>
    </NextIntlClientProvider>
  );
}
