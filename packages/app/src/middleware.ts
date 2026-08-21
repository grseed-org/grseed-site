import createMiddleware from 'next-intl/middleware';
import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';

import {shouldRunLocaleMiddleware} from '@/i18n/matcher';
import {routing} from '@/i18n/routing';

const localeMiddleware = createMiddleware(routing);

// Canonical host first, then next-intl locale middleware. next-intl handles
// '/' → zh-hans (un-prefixed canonical), '/zh-hans/*' → 308 to the un-prefixed
// path, and '/en/*' (prefixed).
//
// Keep this as middleware.ts for now even though Next 16 recommends proxy.ts.
// proxy.ts defaults to the Node.js runtime, and OpenNext Cloudflare 1.20 does
// not support Node middleware yet. middleware.ts still builds as Edge middleware
// and lets the Cloudflare Worker bundle complete.
export default function middleware(request: NextRequest) {
  const host = (
    request.headers.get('x-forwarded-host') ??
    request.headers.get('host') ??
    request.nextUrl.host
  )
    .split(':')[0]
    .toLowerCase();

  if (host === 'grseed.com') {
    const url = request.nextUrl.clone();
    url.hostname = 'www.grseed.com';
    url.protocol = 'https:';
    return NextResponse.redirect(url, 308);
  }

  if (!shouldRunLocaleMiddleware(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  return localeMiddleware(request);
}

export const config = {
  // Excludes Next internals and static assets. Payload/internal routes are
  // matched only so the bare grseed.com host can be redirected before they are
  // passed through unchanged — the highest-risk integration point (see
  // matcher.ts).
  //
  // MUST be an inline literal: Next reads config.matcher via build-time static
  // analysis and CANNOT resolve an imported value — an import silently falls back
  // to matching everything (^/.*$), so the middleware rewrites /_next/*, /img/*,
  // /admin, /api, /internal → 404. Keep this string IN SYNC with
  // APP_MIDDLEWARE_MATCHER in matcher.ts, which mirrors it for the test
  // (middleware-matcher.test.ts).
  // Changing this requires a dev-server restart; Next does not hot-reload it.
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
