import type {CollectionConfig} from 'payload';

import {readPublished} from '../access/published';
import {isAdminOrEditor} from '../access/roles';
import {seoField} from '../fields/seo';
import {slugField} from '../fields/slug';

export const Credentials: CollectionConfig = {
  slug: 'credentials',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'level', 'year', '_status'],
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
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        {label: 'Approval', value: 'approval'},
        {label: 'Plant variety right', value: 'plant-variety-right'},
        {label: 'Patent', value: 'patent'},
        {label: 'Award', value: 'award'},
        {label: 'Technology achievement', value: 'tech-achievement'},
      ],
    },
    {
      name: 'level',
      type: 'select',
      options: [
        {label: 'National', value: 'national'},
        {label: 'Provincial', value: 'provincial'},
        {label: 'Municipal', value: 'municipal'},
        {label: 'Registration', value: 'registration'},
        {label: 'Trial', value: 'trial'},
      ],
    },
    {name: 'summary', type: 'textarea', localized: true},
    {name: 'issuer', type: 'text', localized: true},
    {name: 'certificateNo', type: 'text'},
    {name: 'year', type: 'text'},
    {
      name: 'date',
      type: 'date',
      admin: {date: {pickerAppearance: 'dayOnly'}},
    },
    {
      name: 'displayOrder',
      type: 'number',
      admin: {description: 'Optional public display order.'},
    },
    {
      name: 'documentImages',
      type: 'array',
      fields: [
        {name: 'image', type: 'upload', relationTo: 'media', required: true},
        {name: 'caption', type: 'text', localized: true},
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {position: 'sidebar', date: {pickerAppearance: 'dayAndTime'}},
    },
    seoField,
  ],
};
