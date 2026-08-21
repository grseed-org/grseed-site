import {useLocale, useTranslations} from 'next-intl';

import {Link} from '@/i18n/navigation';
import type {ProductItem} from '@/lib/types';

import {ImageGalleryProvider} from '@/components/Media/ImageGalleryProvider';
import {ProductImageGallery} from '@/components/Media/ProductImageGallery';
import type {GalleryImage} from '@/components/Media/types';
import RichTextContent, {
  richTextImageItems,
} from '@/components/RichTextContent';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const toGalleryImage = (
  image: {url: string; alt?: string; caption?: string},
  fallback: string,
): GalleryImage => ({
  src: image.url,
  thumbnail: image.url,
  title: image.caption ?? image.alt ?? fallback,
  ...(image.alt ? {alt: image.alt} : {alt: fallback}),
  ...(image.caption ? {description: image.caption} : {}),
});

export default function ProductView({product}: {product: ProductItem}) {
  const locale = useLocale();
  const t = useTranslations('Product');
  const tc = useTranslations('Credential');
  const tg = useTranslations('Gallery');
  const groupedFacts = product.facts.reduce(
    (acc, fact) => {
      (acc[fact.group] ??= []).push(fact);
      return acc;
    },
    {} as Record<ProductItem['facts'][number]['group'], ProductItem['facts']>,
  );
  const productGalleryImages = product.gallery.map(image =>
    toGalleryImage(image, product.name),
  );
  const bodyImages = product.body ? richTextImageItems(product.body) : [];
  const bodyStartIndex = productGalleryImages.length;
  const credentialStartIndex = bodyStartIndex + bodyImages.length;
  const credentialCards = product.credentials.reduce<{
    cards: Array<
      (typeof product.credentials)[number] & {
        firstGalleryIndex: number;
        images: GalleryImage[];
      }
    >;
    imageCount: number;
  }>(
    (acc, item) => {
      const images = item.documentImages.map(image =>
        toGalleryImage(image, item.title),
      );
      return {
        cards: [
          ...acc.cards,
          {
            ...item,
            firstGalleryIndex: credentialStartIndex + acc.imageCount,
            images,
          },
        ],
        imageCount: acc.imageCount + images.length,
      };
    },
    {cards: [], imageCount: 0},
  ).cards;
  const galleryImages = [
    ...productGalleryImages,
    ...bodyImages,
    ...credentialCards.flatMap(item => item.images),
  ];

  return (
    <ImageGalleryProvider
      images={galleryImages}
      labels={{
        close: tg('close'),
        next: tg('next'),
        previous: tg('previous'),
        thumbnails: tg('thumbnails'),
        zoomIn: tg('zoomIn'),
        zoomOut: tg('zoomOut'),
      }}
    >
      <main className="mx-auto w-10/12 max-w-7xl space-y-8 py-8">
        <div className="space-y-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/product">{t('back')}</Link>
          </Button>
          {product.updatedAt ? (
            <p className="text-muted-foreground text-sm">
              {t('updatedAt', {
                date: new Date(String(product.updatedAt)).toLocaleString(
                  locale,
                ),
              })}
            </p>
          ) : null}
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <h1 className="text-3xl font-semibold leading-tight">
                {product.name}
              </h1>
              {product.description ? (
                <p className="mt-3 text-muted-foreground">
                  {product.description}
                </p>
              ) : null}
              {product.tags.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.tags.map(tag => (
                    <Badge key={tag.slug} variant="outline">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>

            {productGalleryImages.length > 0 ? (
              <div className="lg:col-span-7">
                <ProductImageGallery
                  images={productGalleryImages}
                  title={product.name}
                />
              </div>
            ) : null}
          </div>
        </div>

        {product.body ? (
          <RichTextContent
            content={product.body}
            galleryStartIndex={bodyStartIndex}
          />
        ) : null}

        {product.facts.length > 0 ? (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">{t('factsTitle')}</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(groupedFacts).map(([group, facts]) => (
                <Card key={group}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {t(`factGroups.${group}`)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {facts.map((fact, index) => (
                      <div key={`${fact.label}-${index}`}>
                        <div className="text-sm font-medium">{fact.label}</div>
                        <div className="mt-1 text-sm leading-6 text-muted-foreground">
                          {fact.value}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ) : null}

        {credentialCards.length > 0 ? (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">{t('credentialsTitle')}</h2>
            <div className="grid items-start gap-4 md:grid-cols-2">
              {credentialCards.map(item => (
                <Card
                  className="w-fit max-w-full justify-self-start"
                  key={item.id}
                >
                  <CardHeader>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge>{tc(`types.${item.type}`)}</Badge>
                      {item.level ? (
                        <Badge variant="outline">
                          {tc(`levels.${item.level}`)}
                        </Badge>
                      ) : null}
                      {item.year ? (
                        <Badge variant="outline">{item.year}</Badge>
                      ) : null}
                    </div>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                    {item.summary ? (
                      <CardDescription>{item.summary}</CardDescription>
                    ) : null}
                  </CardHeader>
                  {item.documentImages[0] ? (
                    <CardContent className="px-4">
                      <button
                        aria-label={item.documentImages[0].alt ?? item.title}
                        className="mx-auto block w-fit max-w-full cursor-zoom-in overflow-hidden rounded-md border bg-muted/20"
                        data-gallery-index={item.firstGalleryIndex}
                        type="button"
                      >
                        <img
                          alt={item.documentImages[0].alt ?? item.title}
                          className="h-auto max-h-[34rem] w-auto max-w-full object-contain"
                          loading="lazy"
                          src={item.documentImages[0].url}
                        />
                      </button>
                    </CardContent>
                  ) : null}
                </Card>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </ImageGalleryProvider>
  );
}
