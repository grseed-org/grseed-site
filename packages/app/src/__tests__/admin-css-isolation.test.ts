import {readFileSync} from 'node:fs';
import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

import {describe, expect, it} from 'vitest';

// The admin and frontend live in separate App Router route groups with
// deliberately separate stylesheets. Two failure modes broke the panel before
// and must not regress:
//   1. The Payload admin renders as bare markup unless its precompiled root
//      stylesheet (@payloadcms/next/css - the :root design tokens + html/body
//      globals) is owned by the (payload) stylesheet entry.
//   2. Frontend Tailwind (src/styles.css, with preflight) must stay scoped to
//      the (frontend) route group and never leak into the admin layout.
// This pins the imports so a careless edit can't silently re-break either.

const read = (rel: string): string =>
  readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8');

const payloadLayout = read('../app/(payload)/layout.tsx');
const payloadStyles = read('../app/(payload)/custom.css');
const frontendLayout = read('../app/(frontend)/layout.tsx');

describe('admin / frontend CSS isolation', () => {
  it('payload layout imports the admin stylesheet entry', () => {
    expect(payloadLayout).toContain("import './custom.css'");
  });

  it('payload stylesheet entry imports Payload admin root CSS', () => {
    expect(payloadStyles).toContain("@import '@payloadcms/next/css'");
  });

  it('payload layout does not import the frontend Tailwind stylesheet', () => {
    expect(payloadLayout).not.toMatch(/styles\.css/);
  });

  it('frontend root layout owns the Tailwind stylesheet', () => {
    expect(frontendLayout).toContain("import '@/styles.css'");
  });

  it('does not define a shared root layout above the route groups', () => {
    expect(
      existsSync(fileURLToPath(new URL('../app/layout.tsx', import.meta.url))),
    ).toBe(false);
  });
});
