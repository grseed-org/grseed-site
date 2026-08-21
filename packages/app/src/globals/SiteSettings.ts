import type {GlobalConfig} from 'payload';

import {seoField} from '../fields/seo';
import {editableGlobal} from './_shared';

// Brand-wide settings and SEO defaults applied when a document leaves SEO blank.
// Note: the default locale is NOT configured here — `localization.defaultLocale`
// in payload.config.ts is the single source of truth. The old free-text
// `defaultLocale` field was removed (it misled editors into thinking this set it).
export const SiteSettings: GlobalConfig = editableGlobal({
  slug: 'siteSettings',
  fields: [
    {name: 'siteName', type: 'text', localized: true},
    {name: 'siteNameEn', type: 'text'},
    {name: 'siteNameEnShort', type: 'text'},
    {name: 'copyright', type: 'text', localized: true},
    {name: 'icp', type: 'text', localized: true},
    {name: 'logo', type: 'upload', relationTo: 'media'},
    {name: 'favicon', type: 'upload', relationTo: 'media'},
    seoField,
  ],
});
