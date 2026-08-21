# Payload Migrations

Files in this directory are generated Payload/Drizzle database migration
artifacts for the D1/SQLite schema. They are intentionally machine-shaped and are
not the human-maintained schema.

Human-maintained schema lives in:

- `payload.config.ts`
- `src/collections/*`
- `src/globals/*`
- `src/globals/_shared.ts`
- generated `src/payload-types.ts` for TypeScript consumers

Create and apply migrations through the root Taskfile:

```sh
task migrate:create   # generate a new migration from Payload schema changes
task migrate:local    # apply migrations to local D1
task migrate          # apply migrations to production D1
```

Do not hand-format generated migration SQL. Edit the Payload schema, regenerate
the migration, and review the generated artifact for sanity.
