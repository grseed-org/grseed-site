import {Leaf} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import type {About} from '@/payload-types';
import type {AboutDerived} from '@/lib/about';
import {sectionEyebrow} from '@/lib/sections';
import {Button} from '@/components/ui/button';
import {mediaSlot} from '@/lib/media';
import {StatsGrid} from './AboutStatsGrid';
import {PlaceholderImage} from './AboutShared';

export function AboutHeroSection({
  about,
  stats,
}: {
  about: About;
  stats: AboutDerived['stats'];
}) {
  const tc = useTranslations('Common');
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-primary/10 via-transparent to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs text-muted-foreground">
              <Leaf className="size-4 text-primary" />
              {sectionEyebrow(about.sections, 'hero')}
            </div>

            <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              {about.companyName}
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-foreground/90">
              {about.summary}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/pages/contact">{tc('contact')}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/product">{tc('viewProducts')}</Link>
              </Button>
            </div>

            <StatsGrid stats={stats} />
          </div>

          <div className="lg:col-span-5">
            <PlaceholderImage
              slot={mediaSlot(about.mediaSlots, 'hero-main')}
              className="aspect-3/2"
            />
            <div className="mt-4 grid gap-3 grid-cols-2">
              <PlaceholderImage
                slot={mediaSlot(about.mediaSlots, 'hero-support-1')}
              />
              <PlaceholderImage
                slot={mediaSlot(about.mediaSlots, 'hero-support-2')}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
