# File Structure & Coding Standards Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Normalize formatting, rename route folders to drop the redundant `-page` suffix, colocate route-local components under `_components/`, fix non-conforming imports, and document the resulting conventions in `docs/CODING_STANDARDS.md`.

**Architecture:** No runtime behavior changes. This is a structural/formatting refactor executed as a sequence of `git mv` + import-path fixes, each producing a working `npm run build`, followed by a documentation task.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Prettier (new dependency), ESLint (`eslint-config-next`, unchanged).

**Spec:** `docs/superpowers/specs/2026-09-19-file-structure-coding-standards-design.md`

## Global Constraints

- No new ESLint rules — only Prettier is added for formatting (spec: Coding standards > Enforcement).
- Semicolons on, double quotes (Prettier defaults, matching majority of existing code).
- Any import outside the current file's folder must use the `@/` alias; only same-folder or child-folder imports may stay relative.
- Route segment top level may contain only `page.tsx`, `layout.tsx`, `route.ts`; everything else route-local goes in `_components/` (or `_lib/` if needed).
- `npm run build` and `npm run lint` must pass after every task.

---

### Task 1: Add Prettier and run a formatting-only pass

**Files:**
- Create: `.prettierrc`
- Create: `.prettierignore`
- Modify: `package.json` (add `prettier` devDependency and `format` script)
- Modify: all existing `.ts`/`.tsx` files under `app/`, `components/`, `lib/`, `contexts/` (formatting only, via `prettier --write`)

**Interfaces:**
- Produces: a `format` npm script (`prettier --write .`) later tasks and future contributors can run.

- [ ] **Step 1: Create the Prettier config**

Create `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "es5",
  "tabWidth": 2
}
```

- [ ] **Step 2: Create the Prettier ignore file**

Create `.prettierignore`:

```
.next
node_modules
next-env.d.ts
```

- [ ] **Step 3: Install Prettier as a dev dependency**

Run: `npm install --save-dev prettier`

- [ ] **Step 4: Add the format script**

Modify `package.json` `scripts` block from:

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
```

to:

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "format": "prettier --write ."
  },
```

- [ ] **Step 5: Run the formatter across the repo**

Run: `npm run format`

This will rewrite whitespace/quote/semicolon style across existing files (e.g. `components/ui/button.tsx`, `components/custom/data-table/data-table.tsx` gain semicolons; nothing under `.prettierignore` is touched).

- [ ] **Step 6: Verify the build and lint still pass**

Run: `npm run build`
Expected: build succeeds with no TypeScript/route errors.

Run: `npm run lint`
Expected: no new errors introduced by formatting.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: add Prettier and format existing codebase"
```

---

### Task 2: Rename auth routes and colocate their components

**Files:**
- Move: `app/(auth)/login-page/page.tsx` → `app/(auth)/login/page.tsx`
- Move: `app/(auth)/signup-page/page.tsx` → `app/(auth)/signup/page.tsx`
- Move: `app/(auth)/common/oauth-login.tsx` → `app/(auth)/_components/oauth-login.tsx`
- Modify: `app/(auth)/layout.tsx`
- Modify: `app/(auth)/login/page.tsx` (post-move)
- Modify: `app/(auth)/signup/page.tsx` (post-move)

**Interfaces:**
- Produces: routes `/login` and `/signup` (previously `/login-page`, `/signup-page`); `OAuthLogin` now imported from `@/app/(auth)/_components/oauth-login`.
- Consumes: nothing from other tasks. `/events-page` still exists at this point (renamed in Task 3), so the `router.push("/events-page")` calls in these files stay unchanged for now — they'll be fixed in Task 3.

- [ ] **Step 1: Move the route folders and component**

```bash
git mv "app/(auth)/login-page" "app/(auth)/login"
git mv "app/(auth)/signup-page" "app/(auth)/signup"
mkdir -p "app/(auth)/_components"
git mv "app/(auth)/common/oauth-login.tsx" "app/(auth)/_components/oauth-login.tsx"
rmdir "app/(auth)/common"
```

- [ ] **Step 2: Update the auth layout's import**

Modify `app/(auth)/layout.tsx` line 3 from:

```tsx
import OAuthLogin from "@/app/(auth)/common/oauth-login";
```

to:

```tsx
import OAuthLogin from "@/app/(auth)/_components/oauth-login";
```

- [ ] **Step 3: Fix the cross-link between login and signup**

Modify `app/(auth)/login/page.tsx` line 87 from:

```tsx
            <Button variant="link" className="px-1" onClick={() => router.push("/signup-page")}>Sign-up</Button>
```

to:

```tsx
            <Button variant="link" className="px-1" onClick={() => router.push("/signup")}>Sign-up</Button>
```

Modify `app/(auth)/signup/page.tsx` line 150 from:

```tsx
            <Button variant="link" className="px-1" onClick={() => router.push("/login-page")}>Sign-in</Button>
```

to:

```tsx
            <Button variant="link" className="px-1" onClick={() => router.push("/login")}>Sign-in</Button>
