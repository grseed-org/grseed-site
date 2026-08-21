import type {GlobalConfig} from 'payload';

import {editableGlobal} from './_shared';

// Header/footer navigation, replacing hard-coded links in the app Header.
export const Navigation: GlobalConfig = editableGlobal({
  slug: 'navigation',
  fields: [
    {
      name: 'header',
      type: 'array',
      fields: [
        // label is the visible text (localized); href is a shared route.
        {name: 'label', type: 'text', required: true, localized: true},
        {name: 'href', type: 'text', required: true},
      ],
    },
    {
      name: 'footerSections',
      type: 'array',
      fields: [
        {name: 'key', type: 'text', required: true},
        {name: 'label', type: 'text', required: true, localized: true},
        {
          name: 'items',
          type: 'array',
          fields: [
            // label is the visible text (localized); href is a shared route.
            {name: 'label', type: 'text', required: true, localized: true},
            {name: 'href', type: 'text', required: true},
          ],
        },
      ],
    },
  ],
});
