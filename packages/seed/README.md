# @grseed/seed

This package contains initial Payload values and stable seed keys only.

It is deliberately not a content repository and is never read by the public
site at runtime. Payload DB becomes authoritative after bootstrap. `seedAll`
creates missing or uninitialized globals and collection documents, resolves
relationships by stable keys, and never updates populated records. Media seed
metadata follows the same create-only rule in `@grseed/app/src/seed/media.ts`.

The package imports the generated types from `packages/app/src/payload-types.ts`
for compile-time validation. Schema changes belong in `packages/app`; after a
schema change, regenerate Payload types before updating seed entries.

Run the seed through the app scripts:

```sh
task seed:local
task media:seed:local
```

Production seed commands are explicit and optional. They are never part of the
release deploy path.