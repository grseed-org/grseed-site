import 'server-only';

import type {GlobalSlug} from 'payload';

import type {
  About,
  BlogIndex,
  Contact,
  Home,
  Hr,
  Navigation,
  ProductIndex,
  Research,
  Service,
  SiteSetting,
} from '@/payload-types';

import {getPayloadClient} from './payload';
import type {Locale} from './types';

// Singleton page content editors control lives in Payload globals; the public
// app reads it here through the Local API with an explicit locale. The DB is the
// single runtime source of truth — @grseed/seed seeding guarantees it is
// populated, so there are deliberately no bundled `@/data` fallbacks here (that
// would create a second source and drift). Presentation-only structure (lucide
// icons, tone, layout flags, CJK cultivar codes) stays in src/data/*.ts and is
// joined to this editorial text by a stable key.

async function findGlobal<T>(slug: GlobalSlug, locale: Locale): Promise<T> {
  const payload = await getPayloadClient();
  return (await payload.findGlobal({slug, locale, depth: 1})) as T;
}

export const getHome = (locale: Locale) => findGlobal<Home>('home', locale);
export const getAbout = (locale: Locale) => findGlobal<About>('about', locale);
export const getBlogIndex = (locale: Locale) =>
  findGlobal<BlogIndex>('blogIndex', locale);
export const getContact = (locale: Locale) =>
  findGlobal<Contact>('contact', locale);
export const getNavigation = (locale: Locale) =>
  findGlobal<Navigation>('navigation', locale);
export const getSiteSettings = (locale: Locale) =>
  findGlobal<SiteSetting>('siteSettings', locale);
export const getProductIndex = (locale: Locale) =>
  findGlobal<ProductIndex>('productIndex', locale);
export const getResearch = (locale: Locale) =>
  findGlobal<Research>('research', locale);
export const getService = (locale: Locale) =>
  findGlobal<Service>('service', locale);
export const getHr = (locale: Locale) => findGlobal<Hr>('hr', locale);
