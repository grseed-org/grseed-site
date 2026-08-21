import {useLocale, useTranslations} from 'next-intl';

import {Link} from '@/i18n/navigation';
import type {PostItem, PostSection} from '@/lib/types';

import {ImageGalleryProvider} from '@/components/Media/ImageGalleryProvider';
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

const backHref: Record<PostSection, string> = {
  blog: '/blog',
  service: '/pages/service',
  research: '/pages/research',
};

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

export default function PostView({
  post,
  section,
}: {
  post: PostItem;
  section: PostSection;
}) {
  const locale = useLocale();
  const t = useTranslations('Post');
  const tc = useTranslations('Credential');
  const tg = useTranslations('Gallery');
  const coverImages: GalleryImage[] = post.coverUrl
    ? [{src: post.coverUrl, thumbnail: post.coverUrl, alt: post.title}]
    : [];
  const bodyImages = post.content ? richTextImageItems(post.content) : [];
  const bodyStartIndex = coverImages.length;
  const credentialStartIndex = bodyStartIndex + bodyImages.length;
  const credentialCards = post.credentials.reduce<{
    cards: Array<
      (typeof post.credentials)[number] & {
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
    ...coverImages,
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
      <main className="mx-auto w-10/12 max-w-3xl space-y-6 py-8">
        <div className="space-y-3">
          <Button asChild variant="outline" size="sm">
            <Link href={backHref[section]}>{t('back')}</Link>
          </Button>
          {post.updatedAt ? (
            <p className="text-muted-foreground text-sm">
              {t('updatedAt', {
                date: new Date(String(post.updatedAt)).toLocaleString(locale),
              })}
            </p>
          ) : null}
          {post.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <Badge key={tag.slug} variant="outline">
                  {tag.name}
                </Badge>
              ))}
            </div>
          ) : null}
          <h1 className="text-3xl font-semibold leading-tight">{post.title}</h1>
          {post.summary ? (
            <p className="text-muted-foreground">{post.summary}</p>
          ) : null}
        </div>

        {post.coverUrl ? (
          <button
            aria-label={post.title}
            className="block w-full cursor-zoom-in overflow-hidden rounded-md border bg-muted/20"
            data-gallery-index={0}
            type="button"
          >
            <img
              alt={post.title}
              className="max-h-[75vh] w-full object-contain"
              src={post.coverUrl}
            />
          </button>
        ) : null}

        {post.content ? (
          <RichTextContent
            content={post.content}
            galleryStartIndex={bodyStartIndex}
          />
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
