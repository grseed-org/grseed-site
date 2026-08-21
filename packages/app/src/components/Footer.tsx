import {getLocale, getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {MapPin, Phone, Mail} from 'lucide-react';

import type {Locale} from '@/i18n/routing';
import {getContact, getNavigation, getSiteSettings} from '@/lib/globals';

const Footer = async () => {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('Footer');
  const [contact, navigation, siteSettings] = await Promise.all([
    getContact(locale),
    getNavigation(locale),
    getSiteSettings(locale),
  ]);
  const columns = navigation.footerSections ?? [];

  return (
    <footer className="bg-zinc-50 py-12 text-zinc-600">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* 动态渲染导航列 */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {columns.map(section => (
              <div key={section.id ?? section.key} className="flex flex-col space-y-4">
                <h3 className="text-zinc-900 px-2 text-sm font-bold tracking-wider">
                  {section.label}
                </h3>
                <nav className="flex flex-col space-y-1">
                  {(section.items ?? []).map(item =>
                    item.href.startsWith('#') ? (
                      <a
                        key={`${item.href}:${item.label}`}
                        href={item.href}
                        className="rounded-md px-2 py-1.5 text-sm text-foreground/80 hover:text-foreground hover:bg-accent transition-colors inline-block w-fit"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        key={`${item.href}:${item.label}`}
                        href={item.href}
                        className="rounded-md px-2 py-1.5 text-sm text-foreground/80 hover:text-foreground hover:bg-accent transition-colors inline-block w-fit"
                      >
                        {item.label}
                      </Link>
                    ),
                  )}
                </nav>
              </div>
            ))}
          </div>

          {/* 联系信息列 */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-zinc-900 text-sm font-bold tracking-wider">
              {t('contactTitle')}
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="size-4 mt-0.5 text-zinc-400" />
                <span>
                  {t('addressLabel')}：{contact.address}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="size-4 mt-0.5 text-zinc-400" />
                <span>
                  {t('phoneLabel')}：{contact.phone}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="size-4 mt-0.5 text-zinc-400" />
                <span>
                  {t('emailLabel')}：{contact.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 底部备注区 */}
        <div className="mt-16 pt-8 text-xs text-zinc-400 flex flex-col md:flex-row justify-between gap-4">
          <p>{siteSettings.copyright}</p>
          <div className="flex items-center gap-2">
            <p>{siteSettings.icp}</p>
            {/* Payload admin panel — same-origin, NOT a locale-prefixed route,
                so a plain <a> (not the next-intl Link). */}
            <a href="/admin">{t('admin')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
