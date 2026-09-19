# File Structure & Coding Standards Cleanup

Date: 2026-09-19

## Problem

The project's `app/`, `components/`, and `lib/` folders grew organically and
now mix conventions: route folders carry a redundant `-page` suffix even
though any folder under `app/` is already a route; route-specific components
are colocated inconsistently (sometimes directly in the route folder,
sometimes in `components/custom/`); and formatting/import style varies file
to file (semicolons, import grouping, alias vs. relative imports). There is
no written reference for contributors (including future AI-assisted
sessions) to follow, so each new file reintroduces the same inconsistencies.

## Goals

- Establish one clear, documented convention for file/folder structure and
  coding style.
- Bring the existing codebase in line with that convention.
- Make the convention easy to keep following (short doc, light tooling),
  not a heavyweight process.

## Non-goals

- No new features or behavior changes.
- No new state management, testing framework, or architectural layers.
- No ESLint rule changes beyond what's needed for import/formatting
  consistency (see Coding Standards > Enforcement).

## Structure changes

### Route folder naming

Drop the redundant `-page` suffix from route folders, since a folder under
`app/` is already a route by definition:

| Before | After |
|---|---|
| `app/events-page/` | `app/events/` |
| `app/events-page/[auth_uuid]/` | `app/events/[auth_uuid]/` |
| `app/events-page/[auth_uuid]/new/` | `app/events/[auth_uuid]/new/` |
| `app/users-page/` | `app/users/` |
| `app/(auth)/login-page/` | `app/(auth)/login/` |
| `app/(auth)/signup-page/` | `app/(auth)/signup/` |

The `(auth)` route group and all other route segments (`app/api/...`) are
unaffected.

### Route-local component colocation

Route-specific components move into a `_components` private folder
(Next.js's underscore convention, which opts a folder out of routing) inside
the route that uses them:

```
app/
  events/
    _components/
      event-card.tsx
    [auth_uuid]/
      _components/
        columns.tsx
      new/
        page.tsx
      page.tsx
    page.tsx
  (auth)/
    _components/
      oauth-login.tsx
    login/
      page.tsx
    signup/
      page.tsx
    layout.tsx
```

Rule going forward: if a component is used by exactly one route, it lives in
that route's `_components/`. If a component is used by two or more routes
(e.g. `data-table/`, `header.tsx`), it lives in `components/custom/`.
`components/ui/` remains reserved for shadcn primitives — no change there.

### `lib/` structure

No changes. The existing split (`schema/`, `types/`, `enums/`, `supabase/`,
`utils.ts`) already separates concerns cleanly and matches the standards
below.

## Coding standards

Written to `docs/CODING_STANDARDS.md` as the durable reference (linked from
`CLAUDE.md`/`AGENTS.md`).

### Formatting

- Add `.prettierrc` to the repo root and run Prettier once across existing
  files to normalize.
- Semicolons: on (matches the majority of existing files).
- Quotes: double quotes (Prettier default, matches existing code).
- Run via a `format` script (`prettier --write .`); no pre-commit hook is
  added as part of this change.

### Imports

- Use the `@/` path alias for anything outside the current file's folder.
  Only same-folder or child-folder files may use a relative import
  (`./columns`, `./_components/event-card`).
- Group imports in this order, with a blank line between groups:
  1. External packages (`react`, `next/navigation`, `@supabase/supabase-js`, ...)
  2. Internal `@/` imports
  3. Relative imports (`./...`)

### Naming

- Files and folders: kebab-case (already the dominant style).
- Components: PascalCase export name, one component per file, file name
  matches the component in kebab-case (`event-card.tsx` exports
  `EventCard`).
- Route dynamic segments use a semantically meaningful name
  (`[auth_uuid]`), not a generic one (`[id]`), when the value carries
  meaning — matches current usage.

### Types

- Database row/entity types are always derived from the generated
  `Database` type (`Database['public']['Tables'][...]`) in
  `lib/types/models.ts`. Never hand-write a type that duplicates a table
  shape.
- Form/input types are inferred from their Zod schema in `lib/schema/` and
  named `<Thing>SchemaType` (e.g. `SignupSchemaType`), matching current
  usage.
- Don't redeclare props inline when a shared type from `lib/types/` or
  `lib/schema/` already covers the shape.

### Server actions

- One file per domain under `app/actions/<domain>.ts` (e.g. `auth.ts`,
  `profile.ts`), `"use server"` at the top of the file.
- Validate all input through the matching Zod schema (`safeParse`) before
  touching Supabase or any other data source; throw on validation failure.
- On a Supabase (or other backend) error, `throw new Error(error.message)`.
  This is the single error-handling convention for actions — don't mix in
  return-based `{ error }` result objects.

### Routes

- Only `page.tsx`, `layout.tsx`, and `route.ts` are allowed at a route
  segment's top level.
- Route-local UI goes in that route's `_components/`; route-local
  non-component helpers go in `_lib/` (created only when a route actually
  needs one — not added preemptively).
- API routes stay under `app/api/<name>/route.ts`.

### Enforcement

- Prettier formatting only for this change. No new ESLint rules are added;
  the existing `eslint-config-next` setup is left as-is. If drift becomes a
  recurring problem later, stricter lint rules (import/order,
  naming-convention) can be revisited as a separate, smaller change.

## Migration plan

1. Add `.prettierrc`, run `prettier --write .` once, commit as a pure
   formatting pass.
2. Rename route folders (`git mv`) to drop `-page` suffixes; update any
   internal links/redirects that reference the old paths (none found via
   search, but re-check during implementation).
3. Move route-local components into `_components/` per route (`git mv`);
   update their imports.
4. Fix import style (alias vs. relative, grouping) file by file as touched;
   this can be done incrementally rather than as one giant diff, but should
   be completed for every file under `app/` and `components/custom/` as
   part of this change since the goal is a clean baseline.
5. Write `docs/CODING_STANDARDS.md` and link it from `CLAUDE.md`.

## Testing

- `npm run build` must succeed after the route renames (verifies no broken
  route references).
- `npm run lint` must pass.
- Manually click through the renamed routes (`/events`, `/users`,
  `/login`, `/signup`, `/events/[auth_uuid]`) in the dev server to confirm
  no 404s from stale links.
