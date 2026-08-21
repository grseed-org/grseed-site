import {Link} from '@/i18n/navigation';

import type {SectionExplorerItem} from '@/lib/types';
import {cn} from '@/lib/utils';

import {Badge} from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {contentCardMediaClass} from '@/components/Content/content-card-media';

export type ContentCardProps = {
  item: SectionExplorerItem;
  className?: string;
};

export default function ContentCard({item, className}: ContentCardProps) {
  return (
    <Link
      href={item.href}
      className="group/content-card block h-full rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/32"
      aria-label={item.title}
    >
      <Card
        className={cn(
          'h-full cursor-pointer transition-all duration-200 group-hover/content-card:-translate-y-0.5 group-hover/content-card:border-primary/40 group-hover/content-card:shadow-md group-active/content-card:translate-y-0',
          className,
        )}
      >
        <CardHeader className="space-y-3">
          <div className="min-w-0">
            <CardTitle className="truncate group-hover/content-card:underline">
              {item.title}
            </CardTitle>
            {item.summary ? (
              <CardDescription className="mt-1 line-clamp-2">
                {item.summary}
              </CardDescription>
            ) : null}
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-0">
          {item.coverUrl ? (
            <img
              src={item.coverUrl}
              alt={item.title}
              loading="lazy"
              className={contentCardMediaClass}
            />
          ) : null}

          {item.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2" aria-hidden="true">
              {item.tags.slice(0, 6).map(tag => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
              {item.tags.length > 6 ? (
                <Badge variant="secondary">+{item.tags.length - 6}</Badge>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  );
}
