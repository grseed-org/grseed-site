import type {GlobalConfig} from 'payload';

import {seoField} from '../fields/seo';
import {editableGlobal, heroFields, sectionsField} from './_shared';

// Backs ResearchView. Field detail migrated during plan task 3.7.
export const Research: GlobalConfig = editableGlobal({
  slug: 'research',
  fields: [...heroFields, sectionsField, seoField],
});
