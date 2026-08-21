import * as React from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  ProductAllCard,
  ProductCard,
  type ProductCardProps,
} from './ProductCard';

export interface HorizontalProductCarouselProps {
  productList: (ProductCardProps & {slug: string})[];
  className?: string;
}

const productCarouselItemClass =
  'basis-full w-full sm:basis-auto sm:w-[64%] lg:w-[46%] xl:w-[38%] 2xl:w-[34%]';
const MAX_PRODUCT_CAROUSEL_ITEMS = 6;

export const HorizontalProductCarousel: React.FC<
  HorizontalProductCarouselProps
> = ({productList, className}) => {
  if (!productList?.length) {
    return null;
  }

  const visibleProducts = productList.slice(0, MAX_PRODUCT_CAROUSEL_ITEMS);
  const slideCount = visibleProducts.length + 1;

  return (
    <Carousel
      className={[
        'w-full min-w-0 overflow-hidden md:overflow-visible',
        className ?? '',
      ].join(' ')}
      allowMouseDrag
      autoSize
      slidesPerMove={1}
      slideCount={slideCount}
    >
      <CarouselContent className="cursor-grab active:cursor-grabbing">
        {visibleProducts.map((product, index) => (
          <CarouselItem
            key={product.slug}
            index={index}
            className={productCarouselItemClass}
          >
            <ProductCard
              title={product.title}
              summary={product.summary}
              tag={product.tag}
              coverUrl={product.coverUrl}
              className="h-full"
              productSlug={product.slug}
            />
          </CarouselItem>
        ))}
        <CarouselItem
          index={visibleProducts.length}
          className={productCarouselItemClass}
        >
          <ProductAllCard className="h-full" />
        </CarouselItem>
      </CarouselContent>

      <CarouselIndicatorGroup className="mt-3 sm:hidden">
        {Array.from({length: slideCount}).map((_, index) => (
          <CarouselIndicator
            key={index}
            index={index}
            className="bg-primary/35 data-current:w-5 data-current:bg-primary"
          />
        ))}
      </CarouselIndicatorGroup>

      <CarouselPrevious className="hidden md:inline-flex md:-left-12" />
      <CarouselNext className="hidden md:inline-flex md:-right-12" />
    </Carousel>
  );
};
