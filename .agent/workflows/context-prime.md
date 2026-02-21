---
description: Load project context and understand the codebase
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
find src -type d -maxdepth 3 2>/dev/null | head -50 || ls -la
```

4. Check dependencies and scripts:
```bash
cat package.json 2>/dev/null | head -60 || cat Cargo.toml 2>/dev/null | head -30 || cat pyproject.toml 2>/dev/null | head -30
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
- Architecture patterns in use
- Key dependencies
- Build and dev scripts
- Current branch state
- Agent-specific rules (from GEMINI.md / CLAUDE.md)
