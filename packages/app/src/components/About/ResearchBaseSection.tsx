import {FlaskConical, MapPin} from 'lucide-react';
import {useTranslations} from 'next-intl';
import type {About} from '@/payload-types';
import type {AboutDerived} from '@/lib/about';
import {sectionBody, sectionEyebrow, sectionHeading} from '@/lib/sections';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import {Separator} from '@/components/ui/separator';
import {PlaceholderImage} from './AboutShared';

function StatCard({label, value}: {label?: string | null; value: string}) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl font-bold">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}

export function ResearchBaseSection({
  about,
  stats,
}: {
  about: About;
  stats: AboutDerived['stats'];
}) {
  const t = useTranslations('About');
  const statLabels = {
    products: t('researchStatProducts'),
    groups: t('researchStatGroups'),
    national: t('researchStatNational'),
    provincial: t('researchStatProvincial'),
  } as const;
  const researchSlots =
    about.mediaSlots?.filter(slot => slot.key.startsWith('research-')) ?? [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <div>
        <div className="text-sm font-semibold text-primary">
          {sectionEyebrow(about.sections, 'research-base')}
        </div>
        <h2 className="mt-1 text-2xl font-bold">
          {sectionHeading(about.sections, 'research-base')}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {sectionBody(about.sections, 'research-base')}
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>
                {sectionHeading(about.sections, 'research-location')}
              </CardTitle>
              <CardDescription>{t('researchLocationCardDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <div className="font-semibold">
                    {sectionHeading(about.sections, 'research-location')}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {sectionBody(about.sections, 'research-location')}
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <div className="mt-1 grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <FlaskConical className="size-5" />
                </div>
                <div>
                  <div className="font-semibold">
                    {sectionHeading(about.sections, 'research-breeding')}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {sectionBody(about.sections, 'research-breeding')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7">
          {/* 统计卡片：手机端轮播 */}
          <div className="block sm:hidden">
            <Carousel slideCount={stats.length}>
              <CarouselContent className="-ml-4">
                {stats.map((stat, index) => (
                  <CarouselItem
                    key={stat.key}
                    index={index}
                    className="pl-4 basis-[70%]"
                  >
                    <StatCard label={statLabels[stat.key]} value={stat.value} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* 统计卡片：电脑端网格 */}
          <div className="hidden sm:grid sm:grid-cols-2 gap-6">
            {stats.map(stat => (
              <StatCard
                key={stat.key}
                label={statLabels[stat.key]}
                value={stat.value}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 图片展示：手机端轮播 */}
      <div className="mt-10 block sm:hidden">
        <Carousel slideCount={researchSlots.length}>
          <CarouselContent className="-ml-4">
            {researchSlots.map((slot, index) => (
              <CarouselItem
                key={slot.key}
                index={index}
                className="pl-4 basis-[85%]"
              >
                <PlaceholderImage slot={slot} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* 图片展示：电脑端网格 */}
      <div className="mt-10 hidden sm:grid sm:grid-cols-3 gap-6">
        {researchSlots.map(slot => (
          <PlaceholderImage key={slot.key} slot={slot} />
        ))}
      </div>
    </section>
  );
}
