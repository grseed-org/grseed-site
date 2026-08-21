import type {GlobalConfig} from 'payload';

import {seoField} from '../fields/seo';
import {editableGlobal, heroFields, sectionsField} from './_shared';

// Landing page singleton. `title` is the hero slogan and `summary` the hero
// tagline; `companyName` is the hero brand line; `achievements`/`advantages`
// are the editorial lists the page renders, and the company-intro paragraph
// lives in `sections` keyed 'company-intro'. `featuredProducts` will eventually
// replace the hard-coded carousel in src/data/home-info.ts (a follow-on dedupe;
// the carousel still reads src/data for now).
export const Home: GlobalConfig = editableGlobal({
  slug: 'home',
  fields: [
    ...heroFields,
    // Hero brand line. Editorial — defined once in the seed package (shared with
    // the about global via a single constant) so it cannot drift between pages.
    {name: 'companyName', type: 'text', localized: true},
    {
      name: 'featuredProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
    {
      name: 'achievements',
      type: 'array',
      fields: [
        {name: 'label', type: 'text', required: true, localized: true},
        {name: 'value', type: 'text', required: true, localized: true},
      ],
    },
    {
      name: 'advantages',
      type: 'array',
      admin: {description: 'Company-advantage cards (我们的优势).'},
      fields: [
        {name: 'title', type: 'text', localized: true},
        {name: 'description', type: 'textarea', localized: true},
      ],
    },
    sectionsField,
    seoField,
  ],
});
