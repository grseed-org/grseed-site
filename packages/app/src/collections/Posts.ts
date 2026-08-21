import type {CollectionConfig} from 'payload';

import {readPublished} from '../access/published';
import {isAdminOrEditor} from '../access/roles';
import {seoField} from '../fields/seo';
import {slugField} from '../fields/slug';

// Public article/service/research entries. Section membership comes from the
// post category's group; tags are shared descriptors and do not affect routing.
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'category', '_status', 'publishedAt'],
  },
  access: {
    read: readPublished,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  versions: {
    drafts: {autosave: true},
    maxPerDoc: 25,
  },
  fields: [
    {name: 'title', type: 'text', required: true, localized: true},
    slugField('title'),
    {name: 'summary', type: 'textarea', localized: true},
    {
      name: 'content',
      type: 'richText',
      localized: true,
      admin: {description: 'Rich text body. Drag or paste images to upload.'},
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Optional override. If empty, public cards and pages use Cover credential, then the first linked credential image.',
      },
    },
    {
      name: 'coverCredential',
      type: 'relationship',
      relationTo: 'credentials',
      admin: {
        description:
          'Credential whose first document image should be used as this post cover when Cover is empty.',
      },
    },
    {
      name: 'credentials',
      type: 'relationship',
      relationTo: 'credentials',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description:
          'Credentials discussed or cited by this post. The credential record remains the source of certificate metadata and images.',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {position: 'sidebar'},
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: {position: 'sidebar'},
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {position: 'sidebar'},
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {position: 'sidebar', date: {pickerAppearance: 'dayAndTime'}},
      // Stamp a publish time the first time a post goes live, matching the old
      // `publishedAt` semantics that public ordering relies on.
      hooks: {
        beforeChange: [
          ({siblingData, value}) => {
            if (siblingData._status === 'published' && !value) {
              return new Date();
            }
            return value;
          },
        ],
      },
    },
    seoField,
  ],
};
