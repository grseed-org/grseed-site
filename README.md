# GRSeed.Site

GRSeed.Site is a Yarn workspace monorepo for the GRSeed website.

## Packages

| Package                          | Responsibility                                                                                                        |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `@grseed/app` (`packages/app`)   | The Next.js App Router runtime, Payload admin/API, Payload schema, migrations, and Cloudflare deployment scripts.     |
| `@grseed/seed` (`packages/seed`) | Type-checked, non-destructive bootstrap data and optional media seed definitions. It is not a runtime content source. |

## Authority boundary

Payload DB is the only runtime authority for editorial content. The app reads
Payload through the Local API in server components, route handlers, and small
server-side data helpers. A separate repository/service layer is not required;
helpers exist only where they centralize a repeated query or locale policy.

`@grseed/seed` is intentionally one-way bootstrap input:

- it creates missing globals/collection documents and never overwrites populated
  or editor-modified documents;
- it may be run explicitly for local setup or a controlled production import;
- it is never run as part of `release` and cannot synchronize the database back
  to source files.

Business and editorial copy belongs in localized Payload globals/collections.
The existing `src/i18n` integration owns locale URL routing and negotiation; it
is not a second CMS source.

## Schema and migrations

Human-maintained schema is under `packages/app/src/collections`,
`packages/app/src/globals`, and `packages/app/src/fields`, with the root config
in `packages/app/payload.config.ts`. Generated Payload types are written to
`packages/app/src/payload-types.ts`.

Payload migrations live in `packages/app/src/migrations`. Create and apply them
explicitly:

```sh
task migrate:create
task migrate:local
task migrate
```

Data transformations such as the Markdown-to-Lexical conversion are separate
one-time commands (`task richtext:migrate`), never hidden inside deployment.

## Local development

```sh
corepack enable
yarn install
task dev
# in another shell
task seed:local                 # optional, non-destructive Payload bootstrap
task media:seed:local           # optional, missing media only
```

The app is available at http://localhost:4007, with Payload admin at
http://localhost:4007/admin. Local D1/R2 persistence is under
`packages/app/.wrangler/`; `task local:setup` creates the local environment and
applies schema migrations when needed.

## Production update

Pushing to `master` (or running **Release** via `workflow_dispatch`) applies
pending D1 migrations and deploys the Worker. That is `task release`. It does
not bootstrap an admin, seed content, import media, or write Worker secrets.

GitHub Actions secrets:

| Secret | Required for |
| --- | --- |
| `CLOUDFLARE_ACCOUNT_ID` | Wrangler account |
| `CLOUDFLARE_API_TOKEN` | Deploy + remote D1/R2 |
| `PAYLOAD_SECRET` | Production build; must match the Worker secret |

Create the API token from the **Edit Cloudflare Workers** template and include
D1 and R2 edit. D1/R2 themselves are Worker bindings in
`packages/app/wrangler.jsonc`, not extra secrets.

## Manual bootstrap

First-time and data-import commands stay local:

```sh
task secret:put
task admin:bootstrap             # optional, admin endpoint only
task seed                       # explicit, non-destructive content bootstrap
task media:seed                  # optional, missing media only
task richtext:migrate           # run only when an explicit data migration is needed
```

Local production credentials:

```sh
cp packages/app/.env.production.example packages/app/.env.production
```
