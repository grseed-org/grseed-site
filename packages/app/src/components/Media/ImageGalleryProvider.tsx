'use client';

import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
} from 'lucide-react';
import React from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

import type {GalleryImage} from './types';

interface GalleryContextValue {
  open: (index: number) => void;
}

const GalleryContext = React.createContext<GalleryContextValue | null>(null);

export function useImageGallery() {
  const context = React.useContext(GalleryContext);
  if (!context) {
    throw new Error('useImageGallery must be used within ImageGalleryProvider');
  }
  return context;
}

export function ImageGalleryProvider({
  children,
  images,
  labels,
}: {
  children: React.ReactNode;
  images: GalleryImage[];
  labels?: {
    close: string;
    next: string;
    previous: string;
    thumbnails: string;
    zoomIn: string;
    zoomOut: string;
  };
}) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const slides = React.useMemo(
    () =>
      images.map(image => ({
        src: image.src,
        alt: image.alt,
        title: image.title,
        description: image.description,
        thumbnail: image.thumbnail ?? image.src,
      })),
    [images],
  );

  const open = React.useCallback(
    (index: number) => {
      if (index >= 0 && index < slides.length) {
        setActiveIndex(index);
      }
    },
    [slides.length],
  );

  const close = React.useCallback(() => setActiveIndex(null), []);

  const handleClickCapture = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const trigger = target.closest<HTMLElement>('[data-gallery-index]');
      if (!trigger || !event.currentTarget.contains(trigger)) return;

      const index = Number(trigger.dataset.galleryIndex);
      if (!Number.isInteger(index)) return;

      event.preventDefault();
      open(index);
    },
    [open],
  );

  return (
    <GalleryContext.Provider value={{open}}>
      <div onClickCapture={handleClickCapture}>{children}</div>
      {slides.length > 0 ? (
        <Lightbox
          animation={{fade: 180, swipe: 260, zoom: 220}}
          carousel={{imageFit: 'contain', padding: '24px'}}
          className="gr-gallery-lightbox"
          close={close}
          controller={{closeOnBackdropClick: true}}
          index={activeIndex ?? 0}
          labels={{
            Close: labels?.close ?? 'Back',
            Next: labels?.next ?? 'Next image',
            Previous: labels?.previous ?? 'Previous image',
            Thumbnails: labels?.thumbnails ?? 'Image thumbnails',
            'Zoom in': labels?.zoomIn ?? 'Zoom in',
            'Zoom out': labels?.zoomOut ?? 'Zoom out',
            '{index} of {total}': '{index} / {total}',
          }}
          on={{view: ({index}) => setActiveIndex(index)}}
          open={activeIndex !== null}
          plugins={[Thumbnails, Zoom]}
          render={{
            iconClose: () => (
              <>
                <ArrowLeftIcon className="gr-gallery-back-icon" />
                <XIcon className="gr-gallery-close-icon" />
              </>
            ),
            iconNext: () => <ChevronRightIcon />,
            iconPrev: () => <ChevronLeftIcon />,
          }}
          slides={slides}
          thumbnails={{
            border: 1,
            borderRadius: 4,
            gap: 8,
            height: 64,
            imageFit: 'cover',
            padding: 2,
            position: 'bottom',
            showToggle: false,
            vignette: false,
            width: 96,
          }}
          zoom={{
            doubleClickMaxStops: 3,
            keyboardMoveDistance: 80,
            maxZoomPixelRatio: 2,
            scrollToZoom: true,
            wheelZoomDistanceFactor: 120,
          }}
        />
      ) : null}
    </GalleryContext.Provider>
  );
}
