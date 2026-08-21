import type {Field} from 'payload';

// URL-safe slug, mirroring the old Prisma `slug` columns (unique per collection).
// Public detail routes key off slug, not id, so it is required. Deliberately NOT
// localized: one slug per document means a doc has a single URL regardless of
// locale.
export const slugField = (source = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: `Lowercase, hyphenated. Auto-derived from "${source}" if left blank.`,
  },
  hooks: {
    beforeValidate: [
      ({value, data}) => {
        const raw =
          typeof value === 'string' && value.length > 0
            ? value
            : (data?.[source] as string | undefined);
        if (!raw) return value;
        return raw
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9一-龥]+/g, '-')
          .replace(/^-+|-+$/g, '');
      },
    ],
  },
});
