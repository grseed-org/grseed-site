import type {GlobalConfig} from 'payload';

import {seoField} from '../fields/seo';
import {editableGlobal, heroFields} from './_shared';

// Singleton copy for the product listing page. Product facts and cards remain in
// the products collection; this global only owns the index page title and intro.
export const ProductIndex: GlobalConfig = editableGlobal({
  slug: 'productIndex',
  fields: [...heroFields, seoField],
});
