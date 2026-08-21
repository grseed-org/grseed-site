import {Award, BookOpen, Users} from 'lucide-react';
import {useTranslations} from 'next-intl';
import type {Hr} from '@/payload-types';
import {JOURNEY_ICONS} from '@/data/hr-ui';
import {sectionBody, sectionEyebrow, sectionHeading} from '@/lib/sections';
import {Badge} from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';

export function HrPhilosophySection({hr}: {hr: Hr}) {
  const t = useTranslations('Hr');
  const journey = hr.journey ?? [];

  return (
    <section className="bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <div className="text-sm font-semibold text-primary">
              {sectionEyebrow(hr.sections, 'philosophy')}
            </div>
            <h2 className="mt-1 text-2xl font-bold">
              {sectionHeading(hr.sections, 'philosophy')}
            </h2>
            <p className="mt-4 leading-7 text-foreground/90">
              {sectionBody(hr.sections, 'philosophy')}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1">
                <Award className="size-4" />
                {t('badgeMission')}
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Users className="size-4" />
                {t('badgeIdeal')}
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <BookOpen className="size-4" />
                {t('badgeTraining')}
              </Badge>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Card>
              <CardHeader>
                <CardTitle>{sectionHeading(hr.sections, 'journey')}</CardTitle>
                <CardDescription>
                  {sectionBody(hr.sections, 'journey')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {journey.map((step, idx) => {
                  const Icon =
                    JOURNEY_ICONS[idx] ??
                    JOURNEY_ICONS[JOURNEY_ICONS.length - 1];
                  return (
                    <div key={step.id ?? idx}>
                      <div className="flex items-start gap-3">
                        <div className="mt-1 grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="size-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-semibold">{step.title}</div>
                            <Badge variant="outline">{idx + 1}</Badge>
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            {step.description}
                          </div>
                        </div>
                      </div>
                      {idx < journey.length - 1 ? (
                        <Separator className="my-4" />
                      ) : null}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
