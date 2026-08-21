import {BookOpen, Lightbulb, Users} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import type {Hr} from '@/payload-types';
import {sectionBody, sectionEyebrow, sectionHeading} from '@/lib/sections';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {PlaceholderImage} from '@/components/About/AboutShared';
import {mediaSlot} from '@/lib/media';

export function HrFutureSection({hr}: {hr: Hr}) {
  const t = useTranslations('Hr');
  const tc = useTranslations('Common');
  return (
    <section className="bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <div className="text-sm font-semibold text-primary">
              {sectionEyebrow(hr.sections, 'future')}
            </div>
            <h2 className="mt-1 text-2xl font-bold">
              {sectionHeading(hr.sections, 'future')}
            </h2>
            <p className="mt-4 leading-7 text-foreground/90">
              {sectionBody(hr.sections, 'future')}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/pages/contact">{tc('applyConsult')}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/product">{tc('learnProductsBusiness')}</Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1">
                <Users className="size-4" />
                {t('badgeMutual')}
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Lightbulb className="size-4" />
                {t('badgeInnovation')}
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <BookOpen className="size-4" />
                {t('badgeLearning')}
              </Badge>
            </div>
          </div>
          <div className="lg:col-span-5">
            <Card>
              <CardContent className="space-y-3 pt-6">
                <PlaceholderImage slot={mediaSlot(hr.mediaSlots, 'future-1')} />
                <PlaceholderImage slot={mediaSlot(hr.mediaSlots, 'future-2')} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
