---
description: Run code quality and type-safety checks. Use when validating changes before review, commit, or deploy.
---

# Code Quality Check

Comprehensive code quality and type safety verification.

## Steps

1. Select package manager (repo lockfile):
```bash
PM=npm
[ -f pnpm-lock.yaml ] && PM=pnpm
[ -f yarn.lock ] && PM=yarn
```

2. Run TypeScript type checker:
```bash
$PM run typecheck 2>&1 | head -60 || ./node_modules/.bin/tsc --noEmit --pretty 2>&1 | head -60
```

3. If errors found:
   - Parse and analyze errors in priority order
   - Fix build-breaking errors first
   - Then fix type errors
   - Then fix warnings
   - Re-run check after each fix until all pass

4. Run build verification (optional, more thorough):
```bash
$PM run build 2>&1 | tail -30
```

5. Review results and report summary to user:
   - Total errors found
   - Errors fixed
   - Remaining issues (if any)

## Important Rules
- Never commit during the check process
- Fix errors iteratively, don't attempt all at once
- Prioritize: build errors > type errors > lint warnings
- Always re-run checks after fixes to verify
