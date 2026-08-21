import type {GlobalConfig} from 'payload';

import {seoField} from '../fields/seo';
import {editableGlobal, heroFields, sectionsField} from './_shared';

// Backs ServiceView. Field detail migrated during plan task 3.7.
export const Service: GlobalConfig = editableGlobal({
  slug: 'service',
  fields: [...heroFields, sectionsField, seoField],
});
