import {LazyLoadImage} from '@/components/LazyLoadImage';
import {mediaUrl, type MediaSlot} from '@/lib/media';
import {cn} from '@/lib/utils';

export function PlaceholderImage({
  label,
  slot,
  className,
}: {
  label?: string;
  slot?: MediaSlot;
  className?: string;
}) {
  const src = mediaUrl(slot?.image);
  if (src) {
    return (
      <LazyLoadImageContainer
        src={src}
        alt={slot?.alt ?? label ?? ''}
        className={cn('aspect-16/10', className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border bg-linear-to-br from-primary/15 via-primary/5 to-background',
        className,
      )}
    >
      <div className="aspect-16/10" />
      {label ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="rounded-full border bg-background/80 px-3 py-1 text-xs text-muted-foreground">
            {label}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function LazyLoadImageContainer({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={cn('rounded-xl overflow-hidden', className)}>
      <LazyLoadImage
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
