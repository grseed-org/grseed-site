'use client';

import React from 'react';

import {cn} from '@/lib/utils';

import {useImageGallery} from './ImageGalleryProvider';
import type {GalleryImage} from './types';

export function ProductImageGallery({
  galleryStartIndex = 0,
  images,
  title,
}: {
  galleryStartIndex?: number;
  images: GalleryImage[];
  title: string;
}) {
  const {open} = useImageGallery();
  const [active, setActive] = React.useState(0);
  const current = images[active];

  if (!current) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-[72px_minmax(0,1fr)]">
      <div className="order-2 flex gap-2 overflow-x-auto pb-1 sm:order-1 sm:max-h-[28rem] sm:flex-col sm:overflow-y-auto sm:overflow-x-hidden sm:pb-0 sm:pr-1">
        {images.map((image, index) => (
          <button
            aria-label={`${title} ${index + 1}`}
            className={cn(
              'h-16 w-20 shrink-0 overflow-hidden rounded-md border bg-muted/20 transition sm:h-[72px] sm:w-[72px]',
              active === index
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-border opacity-80 hover:opacity-100',
            )}
            key={`${image.src}-${index}`}
            onClick={() => setActive(index)}
            type="button"
          >
            <img
              alt={image.alt ?? title}
              className="size-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
              src={image.thumbnail ?? image.src}
            />
          </button>
        ))}
      </div>

      <button
        aria-label={current.alt ?? title}
        className="order-1 block overflow-hidden rounded-md border bg-muted/20 sm:order-2"
        onClick={() => open(galleryStartIndex + active)}
        type="button"
      >
        <img
          alt={current.alt ?? title}
          className="aspect-[4/3] w-full object-cover"
          loading="eager"
          src={current.src}
        />
      </button>
    </div>
  );
}
