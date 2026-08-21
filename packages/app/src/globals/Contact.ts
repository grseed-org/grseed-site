import type {GlobalConfig} from 'payload';

import {seoField} from '../fields/seo';
import {editableGlobal, sectionsField} from './_shared';

// Company contact details singleton.
export const Contact: GlobalConfig = editableGlobal({
  slug: 'contact',
  fields: [
    // Name + address are editorial (localized); phone/email/website/mapEmbedUrl
    // are identity values shared across locales.
    {name: 'companyName', type: 'text', localized: true},
    {name: 'address', type: 'textarea', localized: true},
    {name: 'phone', type: 'text'},
    {name: 'email', type: 'email'},
    {name: 'website', type: 'text'},
    {name: 'mapEmbedUrl', type: 'text'},
    {
      name: 'contacts',
      type: 'array',
      admin: {
        description: 'Region-manager contacts shown on the Contact page.',
      },
      fields: [
        // role/name are localized editorial copy; mobile is an identity value
        // shared across locales (a phone number is the same in any language).
        {name: 'role', type: 'text', localized: true},
        {name: 'name', type: 'text', localized: true},
        {name: 'mobile', type: 'text'},
      ],
    },
    sectionsField,
    seoField,
  ],
});
