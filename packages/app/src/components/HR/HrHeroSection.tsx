import {ArrowRight, Sparkles} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import type {Hr} from '@/payload-types';
import {HIGHLIGHT_ICONS} from '@/data/hr-ui';
import {sectionEyebrow} from '@/lib/sections';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {PlaceholderImage} from '@/components/About/AboutShared';
import {mediaSlot} from '@/lib/media';

export function HrHeroSection({hr}: {hr: Hr}) {
  const tc = useTranslations('Common');
  const highlights = hr.highlights ?? [];

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-primary/10 via-transparent to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="size-4 text-primary" />
              {sectionEyebrow(hr.sections, 'hero')}
            </div>

            <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              {hr.title}
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-foreground/90">
              {hr.summary}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/pages/contact">
                  {tc('contact')} <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/pages/about">{tc('learnCompany')}</Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {highlights.map((h, i) => {
                const Icon =
                  HIGHLIGHT_ICONS[i] ??
                  HIGHLIGHT_ICONS[HIGHLIGHT_ICONS.length - 1];
                return (
                  <Card key={h.id ?? i}>
                    <CardHeader className="pb-3">
                      <CardDescription className="flex items-center gap-2">
                        <Icon className="size-4 text-primary" />
                        {h.title}
                      </CardDescription>
                      <CardTitle className="text-base">
                        {h.description}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5">
            <PlaceholderImage slot={mediaSlot(hr.mediaSlots, 'hero-main')} />
            <div className="mt-4 grid gap-3 grid-cols-2">
              <PlaceholderImage slot={mediaSlot(hr.mediaSlots, 'hero-support-1')} />
              <PlaceholderImage slot={mediaSlot(hr.mediaSlots, 'hero-support-2')} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
