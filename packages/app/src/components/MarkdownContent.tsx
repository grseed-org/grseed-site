import MarkdownIt from 'markdown-it';

import type {GalleryImage} from '@/components/Media/types';

// Markdown bodies render server-side in RSC with markdown-it (NOT Lexical — see
// the migration's out-of-scope note).
const createMarkdown = () =>
  new MarkdownIt({html: false, linkify: true, breaks: true});

export const PROSE =
  'text-sm leading-7 ' +
  '[&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:mt-6 [&_h1]:mb-3 ' +
  '[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-5 [&_h2]:mb-2 ' +
  '[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 ' +
  '[&_p]:my-3 [&_ul]:my-3 [&_ol]:my-3 [&_ul]:pl-6 [&_ol]:pl-6 ' +
  '[&_ul]:list-disc [&_ol]:list-decimal [&_a]:text-primary [&_a:hover]:underline [&_img]:my-3 ' +
  '[&_code]:rounded [&_code]:bg-accent [&_code]:px-1 [&_code]:py-0.5';

export const markdownImageClass =
  'my-3 max-h-[75vh] w-full rounded-md border bg-muted/20 object-contain';

function walkTokens(
  tokens: ReturnType<MarkdownIt['parse']>,
  visit: (token: (typeof tokens)[number]) => void,
) {
  for (const token of tokens) {
    visit(token);
    if (token.children) walkTokens(token.children, visit);
  }
}

export function markdownImageItems(markdown: string): GalleryImage[] {
  const trimmed = markdown.trim();
  if (!trimmed) return [];

  const md = createMarkdown();
  const images: GalleryImage[] = [];
  walkTokens(md.parse(trimmed, {}), token => {
    if (token.type !== 'image') return;
    const src = token.attrGet('src');
    if (!src) return;
    if (!md.validateLink(src)) return;
    images.push({
      src,
      ...(token.content ? {alt: token.content, title: token.content} : {}),
    });
  });
  return images;
}

export default function MarkdownContent({
  galleryStartIndex,
  markdown,
}: {
  galleryStartIndex?: number;
  markdown: string;
}) {
  const trimmed = markdown.trim();
  if (!trimmed) return null;

  const md = createMarkdown();
  let imageIndex = galleryStartIndex ?? 0;

  if (galleryStartIndex !== undefined) {
    md.renderer.rules.image = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      const src = token.attrGet('src');
      const alt = token.content;
      if (!src) return self.renderToken(tokens, idx, options);
      if (!md.validateLink(src)) return '';

      const index = imageIndex;
      imageIndex += 1;

      const escapedSrc = md.utils.escapeHtml(src);
      const escapedAlt = md.utils.escapeHtml(alt);
      return (
        `<button type="button" class="block w-full cursor-zoom-in text-left" data-gallery-index="${index}">` +
        `<img src="${escapedSrc}" alt="${escapedAlt}" class="${markdownImageClass}" loading="lazy" />` +
        '</button>'
      );
    };
  }

  return (
    <article
      className={PROSE}
      dangerouslySetInnerHTML={{__html: md.render(trimmed)}}
    />
  );
}
