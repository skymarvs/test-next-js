# Coding Standards

## Formatting

Run `npm run format` (Prettier) before committing. Config lives in
`.prettierrc`: semicolons on, double quotes, trailing commas where valid
in ES5.

## Imports

- Use the `@/` path alias for anything outside the current file's folder.
  Only same-folder or child-folder files may use a relative import
  (e.g. `./columns`, `./_components/event-card`).
- Group imports in this order, with a blank line between groups:
  1. External packages (`react`, `next/navigation`, `@supabase/supabase-js`, ...)
  2. Internal `@/` imports
  3. Relative imports (`./...`)

## Naming

- Files and folders: kebab-case.
- Components: PascalCase export name, one component per file, file name
  matches the component in kebab-case (`event-card.tsx` exports
  `EventCard`).
- Route dynamic segments use a semantically meaningful name (`[auth_uuid]`),
  not a generic one (`[id]`), when the value carries meaning.

## Types

- Database row/entity types are always derived from the generated
  `Database` type (`Database['public']['Tables'][...]`) in
  `lib/types/models.ts`. Never hand-write a type that duplicates a table
  shape.
- Form/input types are inferred from their Zod schema in `lib/schema/` and
  named `<Thing>SchemaType` (e.g. `SignupSchemaType`).
- Don't redeclare props inline when a shared type from `lib/types/` or
  `lib/schema/` already covers the shape.

## Server actions

- One file per domain under `app/actions/<domain>.ts` (e.g. `auth.ts`,
  `profile.ts`), `"use server"` at the top of the file.
- Validate all input through the matching Zod schema (`safeParse`) before
  touching Supabase or any other data source; throw on validation failure.
- On a Supabase (or other backend) error, `throw new Error(error.message)`.
  This is the single error-handling convention for actions — don't mix in
  return-based `{ error }` result objects.

## Routes

- Only `page.tsx`, `layout.tsx`, and `route.ts` are allowed at a route
  segment's top level.
- Route-local UI goes in that route's `_components/`; route-local
  non-component helpers go in `_lib/` (created only when a route actually
  needs one).
- API routes stay under `app/api/<name>/route.ts`.
