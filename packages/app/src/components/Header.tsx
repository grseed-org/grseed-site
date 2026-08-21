'use client';

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {Menu, X} from 'lucide-react';
import type {Navigation, SiteSetting} from '@/payload-types';
import {Button} from '@/components/ui/button';
import {RouteProgressBar} from '@/components/RouteProgressBar';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {useIsMobile} from '@/hooks/useMediaQuery';

export default function Header({
  navigation,
  siteSettings,
}: {
  navigation: Navigation;
  siteSettings: SiteSetting;
}) {
  const isMobile = useIsMobile();
  const {setOpenMobile} = useSidebar();
  const t = useTranslations('Nav');
  const navItems = navigation.header ?? [];
  const siteName = siteSettings.siteName ?? '';
  const siteNameEn = siteSettings.siteNameEn ?? '';
  const siteNameEnShort = siteSettings.siteNameEnShort ?? siteNameEn;

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:h-24 md:gap-4">
        <div className="flex min-w-0 items-center gap-3 md:gap-4">
          <Button
            variant="ghost"
            size="icon-md"
            className="md:hidden"
            onClick={() => setOpenMobile(true)}
            aria-label={t('openMenu')}
          >
            <Menu />
          </Button>

          <Link href="/" className="flex min-w-0 items-center gap-2 md:gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-md font-bold md:size-20">
              <img
                src="/logo-out-mini.jpg"
                alt={siteName}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="min-w-0 leading-tight">
              {isMobile ? (
                <>
                  <div className="truncate text-base font-semibold">
                    {siteName}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {siteNameEnShort}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-xl font-semibold">{siteName}</div>
                  <div className="text-base text-muted-foreground">
                    {siteNameEn}
                  </div>
                </>
              )}
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <Link
              key={`${item.href}:${item.label}`}
              href={item.href}
              className="rounded-md px-3 py-3 text-sm text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <RouteProgressBar />

      <Sidebar className="md:hidden" placement="left">
        <SidebarHeader className="border-b p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">{t('menu')}</div>
            <Button
              variant="ghost"
              size="icon-md"
              onClick={() => setOpenMobile(false)}
              aria-label={t('closeMenu')}
            >
              <X />
            </Button>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <div className="p-2">
            <SidebarMenu>
              {navItems.map(item => (
                <SidebarMenuItem key={`${item.href}:${item.label}`}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.href}
                      className="px-3 py-3"
                      onClick={() => setOpenMobile(false)}
                    >
                      {item.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        </SidebarContent>
      </Sidebar>
    </header>
  );
}
