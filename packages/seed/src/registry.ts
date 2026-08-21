import {categories} from './collections/categories';
import {credentials} from './collections/credentials';
import {posts} from './collections/posts';
import {products} from './collections/products';
import {tags} from './collections/tags';
import {about} from './globals/about';
import {blogIndex} from './globals/blogIndex';
import {contact} from './globals/contact';
import {home} from './globals/home';
import {hr} from './globals/hr';
import {navigation} from './globals/navigation';
import {productIndex} from './globals/productIndex';
import {research} from './globals/research';
import {service} from './globals/service';
import {siteSettings} from './globals/siteSettings';
import type {AnyEntry} from './types';

// Initial seed registry. Seed writes only missing or uninitialized data; it
// never overwrites editor-created or editor-modified documents. Order matters:
// entries with slug-keyed refs must follow the docs they reference, since the
// engine resolves refs against already-persisted docs.
export const registry: AnyEntry[] = [
  home,
  about,
  blogIndex,
  productIndex,
  research,
  service,
  hr,
  contact,
  navigation,
  siteSettings,
  ...tags,
  ...categories,
  ...credentials,
  ...products,
  ...posts,
];
