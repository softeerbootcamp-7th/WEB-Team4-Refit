# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Type-check then start Vite dev server
pnpm build        # Type-check then production build
pnpm lint         # Run ESLint
pnpm preview      # Preview production build
pnpm orval        # Fetch latest API spec and regenerate API client code
```

`VITE_API_BASE_URL` must be set in `.env` for API calls to work in development.

## Architecture

### Tech Stack

- React 19, TypeScript, Vite
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- React Router v7 Data Mode (with middleware support for auth/mobile routing)
- TanStack Query v5 (Suspense-based: `useSuspenseQuery`)
- Orval for OpenAPI → React Query codegen
- MSW v2 for mock service worker (currently commented out in `main.tsx`)

### Path Alias

`@` maps to `/src` — use it for all internal imports.

### Directory Layout

```
src/
  apis/           # API layer: Orval-generated code + custom fetch
  constants/      # App-wide constants (interview types, routes, etc.)
  designs/        # Design system: reusable components and SVG assets
  features/       # Feature-specific UI logic, grouped by domain
  layouts/        # Layout shell components (Main, Dashboard, Mobile)
  mocks/          # MSW browser worker setup
  pages/          # Page entry components (thin, delegate to features/)
  routes/         # Router config, route constants, auth/mobile middleware
  styles/         # Global CSS: Tailwind config, color tokens, typography
  types/          # Shared TypeScript types
```

### API Layer (`src/apis/`)

Orval generates React Query hooks from `api-docs.json` (fetched from the backend) into `src/apis/generated/`, split by tag. All generated hooks are re-exported from `src/apis/index.ts`.

The custom fetch client (`src/apis/custom-fetch.ts`):

- Prepends `VITE_API_BASE_URL` to all requests
- Sends cookies (`credentials: 'include'`)
- On `TOKEN_REISSUE_REQUIRED` error codes, automatically calls `/auth/reissue` once (with in-flight deduplication) and retries
- `customFetchWithSerializedQuery` handles array query params using `qs`

To regenerate after backend API changes: `pnpm orval`

### Routing & Auth Middleware (`src/routes/`)

All route constants live in `src/routes/routes.ts` as `ROUTES`.

The router uses React Router v7's middleware API:

- **`handleAuthRouting`**: Runs on every route. Calls `/auth/reissue` once per session (cached in module scope) to determine auth status (`authenticated` | `signup_required` | `unauthenticated`). Redirects to `/signin` if unauthenticated.
- **`HandleMobileRouting`**: Detects mobile user agents and redirects to `/mobile`.

Auth session state is tracked in `src/routes/middleware/auth-session.ts` as a module-level variable.

### Feature Organization (`src/features/`)

Features are grouped by domain: `retro`, `record`, `dashboard`, `mobile`, `signin`, `auth`. Each domain has:

- `_common/` — shared components/hooks within that domain
- `_index/` — main section components
- Other named sections (e.g., `details/`, `confirm/`, `link/`)

Pages in `src/pages/` are thin wrappers that wrap feature components in `<Suspense>` and extract URL params.

### Design System (`src/designs/`)

Reusable UI components are in `src/designs/components/` and exported from `src/designs/components/index.ts`:

- `Button`, `Input`, `Modal`, `Badge`, `Border`, `Checkbox`
- `NativeCombobox`, `SearchableCombobox`, `PlainCombobox`
- `Navbar`, `MobileNavbar`
- `SidebarLayout`, `MinimizedSidebarLayout`, sidebar container components
- `TabBar`, `Table` family, `FadeScrollArea`

SVG assets are in `src/designs/assets/` and imported as React components via `vite-plugin-svgr`.

### Styling

Tailwind CSS v4. Custom tokens defined in `src/styles/color.css` via `@theme`:

- Orange scale: `orange-050` through `orange-900`
- Gray scale: `gray-white`, `gray-100` through `gray-900`
- Accent: `green-050/400`, `red-050/400`, `blue-050/100/400`

Typography utility classes are defined in `src/styles/typography.css` following the pattern `{scale}-{size}-{weight}`:

- Scales: `headline`, `title`, `body`, `caption`
- Sizes: `l`, `m`, `s`, `xl` (title only)
- Weights: `bold`, `semibold`, `medium`, `regular` (body only)

Example: `headline-l-bold`, `title-m-semibold`, `body-s-regular`, `caption-m-medium`

Font: Pretendard Variable.

### Import Order (ESLint enforced)

`react` → external packages → `@/` internal imports → parent/sibling/index. Imports within each group are alphabetically sorted. Run `pnpm lint --fix` to auto-fix ordering.

## Session Notes

- [navbar-ux-improvements (2026-02-20)](.claude/notes/2026-02-20-navbar-ux-improvements.md) — Navbar polish: avatar-only profile, Lightning icon, w-6xl alignment, pastOnly date constraint
