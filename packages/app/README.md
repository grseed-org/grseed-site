# @grseed/app

The single Next.js App Router runtime for the public site, Payload admin, REST
API, GraphQL API, schema, migrations, and Cloudflare deployment helpers.

## Local development

Run commands from the repository root:

```sh
yarn install
task dev
task seed:local
task media:seed:local
```

`task local:setup` creates the local environment, materializes Wrangler D1/R2,
and applies Payload migrations when the local database has no schema.

## Command map

| Task | Purpose |
| --- | --- |
| `task dev` | Prepare local bindings and start Next on port 4007. |
| `task build` | Build the Next app. |
| `task test` | Run Vitest. |
| `task lint` | Run ESLint. |
| `task typecheck` | Run TypeScript without emit. |
| `task migrate:create` | Create a Payload schema migration. |
| `task migrate:local` | Apply migrations to local D1. |
| `task seed:local` | Create missing local Payload documents from `@grseed/seed`. |
| `task media:seed:local` | Import missing seed media into local Payload/R2. |
| `task payload:generate` | Generate Cloudflare types, Payload types, and import map. |
| `task secret:put` | Write production `PAYLOAD_SECRET` to the Cloudflare Worker secret store. |
| `task migrate` | Apply production D1 migrations. |
| `task admin:bootstrap` | Bootstrap only the production admin endpoint. |
| `task seed` | Run the explicit non-destructive production Payload seed. |
| `task media:seed` | Import missing production seed media. |
| `task richtext:migrate` | Run the explicit Markdown-to-Lexical data migration. |
| `task deploy` | Build and deploy to Cloudflare. |
| `task release` | Run production migrations and deploy. CI runs this on `v*` tags or `workflow_dispatch`. |

## Data ownership

Payload DB is authoritative after bootstrap. The app uses Payload's Local API
for server-side reads and writes; no content mirror or sync endpoint exists.
`@grseed/seed` contains only initial values and stable seed keys. Its writes are
create-only for missing/uninitialized records, so editor changes survive later
runs.

## Schema and migrations

- `payload.config.ts` is the schema root and imports collections/globals.
- `src/collections`, `src/globals`, and `src/fields` are human-maintained
  schema modules.
- `src/payload-types.ts` is generated from the schema.
- `src/migrations` contains the versioned database migrations and its README.
- `scripts/seed.ts` and `scripts/media-seed.ts` are explicit bootstrap entry
  points; they are not part of the deploy path.

D1/R2 are Worker bindings in `wrangler.jsonc`. Deploy credentials are
`CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, and `PAYLOAD_SECRET`. Copy
`.env.production.example` to `.env.production` locally, or set the same names
as GitHub Actions secrets. CI runs `task release` on `v*` tags or
`workflow_dispatch` only; bootstrap, seed, media seed, and `secret:put` stay
manual. Do not commit filled env files.