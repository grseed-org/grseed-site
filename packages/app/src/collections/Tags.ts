import type {CollectionConfig} from 'payload';

import {isAdminOrEditor} from '../access/roles';
import {slugField} from '../fields/slug';

// Mirrors Prisma `Tag`: both `name` and `slug` were unique there.
export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'kind', 'aboutOrder'],
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      localized: true,
    },
    slugField('name'),
    {
      name: 'kind',
      type: 'select',
      required: true,
      options: [
        {label: 'Crop', value: 'crop'},
        {label: 'Lineage', value: 'lineage'},
        {label: 'Series', value: 'series'},
        {label: 'Trait', value: 'trait'},
        {label: 'Region', value: 'region'},
      ],
      admin: {
        description:
          '`kind` is the semantic tag axis. Category `group` remains the route/section axis for posts.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Optional editorial copy for shared semantic tags.',
      },
    },
    {
      name: 'showInAbout',
      type: 'checkbox',
      admin: {
        description:
          'Include this product-oriented tag as an About-page product group.',
      },
    },
    {
      name: 'aboutOrder',
      type: 'number',
      admin: {
        description:
          'Ordering for About-page product groups derived from tags.',
      },
    },
  ],
};