```

- [ ] **Step 4: Verify the build**

Run: `npm run build`
Expected: build succeeds; `/login` and `/signup` are listed as routes instead of `/login-page` and `/signup-page`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: rename auth routes, colocate oauth-login under _components"
```

---

### Task 3: Rename events route and colocate its components

**Files:**
- Move: `app/events-page/page.tsx` → `app/events/page.tsx`
- Move: `app/events-page/event-card.tsx` → `app/events/_components/event-card.tsx`
- Move: `app/events-page/[auth_uuid]/page.tsx` → `app/events/[auth_uuid]/page.tsx`
- Move: `app/events-page/[auth_uuid]/columns.tsx` → `app/events/[auth_uuid]/_components/columns.tsx`
- Move: `app/events-page/[auth_uuid]/new/page.tsx` → `app/events/[auth_uuid]/new/page.tsx`
- Modify: `app/events/page.tsx`
- Modify: `app/events/[auth_uuid]/page.tsx`
- Modify: `app/(auth)/login/page.tsx`
- Modify: `app/(auth)/signup/page.tsx`
- Modify: `app/(auth)/_components/oauth-login.tsx`

**Interfaces:**
- Produces: route `/events` and `/events/[auth_uuid]` (previously `/events-page`, `/events-page/[auth_uuid]`); `columns` now imported from `@/app/events/[auth_uuid]/_components/columns`; `EventCard`/`EventDataProps` now imported from `./_components/event-card`.
- Consumes: nothing new from Task 2 (auth routes already renamed, but `/events-page` references inside auth files are fixed here).

- [ ] **Step 1: Move the route folders and route-local components**

```bash
git mv app/events-page app/events
mkdir -p app/events/_components
git mv app/events/event-card.tsx app/events/_components/event-card.tsx
mkdir -p "app/events/[auth_uuid]/_components"
git mv "app/events/[auth_uuid]/columns.tsx" "app/events/[auth_uuid]/_components/columns.tsx"
```

- [ ] **Step 2: Fix imports in `app/events/page.tsx`**

Modify line 3 from:

```tsx
import { EventCard, EventDataProps } from "./event-card";
```

to:

```tsx
import { EventCard, EventDataProps } from "./_components/event-card";
```

Modify line 51 from:

```tsx
                <Button size="lg" onClick={() => router.push(`/events-page/${userMetadata?.sub}`)}>Manage Events</Button>
```

to:

```tsx
                <Button size="lg" onClick={() => router.push(`/events/${userMetadata?.sub}`)}>Manage Events</Button>
```

- [ ] **Step 3: Fix imports and links in `app/events/[auth_uuid]/page.tsx`**

Modify line 7 from:

```tsx
import { columns } from "@/app/events-page/[auth_uuid]/columns";
```

to:

```tsx
import { columns } from "@/app/events/[auth_uuid]/_components/columns";
```

Modify line 59 from:

```tsx
                <Button onClick={() => router.push(`/events-page/${slug}/new`)}>Create Event</Button>
```

to:

```tsx
                <Button onClick={() => router.push(`/events/${slug}/new`)}>Create Event</Button>
```

- [ ] **Step 4: Fix the post-auth redirect in login/signup/oauth-login**

Modify `app/(auth)/login/page.tsx` line 27 from:

```tsx
                router.push("/events-page")
```

to:

```tsx
                router.push("/events")
```

Modify `app/(auth)/signup/page.tsx` line 30 from:

```tsx
                router.push("/events-page")
```

to:

```tsx
                router.push("/events")
```

Modify `app/(auth)/_components/oauth-login.tsx` line 14 from:

```tsx
                redirectTo: `${process.env.NEXT_PUBLIC_DOMAIN}/api/auth/callback?next=/events-page`,
```

to:

```tsx
                redirectTo: `${process.env.NEXT_PUBLIC_DOMAIN}/api/auth/callback?next=/events`,
```

- [ ] **Step 5: Verify the build**

Run: `npm run build`
Expected: build succeeds; `/events` and `/events/[auth_uuid]` are listed as routes instead of `/events-page` variants. `header.tsx` and `lib/supabase/proxy.ts` still reference the old `/events-page`, `/users-page`, `/login-page` paths at this point — that's expected, they're fixed in Task 4.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: rename events routes, colocate event-card and columns under _components"
```

---

### Task 4: Rename users route, colocate its component, and fix remaining shared references

**Files:**
- Move: `app/users-page/page.tsx` → `app/users/page.tsx`
- Move: `app/users-page/columns.tsx` → `app/users/_components/columns.tsx`
- Modify: `app/users/page.tsx`
- Modify: `components/custom/header.tsx`
- Modify: `lib/supabase/proxy.ts`

**Interfaces:**
- Produces: route `/users` (previously `/users-page`); `columns` now imported from `./_components/columns`; `getProfile` now imported via the `@/` alias instead of a parent-relative import.
- Consumes: the `/events`, `/login`, `/signup` route names produced by Tasks 2–3 (this task updates the last remaining references to old route names in shared files).

- [ ] **Step 1: Move the route folder and route-local component**

```bash
git mv app/users-page app/users
mkdir -p app/users/_components
git mv app/users/columns.tsx app/users/_components/columns.tsx
```

- [ ] **Step 2: Fix imports in `app/users/page.tsx`**

Modify lines 7-8 from:

```tsx
import { columns } from "./columns";
import { getProfile } from "../actions/profile";
```

to:

```tsx
import { columns } from "./_components/columns";
import { getProfile } from "@/app/actions/profile";
```

- [ ] **Step 3: Fix all route references and relative UI imports in `components/custom/header.tsx`**

Modify lines 14-15 from:

```tsx
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
```

to:

```tsx
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
```

Modify line 46 from:

```tsx
                    <Button variant="ghost" className="text-sm" onClick={() => router.push("/events-page")}>Events</Button>
