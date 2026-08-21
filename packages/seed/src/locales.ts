// Payload content locales, default first. Matches the CMS localization codes (zh-hans /
// en) — NOT the admin-UI pack code (zh). The default locale leads so seed
// writes it; en is optional (fallback: true covers untranslated reads).
export const LOCALES = ['zh-hans', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'zh-hans';
