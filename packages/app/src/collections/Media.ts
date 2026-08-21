import type {CollectionConfig} from 'payload';

import {isAdminOrEditor} from '../access/roles';

const altFromFilename = (filename: string | undefined): string | undefined => {
  if (!filename) return undefined;
  return filename
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .trim();
};

// Replaces the old Prisma `Image` (bytes-in-DB) model and bare `coverUrl`
// strings. Files live in R2 on Cloudflare; Workers do not ship sharp, so this
// collection stores original uploads rather than server-generated image sizes.
export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  upload: {
    mimeTypes: ['image/*'],
  },
  hooks: {
    beforeValidate: [
      ({data, req}) => {
        if (data?.alt) return data;
        const fallbackAlt = altFromFilename(req.file?.name ?? data?.filename);
        return fallbackAlt ? {...data, alt: fallbackAlt} : data;
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {description: 'Alt text for accessibility and SEO.'},
    },
    {
      name: 'assetKey',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        description:
          'Stable key for optional media bootstrap. Editorial uploads may leave this empty.',
      },
    },
    {
      name: 'sourcePath',
      type: 'text',
      admin: {
        description: 'Original local source path for imported media, if any.',
      },
    },
    {
      name: 'sourceUrl',
      type: 'text',
      admin: {
        description: 'Original external source URL for imported media, if any.',
      },
    },
  ],
};
