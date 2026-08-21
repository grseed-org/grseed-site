import type {CollectionConfig} from 'payload';

import {readPublished} from '../access/published';
import {isAdminOrEditor} from '../access/roles';
import {seoField} from '../fields/seo';
import {slugField} from '../fields/slug';

// Product documents are first-class; public filtering comes from shared tags.
// Products do not need categories because the collection route already scopes them.
export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', '_status'],
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
    {name: 'name', type: 'text', required: true, localized: true},
    slugField('name'),
    {name: 'description', type: 'textarea', localized: true},
    {
      name: 'displayOrder',
      type: 'number',
      admin: {
        description:
          'Optional public display order inside derived product/tag sections.',
      },
    },
    {
      name: 'body',
      type: 'richText',
      localized: true,
      admin: {description: 'Rich text body. Drag or paste images to upload.'},
    },
    {
      name: 'facts',
      type: 'array',
      admin: {
        description:
          'Structured agronomic facts. Use tags for browsing semantics, facts for measured values.',
      },
      fields: [
        {
          name: 'group',
          type: 'select',
          required: true,
          options: [
            {label: 'Overview', value: 'overview'},
            {label: 'Yield', value: 'yield'},
            {label: 'Quality', value: 'quality'},
            {label: 'Resistance', value: 'resistance'},
            {label: 'Cultivation', value: 'cultivation'},
            {label: 'Region', value: 'region'},
          ],
        },
        {name: 'label', type: 'text', required: true, localized: true},
        {name: 'value', type: 'textarea', required: true, localized: true},
      ],
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        // image is a media reference (shared); only the caption is editorial.
        {name: 'image', type: 'upload', relationTo: 'media', required: true},
        {name: 'caption', type: 'text', localized: true},
      ],
    },
    {
      name: 'credentials',
      type: 'relationship',
      relationTo: 'credentials',
      hasMany: true,
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
    },
    seoField,
  ],
};
