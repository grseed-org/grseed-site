import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import type {About} from '@/payload-types';
import {sectionBody, sectionEyebrow, sectionHeading} from '@/lib/sections';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {PlaceholderImage} from './AboutShared';
import {mediaSlot} from '@/lib/media';

export function FutureSection({about}: {about: About}) {
  const tc = useTranslations('Common');
  return (
    <section className="bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <div className="text-sm font-semibold text-primary">
              {sectionEyebrow(about.sections, 'future')}
            </div>
            <h2 className="mt-1 text-2xl font-bold">
              {sectionHeading(about.sections, 'future')}
            </h2>
            <p className="mt-4 leading-7 text-foreground/90">
              {sectionBody(about.sections, 'future')}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/pages/contact">{tc('getContact')}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/pages/hr">{tc('joinUs')}</Link>
              </Button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <Card>
              <CardContent className="space-y-3 pt-6">
                <PlaceholderImage slot={mediaSlot(about.mediaSlots, 'future-1')} />
                <PlaceholderImage slot={mediaSlot(about.mediaSlots, 'future-2')} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
