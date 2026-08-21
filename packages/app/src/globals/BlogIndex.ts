import type {GlobalConfig} from 'payload';

import {seoField} from '../fields/seo';
import {editableGlobal, heroFields} from './_shared';

// Singleton copy for the blog/news listing page. Individual posts remain in the
// posts collection; this global only owns the index page title and intro.
export const BlogIndex: GlobalConfig = editableGlobal({
  slug: 'blogIndex',
  fields: [...heroFields, seoField],
});
