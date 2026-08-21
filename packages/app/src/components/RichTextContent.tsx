import {RichText} from '@payloadcms/richtext-lexical/react';

import type {GalleryImage} from '@/components/Media/types';

import MarkdownContent, {
  markdownImageClass,
  markdownImageItems,
  PROSE,
} from './MarkdownContent';

type LexicalRoot = {children?: unknown[]};
type LexicalContent = {root?: LexicalRoot};
type UploadValue = {
  alt?: string | null;
  filename?: string | null;
  height?: number | null;
  mimeType?: string | null;
  url?: string | null;
  width?: number | null;
};
type UploadNode = {
  fields?: {alt?: string | null};
  type?: string;
  value?: number | string | UploadValue | null;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isLexicalContent = (value: unknown): value is LexicalContent =>
  isRecord(value) && isRecord(value.root);

const asUploadValue = (value: unknown): UploadValue | undefined =>
  isRecord(value) ? (value as UploadValue) : undefined;

const uploadImage = (node: unknown): GalleryImage | undefined => {
  if (!isRecord(node) || node.type !== 'upload') return undefined;
  const value = asUploadValue((node as UploadNode).value);
  if (!value?.url || !value.mimeType?.startsWith('image')) return undefined;
  const alt =
    (node as UploadNode).fields?.alt ?? value.alt ?? value.filename ?? undefined;
  return {
    src: value.url,
    ...(alt ? {alt, title: alt} : {}),
  };
};

const walkLexicalNodes = (
  nodes: unknown[] | undefined,
  visit: (node: unknown) => void,
) => {
  if (!nodes) return;
  for (const node of nodes) {
    visit(node);
    if (isRecord(node) && Array.isArray(node.children)) {
      walkLexicalNodes(node.children, visit);
    }
  }
};

export function richTextImageItems(content: unknown): GalleryImage[] {
  if (typeof content === 'string') return markdownImageItems(content);
  if (!isLexicalContent(content)) return [];

  const images: GalleryImage[] = [];
  walkLexicalNodes(content.root?.children, node => {
    const image = uploadImage(node);
    if (image) images.push(image);
  });
  return images;
}

const createConverters =
  (galleryStartIndex: number | undefined) =>
  ({defaultConverters}: any) => {
    let imageIndex = galleryStartIndex ?? 0;

    return {
      ...defaultConverters,
      upload: ({node}: {node: unknown}) => {
        const uploadNode = node as UploadNode;
        const value = asUploadValue(uploadNode.value);
        if (!value?.url) return null;

        const alt = uploadNode.fields?.alt ?? value.alt ?? value.filename ?? '';
        if (!value.mimeType?.startsWith('image')) {
          return (
            <a href={value.url} rel="noopener noreferrer">
              {value.filename ?? value.url}
            </a>
          );
        }

        const img = (
          <img
            alt={alt}
            className={markdownImageClass}
            height={value.height ?? undefined}
            loading="lazy"
            src={value.url}
            width={value.width ?? undefined}
          />
        );

        if (galleryStartIndex === undefined) return img;
        const index = imageIndex;
        imageIndex += 1;
        return (
          <button
            className="block w-full cursor-zoom-in text-left"
            data-gallery-index={index}
            type="button"
          >
            {img}
          </button>
        );
      },
    };
  };

export default function RichTextContent({
  content,
  galleryStartIndex,
}: {
  content: unknown;
  galleryStartIndex?: number;
}) {
  if (typeof content === 'string') {
    return (
      <MarkdownContent
        galleryStartIndex={galleryStartIndex}
        markdown={content}
      />
    );
  }
  if (!isLexicalContent(content)) return null;

  return (
    <RichText
      className={PROSE}
      converters={createConverters(galleryStartIndex)}
      data={content as any}
    />
  );
}
