'use client';

import {useLocale, useTranslations} from 'next-intl';

import {usePathname, useRouter} from '@/i18n/navigation';
import {routing, type Locale} from '@/i18n/routing';
import {startRouteProgress} from '@/components/RouteProgressBar';

// next-intl locale switcher (replaces Paraglide's setLocale). usePathname returns
// the path without the locale prefix, so router.replace(path, {locale}) toggles
// en ⇄ zh-hans while staying on the same page.
export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const current = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
        color: 'inherit',
      }}
      aria-label={t('label')}
    >
      <span style={{opacity: 0.85}}>{t('current', {locale: current})}</span>
      <div style={{display: 'flex', gap: '0.25rem'}}>
        {routing.locales.map(locale => (
          <button
            key={locale}
            onClick={() => {
              if (locale !== current) startRouteProgress();
              router.replace(pathname, {locale});
            }}
            aria-pressed={locale === current}
            style={{
              cursor: 'pointer',
              padding: '0.35rem 0.75rem',
              borderRadius: '999px',
              border: '1px solid #d1d5db',
              background: locale === current ? '#0f172a' : 'transparent',
              color: locale === current ? '#f8fafc' : 'inherit',
              fontWeight: locale === current ? 700 : 500,
              letterSpacing: '0.01em',
            }}
          >
            {locale.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
