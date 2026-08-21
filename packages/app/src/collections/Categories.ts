import type {CollectionConfig} from 'payload';

import {isAdminOrEditor} from '../access/roles';
import {slugField} from '../fields/slug';

// Categories are structural navigation/filtering buckets within a post section.
// Tags remain shared editorial descriptors and deliberately carry no section group.
export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'group', 'order'],
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
      index: true,
      localized: true,
    },
    slugField('name'),
    {
      name: 'group',
      type: 'select',
      required: true,
      options: ['blog', 'service', 'research'],
      admin: {
        description:
          'Post section that owns this category. Tags are intentionally group-less.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: {
        description:
          'Optional copy for category cards and section filter chips.',
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        description: 'Optional public display order inside the category group.',
      },
    },
  ],
};
