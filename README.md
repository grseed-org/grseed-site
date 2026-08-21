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

## Production commands

```sh
task secret:put
task migrate
task admin:bootstrap             # optional, admin endpoint only
task seed                       # explicit, non-destructive content bootstrap
task media:seed                  # optional, missing media only
task deploy                      # or task release (migrate + deploy)
task richtext:migrate           # run only when an explicit data migration is needed
```

Production secrets are read from the repository's deployment secret file and
must not be committed to `.env`.
