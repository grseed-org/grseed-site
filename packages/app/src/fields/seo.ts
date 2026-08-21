import type {Field} from 'payload';

// SEO defaults shared by every public-facing collection/global. Falls back to
// the document title/summary at render time when left blank.
export const seoField: Field = {
  name: 'seo',
  type: 'group',
  label: 'SEO',
  admin: {position: 'sidebar'},
  fields: [
    // SEO text is editorial → localized everywhere seoField is used. The OG
    // image is a media reference (identity), so it stays shared across locales.
    {name: 'title', type: 'text', label: 'Meta title', localized: true},
    {
      name: 'description',
      type: 'textarea',
      label: 'Meta description',
      localized: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Open Graph image',
    },
  ],
};
