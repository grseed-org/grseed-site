import {createNavigation} from 'next-intl/navigation';

import {routing} from './routing';

// Locale-aware navigation APIs. Use these everywhere instead of next/link and
// next/navigation so links/redirects respect the 'as-needed' prefix (zh-hans
// un-prefixed at '/', en prefixed at '/en').
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
