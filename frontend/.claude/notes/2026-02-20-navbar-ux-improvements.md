# Navbar UX Improvements — 2026-02-20

## Summary

Refactored the Navbar and related modal components for a more polished, commercial feel. Key changes: avatar-only profile (no name text), Lightning icon replacing Mic, navbar content aligned to `w-6xl` matching the content area, and `pastOnly` date constraint added to InstantRecordModal.

## Patterns & Conventions

- **Asterisk pattern**: `<label className="... flex gap-1">` with `<span className="text-red-400" aria-hidden>*</span>` — same as `SearchableCombobox`. Use this consistently for required field labels.
- **Avatar without name**: Navbar profile shows avatar only (no "님" text). Initial letter fallback uses brand color `bg-orange-400` with `text-white`. Interactive via `<button>` with `hover:opacity-80` and `focus-visible:outline-gray-400`.
- **Navbar content width**: Inner wrapper uses `mx-auto w-6xl` to match `DashboardLayout` (`mx-auto w-6xl`). The `<nav>` itself stays full-width `fixed`.
- **SVG assets**: New SVGs go in `src/designs/assets/`, exported from `src/designs/assets/index.ts` as `?react` imports.

## Architectural Decisions

- **Nav layout — logo left, actions right**: `flex-1` spacer between nav items and action buttons, mirroring Linear-style navbar. Logo + nav items stay left-aligned; CTA button + avatar pushed right.
- **`pastOnly` prop threading**: Added `pastOnly?: boolean` to `InterviewScheduleContentProps` → `ScheduleModalContentProps` → passed as `pastOnly` in `InstantRecordModal`. Constrains date input via `max={today}` at the leaf component.
