---
name: wrap
description: >
  Wrap up a completed task by documenting what was done into the project.
  Use when the user triggers /wrap-up after finishing a task.
  Creates a dated note file under .claude/notes/ and adds a reference entry
  to CLAUDE.md using a progressive disclosure (lazy-loading) pattern —
  keeping CLAUDE.md lean while making past decisions and patterns discoverable.
---

# Wrap

## Workflow

### 1. Extract from the conversation

Review the current session and identify:

- **Task name** — short kebab-case slug (e.g. `ai-agent-review`, `dashboard-tutorial`)
- **Summary** — 1–3 sentences on what was done
- **Patterns & Conventions** — coding patterns, naming rules, or team conventions discovered or confirmed
- **Architectural Decisions** — structural choices made and their reasoning (omit if none)

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

### 3. Update CLAUDE.md

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
