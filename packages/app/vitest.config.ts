import {fileURLToPath} from 'node:url';

import {defineConfig} from 'vitest/config';

// Mirrors the tsconfig `@/* → src/*` alias so unit tests can import app modules
// the same way the app does. Tests here are infra-free (no DB/Payload runtime);
// DB-backed checks live in the plan's runtime verification phase.
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // `server-only` is a Next build-time guard with no Node entry; stub it so
      // server modules (e.g. lib/explorer) can be imported under vitest.
      'server-only': fileURLToPath(
        new URL('./src/__tests__/empty-module.ts', import.meta.url),
      ),
    },
  },
  // App components rely on the automatic JSX runtime (no `import React`); match it
  // so they render under vitest.
  esbuild: {jsx: 'automatic'},
  test: {
    environment: 'node',
  },
});
