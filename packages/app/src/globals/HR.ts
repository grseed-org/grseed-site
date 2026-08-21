import type {GlobalConfig} from 'payload';

import {seoField} from '../fields/seo';
import {
  editableGlobal,
  heroFields,
  mediaSlotsField,
  sectionsField,
} from './_shared';

// HR (人才理念) content. `title` is the concept name; `summary` is the hero
// intro; the five philosophy values live in `sections` (keyed); `highlights`
// and `journey` are the bespoke card lists. Icons/tones for all of these are
// presentation concerns that stay in src/data/hr-ui.ts, joined by index.
export const HR: GlobalConfig = editableGlobal({
  slug: 'hr',
  fields: [
    ...heroFields,
    {
      name: 'highlights',
      type: 'array',
      admin: {description: 'Hero highlight cards (使命驱动 / 成长体系 …).'},
      fields: [
        {name: 'title', type: 'text', localized: true},
        {name: 'description', type: 'textarea', localized: true},
      ],
    },
    {
      name: 'journey',
      type: 'array',
      admin: {
        description: 'Join-us journey steps (了解 → 沟通 → 入职 → 发展).',
      },
      fields: [
        {name: 'title', type: 'text', localized: true},
        {name: 'description', type: 'textarea', localized: true},
      ],
    },
    sectionsField,
    mediaSlotsField,
    seoField,
  ],
});
