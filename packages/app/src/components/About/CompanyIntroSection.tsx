import {Award, CheckCircle2, ShieldCheck} from 'lucide-react';
import {useTranslations} from 'next-intl';
import type {About} from '@/payload-types';
import {MILESTONE_ICONS} from '@/data/about-ui';
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

export function CompanyIntroSection({about}: {about: About}) {
  const t = useTranslations('About');
  // The intro block's two paragraphs are stored as one markdown body, split on
  // blank lines — keeping them in a single editorial field, not two.
  const paragraphs = sectionBody(about.sections, 'company-intro')
    .split('\n\n')
    .map(p => p.trim())
    .filter(Boolean);
  const milestones = about.milestones ?? [];

  return (
    <section className="bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="text-sm font-semibold text-primary">
              {sectionEyebrow(about.sections, 'company-intro')}
            </div>
            <h2 className="mt-1 text-2xl font-bold">
              {sectionHeading(about.sections, 'company-intro')}
            </h2>
            {paragraphs.map((p, i) => (
              <p key={i} className="mt-4 leading-7 text-foreground/90">
                {p}
              </p>
            ))}

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1">
                <ShieldCheck className="size-4" />
                {t('badgeAssociation')}
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Award className="size-4" />
                {t('badgeLeader')}
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="size-4" />
                {t('badgeIso')}
              </Badge>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Card>
              <CardHeader>
                <CardTitle>{sectionHeading(about.sections, 'milestones')}</CardTitle>
                <CardDescription>
                  {sectionBody(about.sections, 'milestones')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {milestones.map((m, i) => {
                  // Icon joined by index (see data/about-ui.ts); falls back to the
                  // last icon if the editor adds more milestones than icons.
                  const Icon =
                    MILESTONE_ICONS[i] ??
                    MILESTONE_ICONS[MILESTONE_ICONS.length - 1];
                  return (
                    <div key={m.id ?? i}>
                      {i > 0 ? <Separator className="mb-4" /> : null}
                      <div className="flex items-start gap-3">
                        <div className="mt-1 grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <div className="font-semibold">{m.year}</div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            {m.body}
                          </div>
                        </div>
                      </div>
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
