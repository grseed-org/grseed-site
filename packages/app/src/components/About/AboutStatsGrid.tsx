import * as React from 'react';
import {useTranslations} from 'next-intl';
import type {AboutDerived} from '@/lib/about';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

interface StatItem {
  label: string;
  value: string;
}

const StatCard: React.FC<StatItem> = ({label, value}) => (
  <Card className="h-full">
    <CardHeader className="pb-3">
      <CardDescription>{label}</CardDescription>
      <CardTitle className="text-2xl">{value}</CardTitle>
    </CardHeader>
    <CardContent className="pt-0" />
  </Card>
);

export const StatsGrid: React.FC<{stats: AboutDerived['stats']}> = ({
  stats,
}) => {
  const t = useTranslations('About');
  const labels = {
    products: t('researchStatProducts'),
    groups: t('researchStatGroups'),
    national: t('researchStatNational'),
    provincial: t('researchStatProvincial'),
  } as const;
  const statsData = stats.map(stat => ({
    label: labels[stat.key],
    value: stat.value,
  }));

  return (
    <div className="mt-10 w-full">
      <Carousel className="w-full" slideCount={statsData.length}>
        <CarouselContent className="-ml-4">
          {statsData.map((stat, index) => (
            <CarouselItem
              key={stat.label}
              index={index}
              className="pl-4 basis-[65%] sm:basis-1/3"
            >
              <StatCard {...stat} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
