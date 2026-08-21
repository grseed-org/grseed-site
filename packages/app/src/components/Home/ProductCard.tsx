'use client';

import * as React from 'react';
import {useTranslations} from 'next-intl';
import {ArrowRightIcon, Sprout} from 'lucide-react';
import {Link} from '@/i18n/navigation';

import {Badge} from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {contentCardMediaFrameClass} from '@/components/Content/content-card-media';
import {cn} from '@/lib/utils';
import {LazyLoadImage} from '../LazyLoadImage';

const DRAG_CLICK_THRESHOLD = 8;

function DragAwareProductLink({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href: string;
}) {
  const pointerStartRef = React.useRef<{x: number; y: number} | null>(null);
  const draggedRef = React.useRef(false);

  return (
    <Link
      className={className}
      draggable={false}
      href={href}
      onClickCapture={event => {
        if (!draggedRef.current) return;
        event.preventDefault();
        event.stopPropagation();
        draggedRef.current = false;
      }}
      onPointerDown={event => {
        pointerStartRef.current = {x: event.clientX, y: event.clientY};
        draggedRef.current = false;
      }}
      onPointerMove={event => {
        const start = pointerStartRef.current;
        if (!start) return;
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        if (Math.hypot(dx, dy) > DRAG_CLICK_THRESHOLD) {
          draggedRef.current = true;
        }
      }}
      onPointerUp={() => {
        pointerStartRef.current = null;
      }}
    >
      {children}
    </Link>
  );
}

export interface ProductCardProps {
  title: string;
  summary: string;
  tag: string;
  coverUrl?: string;
  className?: string;
  productSlug?: string;
}

export function ProductCard({
  title,
  summary,
  tag,
  coverUrl,
  className,
  productSlug,
}: ProductCardProps) {
  const href = productSlug ? `/product/${productSlug}` : '/product';

  return (
    <DragAwareProductLink className="block h-full" href={href}>
      <Card
        className={cn(
          'group flex h-full min-h-[260px] flex-col overflow-hidden transition-shadow hover:shadow-md',
          className,
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-lg leading-tight md:text-xl">
              {title}
            </CardTitle>
            <Badge variant="secondary" className="shrink-0">
              {tag}
            </Badge>
          </div>
          {summary ? (
            <CardDescription className="line-clamp-2 text-sm leading-relaxed">
              {summary}
            </CardDescription>
          ) : null}
        </CardHeader>
        <CardContent className="pt-0">
          {coverUrl ? (
            <div className={contentCardMediaFrameClass}>
              <LazyLoadImage
                src={coverUrl}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </div>
          ) : (
            <div
              className={cn(
                contentCardMediaFrameClass,
                'flex items-center justify-center bg-linear-to-br from-primary/16 via-primary/8 to-background p-6 text-center',
              )}
            >
              <div>
                <div className="mx-auto flex size-12 items-center justify-center rounded-md bg-background/82 text-primary shadow-sm">
                  <Sprout className="size-6" />
                </div>
                <div className="mt-3 text-sm font-medium text-foreground">
                  {title}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  品种资料待更新
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </DragAwareProductLink>
  );
}

export function ProductAllCard({className}: {className?: string}) {
  const tc = useTranslations('Common');

  return (
    <DragAwareProductLink
      href="/product"
      className={cn('group block h-full', className)}
    >
      <Card className="flex h-full min-h-[260px] items-center justify-center border-dashed bg-muted/20 transition-colors hover:bg-muted/40">
        <CardContent className="flex flex-col items-center justify-center gap-3 p-6 text-center">
          <span className="flex size-12 items-center justify-center rounded-full border bg-background shadow-sm transition-transform group-hover:translate-x-1">
            <ArrowRightIcon aria-hidden="true" className="size-5" />
          </span>
          <span className="text-base font-semibold">{tc('viewAll')}</span>
        </CardContent>
      </Card>
    </DragAwareProductLink>
  );
}
