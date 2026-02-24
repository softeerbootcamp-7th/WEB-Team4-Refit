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
- MSW v2 for mock service worker (dev only, disabled by default)

### Path Alias

`@` maps to `/src` — use it for all internal imports.

### Directory Layout

```
src/
  apis/           # API layer: Orval-generated code + custom fetch
  constants/      # App-wide constants (interview types, routes, etc.)
  ui/             # Design system: reusable components and SVG assets
  features/       # Feature-specific UI logic, grouped by domain
  layouts/        # Layout shell components (Main, Dashboard, Mobile)
  mocks/          # MSW browser worker setup
  pages/          # Page entry components (thin, delegate to features/)
  routes/         # Router config, route constants, auth/mobile middleware
  styles/         # Global CSS: Tailwind config, color tokens, typography
  types/          # Shared TypeScript types
```

### Feature Organization (`src/features/`)

- `pages/` mirrors the route tree; each route's logic lives in the matching `features/` domain.
- `_index/` = the exact route (e.g., `dashboard/_index/` → `/dashboard`).
- `features/_common/` = project-wide shared code; `<domain>/_common/` = domain-scoped shared code.

### Import Order (ESLint enforced)

`react` → external packages → `@/` internal imports → parent/sibling/index. Imports within each group are alphabetically sorted. Run `pnpm lint --fix` to auto-fix ordering.

### Reference Docs

- [API Layer](.claude/docs/api-layer.md) — Orval codegen, custom fetch, token reissue
- [Routing & Auth Middleware](.claude/docs/routing.md) — React Router v7 middleware, auth session
- [Design System](.claude/docs/design-system.md) — UI 컴포넌트 목록, SVG 에셋
- [Styling](.claude/docs/styling.md) — Tailwind v4 color tokens, typography classes
- [Feature: SignIn](.claude/docs/features/signin.md) — OAuth 팝업 플로우, 세션 상태 머신
- [Feature: Dashboard](.claude/docs/features/dashboard.md) — 배너 상태, 약관 게이팅, 캘린더, 필터
- [Feature: Record](.claude/docs/features/record.md) — 3단계 기록 플로우, 상태 머신, 자동저장
- [Feature: Retro](.claude/docs/features/retro.md) — 질문별 회고 + KPT, STAR 분석, 스크랩
- [Feature: Mobile](.claude/docs/features/mobile.md) — 모바일 녹음, Web Speech API
- [E2E Test Plan](.claude/docs/e2e-test-plan.md) — E2E 테스트 플로우 계획서 (agent-browser 기반)

## Session Notes

Past session decisions → [.claude/notes/index.md](.claude/notes/index.md)
