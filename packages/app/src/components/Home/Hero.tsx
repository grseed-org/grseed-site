'use client';

import {useEffect, useState} from 'react';
import {ArrowRight, Leaf, ShieldCheck, Sprout} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';

const heroImages = ['/img/home01.jpg', '/img/home02.jpg'] as const;

export interface HeroStat {
  label: string;
  value: string;
}

function HeroCarousel({
  className,
  slideClassName,
  intervalMs = 5000,
}: {
  className?: string;
  slideClassName?: string;
  intervalMs?: number;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveIndex(index => (index + 1) % heroImages.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden',
        className,
        slideClassName,
      )}
    >
      {heroImages.map((src, index) => (
        <img
          key={src}
          src={src}
          alt=""
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
            index === activeIndex ? 'opacity-100' : 'opacity-0',
          )}
          loading={index === 0 ? 'eager' : 'lazy'}
        />
      ))}
    </div>
  );
}

const heroProofItems = [
  {label: '科研育种', icon: Sprout},
  {label: '稳定制种', icon: ShieldCheck},
  {label: '推广服务', icon: Leaf},
] as const;

function StatTile({value, label}: {value: string; label: string}) {
  return (
    <div className="min-w-0 border-l border-primary/16 pl-3 first:border-l-0 first:pl-0 sm:pl-4 sm:first:pl-0">
      <div className="text-xl font-bold leading-none text-primary sm:text-2xl md:text-3xl">
        {value}
      </div>
      <div className="mt-2 text-xs leading-tight text-muted-foreground sm:text-sm">
        {label}
      </div>
    </div>
  );
}

// Editorial copy (slogan, companyName, tagline, stats) comes from the `home`
// global via props; chrome (button labels) from messages. The carousel stays
// client-side for its autoplay timer.
export default function Hero({
  slogan,
  companyName,
  tagline,
  stats = [],
}: {
  slogan: string;
  companyName: string;
  tagline: string;
  stats?: HeroStat[];
}) {
  const tc = useTranslations('Common');

  return (
    <section className="relative isolate overflow-hidden border-b bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-56 bg-linear-to-b from-primary/8 to-transparent" />

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:py-16 lg:min-h-[620px] lg:grid-cols-12 lg:items-center">
        <div className="min-w-0 lg:col-span-6">
          <h1 className="max-w-3xl text-[clamp(2rem,8.5vw,3.5rem)] font-bold leading-tight tracking-normal text-foreground md:text-6xl">
            <span className="block">{companyName}</span>
            <span className="mt-3 block break-words text-primary">
              {slogan}
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-foreground/75 md:mt-6 md:text-xl md:leading-8">
            {tagline}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/product" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                {tc('viewProducts')}
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href="/pages/contact" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                {tc('contact')}
              </Button>
            </Link>
          </div>

          {stats.length ? (
            <div className="mt-8 grid grid-cols-3 gap-3 border-y py-5 sm:mt-10 sm:gap-4 sm:py-6">
              {stats.map((s, i) => (
                <StatTile key={i} value={s.value} label={s.label} />
              ))}
            </div>
          ) : null}
        </div>

        <div className="hidden min-w-0 md:block lg:col-span-6">
          <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
            <div className="relative">
              <HeroCarousel slideClassName="aspect-[4/3] md:aspect-[16/10]" />
              <div className="absolute inset-x-0 bottom-0 hidden bg-linear-to-t from-black/58 to-transparent p-5 sm:block">
                <div className="grid grid-cols-3 gap-2">
                  {heroProofItems.map(item => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-2 rounded-md bg-white/88 px-3 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur"
                      >
                        <Icon className="size-4 shrink-0 text-primary" />
                        <span className="truncate">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-0 divide-x border-t bg-background sm:hidden">
              {heroProofItems.map(item => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex min-w-0 flex-col items-center gap-2 p-3 text-center text-xs font-medium"
                  >
                    <Icon className="size-4 text-primary" />
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
