---
description: Create conventional commit with emoji prefix and pre-commit checks
---

# Conventional Commit Workflow

Create well-structured commits following conventional commit format with emoji.

## Steps

// turbo
1. Check current status:
```bash
git status
```

2. If no staged changes, review modified files and stage appropriate ones:
```bash
git add <relevant files>
```

// turbo
3. Run pre-commit type check:
```bash
npx tsc --noEmit --pretty 2>&1 | head -20
```

4. If type check passes, analyze changes and generate commit message.

5. Commit with conventional format:
```bash
git commit -m "<emoji> <type>(<scope>): <description>

<body explaining what and why>
"
```

## Commit Message Format

```
<emoji> <type>(<scope>): <short description>

<optional body>
```

### Type + Emoji mapping:
- ✨ `feat` — New feature
- 🐛 `fix` — Bug fix
- ♻️ `refactor` — Code refactoring
- 📝 `docs` — Documentation
- 🎨 `style` — Formatting/styling
- ⚡ `perf` — Performance
- ✅ `test` — Tests
- 🔧 `chore` — Build/tooling
- 🗑️ `remove` — Removing code/files
- 🚀 `deploy` — Deployment

### Examples:
```
✨ feat(auth): add OAuth2 authentication flow
🐛 fix(api): handle null response in user endpoint
♻️ refactor(editor): extract heading-row logic into hook
📝 docs(readme): update installation instructions
```

## Rules
- Scope should match the feature area or component
- Description in imperative mood, lowercase, no period
- Body explains WHAT changed and WHY (not how)
- Reference issues if applicable: `Closes #123`
