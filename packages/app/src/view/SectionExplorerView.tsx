'use client';

import {useEffect, useState, useTransition} from 'react';

import {useTranslations} from 'next-intl';
import {useRouter} from '@/i18n/navigation';
import type {CategoryItem, SectionExplorerItem, TagItem} from '@/lib/types';

import ContentCard from '@/components/Content/ContentCard';
import {startRouteProgress} from '@/components/RouteProgressBar';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';

function normalize(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export type SectionExplorerViewProps = {
  pageTitle?: string;
  pageDescription?: string;
  basePath: string;
  items: SectionExplorerItem[];
  total?: number;
  categories?: CategoryItem[];
  tags: TagItem[];
  activeCategory?: string;
  activeTags?: string[];
  activeQ?: string;
};

// Client filter shell. Data is fetched by the server route; this component only
// writes category/tag/q to the URL and lets the server component re-render.
export default function SectionExplorerView({
  pageTitle = '',
  pageDescription = '',
  basePath,
  items,
  total,
  categories = [],
  tags,
  activeCategory,
  activeTags = [],
  activeQ = '',
}: SectionExplorerViewProps) {
  const t = useTranslations('Explorer');
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [draftQ, setDraftQ] = useState(activeQ);

  useEffect(() => {
    // Sync local input state when server-rendered URL params change.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraftQ(activeQ);
  }, [activeQ]);

  const pushWith = (next: {
    category?: string | null;
    tags?: string[];
    q?: string;
  }) => {
    const nextCategory =
      next.category === undefined
        ? activeCategory
        : (next.category ?? undefined);
    const nextTags = next.tags ?? activeTags;
    const nextQ = next.q ?? activeQ;
    const params = new URLSearchParams();
    const normalizedCategory = normalize(nextCategory);
    const normalizedQ = normalize(nextQ);
    if (normalizedCategory) params.set('category', normalizedCategory);
    for (const tag of nextTags) {
      const normalizedTag = normalize(tag);
      if (normalizedTag) params.append('tag', normalizedTag);
    }
    if (normalizedQ) params.set('q', normalizedQ);

    const qs = params.toString();
    startTransition(() => {
      startRouteProgress();
      router.replace(qs ? `${basePath}?${qs}` : basePath);
    });
  };

  useEffect(() => {
    const handle = window.setTimeout(() => {
      if ((normalize(draftQ) ?? '') === (normalize(activeQ) ?? '')) return;
      pushWith({q: draftQ});
    }, 300);
    return () => window.clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftQ]);

  const hasFilters =
    !!activeCategory || activeTags.length > 0 || activeQ.length > 0;
  const activeTagSet = new Set(activeTags);

  const toggleTag = (slug: string) => {
    pushWith({
      tags: activeTagSet.has(slug)
        ? activeTags.filter(activeSlug => activeSlug !== slug)
        : [...activeTags, slug],
    });
  };

  return (
    <div className="mx-auto mt-4 w-10/12 max-w-6xl space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{pageTitle}</h1>
          <p className="text-muted-foreground text-sm">{pageDescription}</p>
        </div>
        {hasFilters ? (
          <Button
            variant="outline"
            onClick={() => {
              startRouteProgress();
              router.replace(basePath);
            }}
          >
            {t('clear')}
          </Button>
        ) : null}
      </div>

      <div className="grid gap-4">
        <div className="w-full max-w-xl">
          <Input
            placeholder={t('searchPlaceholder')}
            value={draftQ}
            onChange={event => setDraftQ(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter') pushWith({q: draftQ});
            }}
          />
        </div>

        {categories.length > 0 ? (
          <div className="space-y-2">
            <FilterHeading label={t('categories')} pending={pending} />

            <div className="flex flex-wrap gap-2">
              <Button
                size="xs"
                variant={!activeCategory ? 'default' : 'outline'}
                onClick={() => pushWith({category: null})}
              >
                {t('all')}
              </Button>
              {categories.map(item => (
                <Button
                  key={`${item.slug}:${item.id}`}
                  size="xs"
                  variant={activeCategory === item.slug ? 'default' : 'outline'}
                  onClick={() => pushWith({category: item.slug})}
                >
                  {item.name}
                </Button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="space-y-2">
          <FilterHeading label={t('tags')} pending={pending} />

          <div className="flex flex-wrap gap-2">
            <Button
              size="xs"
              variant={activeTags.length === 0 ? 'default' : 'outline'}
              onClick={() => pushWith({tags: []})}
            >
              {t('all')}
            </Button>
            {tags.map(item => {
              const active = activeTagSet.has(item.slug);
              return (
                <Button
                  aria-pressed={active}
                  key={`${item.slug}:${item.id}`}
                  size="xs"
                  variant={active ? 'default' : 'outline'}
                  onClick={() => toggleTag(item.slug)}
                >
                  {item.name}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          {t('itemsCount', {
            visible: items.length,
            total: typeof total === 'number' ? total : items.length,
          })}
        </div>
        {pending ? <Badge variant="secondary">{t('updating')}</Badge> : null}
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map(item => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t('noResults')}</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            {t('noResultsDescription')}
          </CardContent>
        </Card>
      )}
      <div className="mb-5" />
    </div>
  );
}

function FilterHeading({label, pending}: {label: string; pending: boolean}) {
  const t = useTranslations('Explorer');

  return (
    <div className="flex items-center justify-between">
      <div className="text-muted-foreground text-sm">{label}</div>
      {pending ? (
        <div className="text-muted-foreground text-xs">{t('updating')}</div>
      ) : null}
    </div>
  );
}
