// SINGLE HIGHEST-RISK INTEGRATION POINT (unify plan): the app middleware may
// run on Payload routes so it can canonicalize grseed.com -> www.grseed.com,
// but the next-intl locale middleware MUST NOT run on /admin, /api, or
// /internal. Static assets and Next internals are excluded at matcher level.
//
// This is a MIRROR, not the live config: middleware.ts must inline its matcher as
// a literal (Next's build-time static analysis can't resolve an imported value —
// an import silently degrades to matching everything). This constant exists only
// so middleware-matcher.test.ts can pin the regex. Keep the two strings identical.
export const APP_MIDDLEWARE_MATCHER = ['/((?!_next|_vercel|.*\\..*).*)'];

export const shouldRunLocaleMiddleware = (pathname: string): boolean =>
  !['/admin', '/api', '/internal'].some(
    prefix => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
