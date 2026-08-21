import type {CollectionConfig} from 'payload';

import {readPublished} from '../access/published';
import {isAdminOrEditor} from '../access/roles';
import {seoField} from '../fields/seo';
import {slugField} from '../fields/slug';

// Repeatable long-form pages. Singleton brand/marketing pages (home, about, ...)
// are Globals instead, not rows here.
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status'],
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
    seoField,
  ],
};
