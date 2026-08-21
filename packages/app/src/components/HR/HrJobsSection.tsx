import {useTranslations} from 'next-intl';

import {Link} from '@/i18n/navigation';
import type {PostItem} from '@/lib/types';

import ContentCard from '@/components/Content/ContentCard';
import {Button} from '@/components/ui/button';

const DETAIL_BASE = '/pages/hr';

export function HrJobsSection({posts}: {posts: PostItem[]}) {
  const t = useTranslations('Hr');
  const tc = useTranslations('Common');
  const items = posts.map(post => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    summary: post.summary,
    coverUrl: post.coverUrl,
    tags: post.tags.map(tag => tag.name),
    href: `${DETAIL_BASE}/${post.slug}`,
  }));

  return (
    <section className="scroll-mt-24" id="jobs">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="text-sm font-semibold text-primary">
          {t('jobsEyebrow')}
        </div>
        <h2 className="mt-1 text-2xl font-bold">{t('jobsHeading')}</h2>

        {items.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map(item => (
              <ContentCard item={item} key={item.id} />
            ))}
          </div>
        ) : (
          <p className="mt-6 leading-7 text-foreground/90">
            {t('jobsEmpty')}{' '}
            <Button
              asChild
              className="h-auto p-0 align-baseline"
              variant="link"
            >
              <Link href="/pages/contact">{tc('contact')}</Link>
            </Button>
          </p>
        )}
      </div>
    </section>
  );
}
