import type {GlobalConfig} from 'payload';

import {seoField} from '../fields/seo';
import {
  editableGlobal,
  heroFields,
  mediaSlotsField,
  sectionsField,
} from './_shared';

// About-page singleton copy only. Product groups, approval counts, and derived
// product stats come from products/tags so this global cannot drift into a
// second hand-maintained inventory.
export const About: GlobalConfig = editableGlobal({
  slug: 'about',
  fields: [
    {name: 'companyName', type: 'text', localized: true},
    ...heroFields,
    {
      name: 'milestones',
      type: 'array',
      admin: {description: 'Company timeline entries (发展里程碑).'},
      fields: [
        // `year` is a shared label (a year/range reads the same in any locale).
        {name: 'year', type: 'text', required: true},
        {name: 'body', type: 'textarea', localized: true},
      ],
    },
    mediaSlotsField,
    sectionsField,
    seoField,
  ],
});
