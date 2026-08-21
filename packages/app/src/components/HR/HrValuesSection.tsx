import {HeartHandshake} from 'lucide-react';
import {useTranslations} from 'next-intl';
import type {LucideIcon} from 'lucide-react';
import type {Hr} from '@/payload-types';
import {VALUE_DECOR} from '@/data/hr-ui';
import {sectionBody, sectionEyebrow, sectionHeading} from '@/lib/sections';
import {Badge} from '@/components/ui/badge';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

function HrSectionCard({
  title,
  content,
  Icon,
  badge,
}: {
  title: string;
  content: string;
  Icon: LucideIcon;
  badge: string;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-5" />
          </div>
          <Badge variant="secondary" className="shrink-0">
            {badge}
          </Badge>
        </div>
        <CardTitle className="text-base leading-6">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="leading-7 text-sm text-muted-foreground">{content}</p>
      </CardContent>
    </Card>
  );
}

export function HrValuesSection({hr}: {hr: Hr}) {
  const t = useTranslations('Hr');
  // The five philosophy values are the keyless `sections` entries (keyed ones —
  // e.g. 'future' — belong to other components). Icon/tone joined by index.
  const values = (hr.sections ?? []).filter(s => !s.key);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-primary">
            {sectionEyebrow(hr.sections, 'values')}
          </div>
          <h2 className="mt-1 text-2xl font-bold">
            {sectionHeading(hr.sections, 'values')}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {sectionBody(hr.sections, 'values')}
          </p>
        </div>
        <Badge variant="secondary" className="hidden sm:inline-flex gap-1">
          <HeartHandshake className="size-4" />
          {t('valuesBadge')}
        </Badge>
      </div>

      {/* 手机端布局：Carousel (仅在 sm 以下显示) */}
      <div className="mt-8 block sm:hidden">
        <Carousel className="w-full" slideCount={values.length}>
          <CarouselContent className="-ml-4">
            {values.map((section, idx) => (
              <CarouselItem
                key={section.id ?? idx}
                index={idx}
                className="pl-4 basis-[85%]"
              >
                <HrSectionCard
                  title={section.heading ?? ''}
                  content={section.body ?? ''}
                  Icon={VALUE_DECOR[idx]?.icon ?? VALUE_DECOR[0].icon}
                  badge={t('valueCardBadge', {index: idx + 1})}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* 电脑端布局：Grid (仅在 sm 及以上显示) */}
      <div className="mt-8 hidden sm:grid sm:grid-cols-1 lg:grid-cols-2 gap-6">
        {values.map((section, idx) => (
          <HrSectionCard
            key={section.id ?? idx}
            title={section.heading ?? ''}
            content={section.body ?? ''}
            Icon={VALUE_DECOR[idx]?.icon ?? VALUE_DECOR[0].icon}
            badge={t('valueCardBadge', {index: idx + 1})}
          />
        ))}
      </div>
    </section>
  );
}
