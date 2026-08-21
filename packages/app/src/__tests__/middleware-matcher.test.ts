import {describe, expect, it} from 'vitest';

import {
  APP_MIDDLEWARE_MATCHER,
  shouldRunLocaleMiddleware,
} from '@/i18n/matcher';

// The app middleware may catch Payload routes for canonical host redirects, but
// the next-intl locale middleware MUST NOT run on Payload's routes or internal
// maintenance endpoints. This pins both the live matcher and the locale bypass.

const matches = (pathname: string): boolean =>
  APP_MIDDLEWARE_MATCHER.some(pattern =>
    new RegExp(`^${pattern}$`).test(pathname),
  );

describe('app middleware matcher', () => {
  it('matches Payload admin, REST, and GraphQL routes for host redirects', () => {
    for (const p of [
      '/admin',
      '/admin/collections/posts',
      '/api/graphql',
      '/api/graphql-playground',
      '/api/posts',
    ]) {
      expect(matches(p)).toBe(true);
      expect(shouldRunLocaleMiddleware(p)).toBe(false);
    }
  });

  it('passes internal maintenance routes through locale middleware bypass', () => {
    expect(matches('/internal/richtext-migrate')).toBe(true);
    expect(shouldRunLocaleMiddleware('/internal/richtext-migrate')).toBe(false);
  });

  it('excludes Next internals and static assets', () => {
    for (const p of ['/_next/static/chunk.js', '/favicon.ico', '/logo.png']) {
      expect(matches(p)).toBe(false);
    }
  });

  it('runs on public site paths', () => {
    for (const p of ['/', '/en', '/blog', '/product', '/pages/about']) {
      expect(matches(p)).toBe(true);
      expect(shouldRunLocaleMiddleware(p)).toBe(true);
    }
  });
});
