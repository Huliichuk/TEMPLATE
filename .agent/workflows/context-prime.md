---
description: Load project context before implementation. Use when starting work in an unfamiliar area of the repo.
---

# Context Prime

Prime yourself with the full project context before starting work.

## Steps

// turbo-all

1. Read project rules (if exists):
```bash
cat GEMINI.md 2>/dev/null || cat CLAUDE.md 2>/dev/null || cat AGENTS.md 2>/dev/null || echo "No agent rules file found"
```

2. Read project overview:
```bash
cat README.md 2>/dev/null || echo "No README found"
```

3. Review project structure:
```bash
find apps packages src -maxdepth 3 -type d 2>/dev/null | head -60 || ls -la
```

4. Check TypeScript project config and scripts:
```bash
cat package.json 2>/dev/null | head -80
find . -maxdepth 3 -name "tsconfig*.json" 2>/dev/null | head -20
ls -1 pnpm-lock.yaml yarn.lock package-lock.json 2>/dev/null
```

5. List recent changes:
```bash
git log --oneline -10
```

6. Check current branch and status:
```bash
git branch --show-current && git status --short
```

## What You Should Understand After Priming

- Project stack and framework
- Package manager and workspace layout
- Architecture patterns in use
- Key dependencies
- TypeScript config boundaries
- Current branch state
- Agent-specific rules (from GEMINI.md / CLAUDE.md)
