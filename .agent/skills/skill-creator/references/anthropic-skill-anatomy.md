---
name: skill-anatomy
description: Anthropic's official guidelines for skill structure, conciseness, and degrees of freedom. Meta-reference for creating and organizing agent skills.
source: https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md
---

# Skill Anatomy — Anthropic Official Guidelines

## Skill Structure

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter metadata (required)
│   │   ├── name: (required)
│   │   ├── description: (required)
│   │   └── compatibility: (optional, rarely needed)
│   └── Markdown instructions (required)
└── Bundled Resources (optional)
    ├── scripts/          - Executable code (Python/Bash/etc.)
    ├── references/       - Documentation loaded into context as needed
    └── assets/           - Files used in output (templates, icons, fonts)
```

## Core Principles

### Concise is Key
The context window is a public good. Skills share it with system prompt, conversation history, other Skills' metadata, and user requests.

**Default assumption: the agent is already very smart.** Only add context it doesn't already have. Challenge each piece of information: "Does it really need this explanation?" and "Does this paragraph justify its token cost?"

> Prefer concise examples over verbose explanations.

### Degrees of Freedom

| Freedom Level | When to Use | Format |
|---|---|---|
| **High** | Multiple approaches valid, context-dependent | Text instructions |
| **Medium** | Preferred pattern exists, some variation OK | Pseudocode with params |
| **Low** | Fragile operations, consistency critical | Specific scripts, few params |

> Think of a narrow bridge with cliffs (low freedom) vs. an open field (high freedom).

## Resource Types

### Scripts (`scripts/`)
- When the same code is being rewritten repeatedly
- When deterministic reliability is needed
- Token efficient, may execute without loading into context

### References (`references/`)
- Documentation that the agent should reference while working
- Database schemas, API docs, domain knowledge, company policies
- Keeps SKILL.md lean, loaded only when needed
- If files are large (>10k words), include grep search patterns in SKILL.md
- **Avoid duplication**: info should live in either SKILL.md or references, not both

### Assets (`assets/`)
- Files used in output, NOT loaded into context
- Templates, images, icons, boilerplate code, fonts

## What NOT to Include

- README.md
- INSTALLATION_GUIDE.md
- QUICK_REFERENCE.md
- CHANGELOG.md
- Any auxiliary documentation about the creation process
