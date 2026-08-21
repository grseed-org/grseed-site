import type {Field, GlobalConfig} from 'payload';

import {isAdminOrEditor} from '../access/roles';

// Globals are singleton brand/marketing sections (plan 2.7). They are public to
// read and editor-managed. Versions+drafts give editorial rollback (plan 2.9);
// anonymous reads resolve the published version because `draft` defaults off.
//
// Each global carries this generic hero + repeatable `sections` block + SEO,
// plus the bespoke per-page fields the frontend actually reads. `sections` holds
// one-off prose blocks the bespoke fields don't cover; the frontend joins them
// by `key` (below), not by array position.

export const sectionsField: Field = {
  name: 'sections',
  type: 'array',
  admin: {description: 'Ordered content blocks for this page section.'},
  fields: [
    // `key` is a code-facing join handle, NOT editorial copy: the component does
    // sections.find(s => s.key === 'company-intro') instead of trusting array
    // order. Non-localized — the same block is the same block in every locale.
    {
      name: 'key',
      type: 'text',
      admin: {
        description:
          'Stable slug the frontend joins this block by (not localized).',
      },
    },
    {name: 'eyebrow', type: 'text', localized: true},
    // Editorial text is localized; the image is a shared media reference. The
    // array itself is not localized, so block order/structure is shared and only
    // the per-block copy differs by locale.
    {name: 'heading', type: 'text', localized: true},
    {
      name: 'body',
      type: 'textarea',
      localized: true,
      admin: {description: 'Markdown.'},
    },
    {name: 'image', type: 'upload', relationTo: 'media'},
  ],
};

export const heroFields: Field[] = [
  {name: 'title', type: 'text', localized: true},
  {name: 'summary', type: 'textarea', localized: true},
  {name: 'heroImage', type: 'upload', relationTo: 'media'},
];

export const mediaSlotsField: Field = {
  name: 'mediaSlots',
  type: 'array',
  admin: {
    description:
      'Stable optional image slots the frontend renders. Leave image empty until real media is ready.',
  },
  fields: [
    {
      name: 'key',
      type: 'text',
      required: true,
      admin: {description: 'Stable frontend slot key, e.g. hero-main.'},
    },
    {name: 'image', type: 'upload', relationTo: 'media'},
    {name: 'alt', type: 'text', localized: true},
    {name: 'caption', type: 'text', localized: true},
  ],
};

export const editableGlobal = (
  config: Omit<GlobalConfig, 'access'> & {access?: GlobalConfig['access']},
): GlobalConfig => ({
  versions: {drafts: true, max: 25},
  access: {read: () => true, update: isAdminOrEditor},
  ...config,
});
