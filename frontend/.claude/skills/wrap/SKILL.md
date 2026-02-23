---
name: wrap
description: >
  Wrap up a completed task by documenting what was done into the project.
  Use when the user triggers /wrap-up after finishing a task.
  Creates a dated note file under .claude/notes/ and adds a reference entry
  to CLAUDE.md using a progressive disclosure (lazy-loading) pattern —
  keeping CLAUDE.md lean while making past decisions and patterns discoverable.
  Also updates .claude/docs/ reference docs when functional source code changed.
---

# Wrap

## Workflow

### 1. Extract from the conversation

Review the current session and identify:

- **Task name** — short kebab-case slug (e.g. `ai-agent-review`, `dashboard-tutorial`)
- **Summary** — 1–3 sentences on what was done
- **Patterns & Conventions** — coding patterns, naming rules, or team conventions discovered or confirmed
- **Architectural Decisions** — structural choices made and their reasoning (omit if none)
- **Changed source areas** — `src/` directories modified in this session (omit if no functional code changes)

If the branch name is available (e.g. from git context), derive the task slug from it.

### 2. Create the note file

Create `.claude/notes/YYYY-MM-DD-[task-slug].md` using today's date.

Template:

```markdown
# [Task Name] — YYYY-MM-DD

## Summary

[1–3 sentences describing what was done]

## Patterns & Conventions

- [Pattern or convention discovered/confirmed]

## Architectural Decisions

- [Decision]: [reasoning]
```

Omit sections that have nothing to record.

### 3. Update reference docs

> **Skip condition**: If the session only changed documentation, config, or `.claude/` files (no functional `src/` code changes), skip this entire step.

#### 3a. Identify affected docs

Map changed source paths to their corresponding doc files:

| Source path prefix | Doc file |
|---|---|
| `src/apis/` | `.claude/docs/api-layer.md` |
| `src/routes/` | `.claude/docs/routing.md` |
| `src/ui/` | `.claude/docs/design-system.md` |
| `src/styles/` | `.claude/docs/styling.md` |
| `src/features/<domain>/` | `.claude/docs/features/<domain>.md` |

Changes in `src/constants/`, `src/types/`, `src/layouts/`, or `src/pages/` should be reflected in the doc of the feature that consumes them.

#### 3b. Surgically update existing docs

For each affected doc file:

1. Read its current content.
2. Identify which of the standard sections are affected by the changes:
   - 개요 (Overview)
   - 유저 플로우 (User Flow)
   - 비즈니스 규칙 (Business Rules)
   - 도메인 용어 (Domain Terms)
   - 주요 파일 (Key Files)
3. Update **only** the affected sections; leave everything else untouched.
4. Preserve the existing style and language (Korean).

Rules:
- Never modify sections unaffected by this session's changes.
- Only delete existing information when it is demonstrably wrong or obsolete.
- Key files section format: `` - `path/to/file.ts` — 설명 ``

#### 3c. Create new docs if needed

If changes touch a source area that has no corresponding doc file yet:

1. Create the doc using the standard template (match style of existing docs in `.claude/docs/`).
2. Add a reference to CLAUDE.md under `### Reference Docs`:
   ```markdown
   - [Doc Title](.claude/docs/<path>.md) — 한줄 설명
   ```

### 4. Update CLAUDE.md

Add a `## Session Notes` section at the end of CLAUDE.md if it does not exist.
Append a bullet referencing the new note file:

```markdown
## Session Notes

- [task-name (YYYY-MM-DD)](.claude/notes/YYYY-MM-DD-task-slug.md) — one-line summary
```

If the section already exists, append the new bullet under it.

## Guidelines

- Keep CLAUDE.md entries to one line — details live in the note file.
- Only record information with lasting value (patterns, decisions, conventions). Skip task-specific ephemera.
- If nothing notable was discovered, create a minimal note with just a summary and skip updating CLAUDE.md.
- When updating docs, only document what was directly observed or modified in this session.
- Never speculatively document behavior that was not observed or changed.
