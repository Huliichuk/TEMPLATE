---
name: skill-creator
description: Creates and validates new agent skills following the Anthropic Skills Framework. Use this to scaffold, write, and verify skills.
---

# Skill Creator

## Overview

This skill helps you create, structure, and validate new agent skills. It follows the [Anthropic Skills Framework](https://github.com/anthropics/skills) and ensures every skill is consistent, actionable, and self-contained.

## When to Use

- User asks to "create a skill for X"
- A repeating pattern emerges that should be codified
- A new integration or workflow needs formalization

## Anatomy of a Skill

```
skill-name/
├── SKILL.md              (required — instructions + metadata)
├── scripts/              (optional — executable automation)
├── references/           (optional — docs loaded on demand)
└── assets/               (optional — templates, schemas)
```

> Only create subdirectories when you have content for them. Empty dirs are forbidden.

---

## Step 1 — Scaffold

```bash
npx tsx .agent/skills/skill-creator/scripts/create_skill.ts <skill-name>
```

This creates the directory and a SKILL.md template. Skill name must be **kebab-case**.

---

## Step 2 — Write the SKILL.md

### Required YAML Frontmatter

```yaml
---
name: my-skill-name
description: A concise description of what this skill does and when to use it.
---
```

### Required Sections

| Section | Purpose |
|---|---|
| `# Title` | Human-readable name |
| `## Overview` | What this skill does (2-3 sentences max) |
| `## When to Use` | Trigger conditions — when should the agent activate this? |
| `## Instructions` | Step-by-step actionable instructions |
| `## Examples` | Concrete input/output examples |

### Optional Sections

| Section | Purpose |
|---|---|
| `## Common Mistakes` | Anti-patterns to avoid |
| `## References` | Links to `references/` files or external docs |

---

## Step 3 — Design Principles

### DO ✅

- **Be specific and actionable** — "Run `npx tsc --noEmit`" > "Check types"
- **Keep SKILL.md lean** — Move large schemas, templates, and docs to `references/`
- **One skill = one responsibility** — Don't mix unrelated concerns
- **Include concrete examples** — Real code, real commands, real output
- **Use conditional logic** — "If X, do Y. If Z, do W."

### DON'T ❌

- **No behavioral rules** — "You are a senior engineer" belongs in GEMINI.md, not a skill
- **No vague instructions** — "Write good code" is not actionable
- **No duplication** — Don't repeat GEMINI.md rules or other skills
- **No empty directories** — Only create `scripts/`, `references/`, `assets/` when needed
- **No giant SKILL.md** — Keep under 200 lines. Use `references/` for overflow

---

## Step 4 — Validate

```bash
npx tsx .agent/skills/skill-creator/scripts/validate_skill.ts .agent/skills/<skill-name>
```

Validation checks:
- ✅ SKILL.md exists
- ✅ YAML frontmatter has `name` and `description`
- ✅ Description is not a placeholder or too short
- ✅ Has at least `## Overview` and `## Instructions` or `## When to Use`
- ✅ No empty subdirectories
- ✅ File size under 300 lines

---

## Step 5 — Reference Files (Optional)

Use `references/` for large documents loaded on demand:

```
references/
├── api-schema.md          — API specifications
├── error-catalog.md       — Known errors and solutions
└── migration-patterns.md  — Database migration templates
```

**Rule:** Information lives in SKILL.md **or** in references — never both.

Keep SKILL.md as the workflow guide. Keep references as the knowledge store.

---

## Skill Quality Checklist

- [ ] Name is kebab-case
- [ ] Description is one clear sentence (not placeholder)
- [ ] SKILL.md has Overview, When to Use, Instructions
- [ ] Instructions are concrete and actionable (commands, not wishes)
- [ ] Examples use real code/output
- [ ] No behavioral rules (those go in GEMINI.md or `.agent/rules/`)
- [ ] No duplication with existing skills
- [ ] Under 200 lines (use references for overflow)
- [ ] No empty directories
