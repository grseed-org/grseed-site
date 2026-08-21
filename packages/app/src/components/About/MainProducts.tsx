import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Sprout} from 'lucide-react';
import {useTranslations} from 'next-intl';
import type {AboutProductGroup} from '@/lib/about';
import type {About} from '@/payload-types';
import {sectionBody, sectionEyebrow, sectionHeading} from '@/lib/sections';

export function MainProductsSection({
  about,
  groups,
}: {
  about: About;
  groups: AboutProductGroup[];
}) {
  const t = useTranslations('About');

  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-primary">
            {sectionEyebrow(about.sections, 'products')}
          </div>
          <h2 className="mt-1 text-2xl font-bold">
            {sectionHeading(about.sections, 'products')}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {sectionBody(about.sections, 'products')}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {groups.map(group => {
          const varieties = group.varieties;
          return (
            <Card key={group.slug} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">{group.title}</CardTitle>
                  <Badge variant="secondary" className="gap-1">
                    <Sprout className="size-4" />
                    {t('varietyCount', {count: varieties.length})}
                  </Badge>
                </div>
                <CardDescription>{group.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {varieties.map(v => (
                    <Badge key={v.id} variant="outline">
                      {v.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="mt-auto" />
            </Card>
          );
        })}
      </div>
    </section>
  );
}
