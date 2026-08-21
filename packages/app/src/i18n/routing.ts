import {defineRouting} from 'next-intl/routing';

// Three i18n axes use intentionally different locale codes — do NOT unify them:
//   - frontend UI + CMS content: 'zh-hans' (here)
//   - Payload admin-UI language pack: 'zh' (see payload.config.ts i18n)
// The site/content 'zh-hans' ⇄ admin-UI 'zh' mapping is deliberate.
//
// localePrefix 'as-needed' makes '/' the canonical zh-hans URL: '/' serves
// zh-hans un-prefixed, '/zh-hans/*' 308-redirects to the un-prefixed path (SEO
// canonical — one URL per page), and only '/en/*' carries a prefix.
//
// localeDetection is OFF by design: the site is Chinese-first, so '/' must always
// render zh-hans regardless of the visitor's Accept-Language. With detection on
// (next-intl's default), an English-preferring browser would get '/' → '/en',
// breaking the canonical default. English is reachable only via the explicit
// '/en' prefix or the LocaleSwitcher.
export const routing = defineRouting({
  locales: ['en', 'zh-hans'],
  defaultLocale: 'zh-hans',
  localePrefix: 'as-needed',
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
