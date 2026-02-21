---
description: Create and maintain Obsidian-style knowledge notes
---

# Knowledge Workflow

Purpose: Capture decisions, patterns, and learnings as reusable Obsidian-compatible Markdown notes.

---

## When to Create a Note

- Architecture decision made
- Non-obvious pattern discovered or established
- Bug root-caused with valuable insight
- Integration setup completed (API, service, tool)
- Convention or constraint agreed upon

---

## Step 1 — Choose the right location

- Project knowledge: `docs/` or `notes/` directory in the repo
- Agent knowledge: `.agent/references/` for agent-specific docs
- Use flat structure with descriptive filenames in kebab-case

---

## Step 2 — Write the note

### Template

```markdown
# [Title]

## Context

Why this note exists. What problem was solved or what decision was made.

## Decision / Pattern

The actual content — what was decided, how things work, or what pattern to follow.

## Links

- [[Related Note]]
- [External Reference](https://example.com)

## Tags

#architecture #database #frontend
```

### Rules

- One topic per note
- Use `[[wiki-links]]` for internal cross-references
- Use standard Markdown headings for structure
- Keep notes concise — aim for **50–150 lines**
- Update existing notes instead of creating duplicates

---

## Step 3 — Cross-reference

- Link from related notes using `[[Note Title]]`
- If a note supersedes another — mark the old one as deprecated
- Keep a `docs/index.md` or `docs/README.md` as table of contents if >10 notes

---

## Step 4 — Verify

- Note is in the correct directory
- Markdown renders correctly
- Links are not broken
- No duplicate notes on the same topic

---

## Output

- Note title, location, and what it documents