```

to:

```tsx
                    <Button variant="ghost" className="text-sm" onClick={() => router.push("/events")}>Events</Button>
```

Modify line 48 from:

```tsx
                        <Button variant="ghost" className="text-sm" onClick={() => router.push("/users-page")}>Users</Button>
```

to:

```tsx
                        <Button variant="ghost" className="text-sm" onClick={() => router.push("/users")}>Users</Button>
```

Modify line 55 from:

```tsx
                        <Button variant="outline" onClick={() => router.push("/login-page")}>
```

to:

```tsx
                        <Button variant="outline" onClick={() => router.push("/login")}>
```

Modify line 106 from:

```tsx
                                    <Button variant="link" className="text-sm w-full justify-start" onClick={() => router.push("/events-page")}>Events</Button>
```

to:

```tsx
                                    <Button variant="link" className="text-sm w-full justify-start" onClick={() => router.push("/events")}>Events</Button>
```

Modify line 108 from:

```tsx
                                        <Button variant="link" className="text-sm w-full justify-start" onClick={() => router.push("/users-page")}>Users</Button>
```

to:

```tsx
                                        <Button variant="link" className="text-sm w-full justify-start" onClick={() => router.push("/users")}>Users</Button>
```

Modify line 117 from:

```tsx
                                    <Button onClick={() => router.push('/login-page')}>
```

to:

```tsx
                                    <Button onClick={() => router.push('/login')}>
```

- [ ] **Step 4: Fix the middleware's route lists in `lib/supabase/proxy.ts`**

Modify lines 45-50 from:

```ts
    const protectedPath = [
        '/users-page'
    ]
    const authPath = [
        '/login-page','/signup-page'
    ]
```

to:

```ts
    const protectedPath = [
        '/users'
    ]
    const authPath = [
        '/login','/signup'
    ]
```

Modify line 58 from:

```ts
    url.pathname = '/events-page'
```

to:

```ts
    url.pathname = '/events'
```

Modify line 61 from:

```ts
    url.pathname = '/events-page';
```

to:

```ts
    url.pathname = '/events';
```

- [ ] **Step 5: Confirm no old route names remain**

Run: `grep -rn "events-page\|users-page\|login-page\|signup-page" --include="*.ts" --include="*.tsx" app components lib`
Expected: no matches.

- [ ] **Step 6: Verify the build and lint**

Run: `npm run build`
Expected: build succeeds; routes listed are `/`, `/login`, `/signup`, `/events`, `/events/[auth_uuid]`, `/events/[auth_uuid]/new`, `/users`, `/api/auth/callback`.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "refactor: rename users route, colocate columns, fix remaining route references and relative imports"
```

---

### Task 5: Write coding standards doc and link it from CLAUDE.md

**Files:**
- Create: `docs/CODING_STANDARDS.md`
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: the conventions already applied in Tasks 1–4 (this task documents what was just done, it doesn't change code behavior).

- [ ] **Step 1: Write the standards doc**

Create `docs/CODING_STANDARDS.md`:

```markdown
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
```

- [ ] **Step 2: Link it from CLAUDE.md**

Modify `CLAUDE.md` from:

```
@AGENTS.md
```

to:

```
@AGENTS.md

See `docs/CODING_STANDARDS.md` for file structure and coding conventions.
```

- [ ] **Step 3: Commit**

```bash
git add docs/CODING_STANDARDS.md CLAUDE.md
git commit -m "docs: add coding standards reference"
```

---

### Task 6: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: succeeds, route list shows `/`, `/login`, `/signup`, `/events`, `/events/[auth_uuid]`, `/events/[auth_uuid]/new`, `/users`, `/api/auth/callback`.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Manual click-through**

Run: `npm run dev`, then in a browser visit `/`, `/login`, `/signup`, `/events`, `/events/<a real auth uuid>`, `/users`. Confirm each loads without a 404 and the header's nav buttons (Events/Users/Sign-in/Sign-out) navigate correctly.

- [ ] **Step 4: Confirm no stray old paths anywhere in the repo**

Run: `grep -rn "events-page\|users-page\|login-page\|signup-page" --include="*.ts" --include="*.tsx" --include="*.md" . --exclude-dir=node_modules --exclude-dir=.next`
Expected: no matches.
