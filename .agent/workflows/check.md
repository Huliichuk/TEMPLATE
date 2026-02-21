---
description: Run comprehensive code quality checks for TypeScript projects
---

# Code Quality Check

Comprehensive code quality and type safety verification.

## Steps

// turbo
1. Run TypeScript type checker:
```bash
npx tsc --noEmit --pretty 2>&1 | head -60
```

2. If errors found:
   - Parse and analyze errors in priority order
   - Fix build-breaking errors first
   - Then fix type errors
   - Then fix warnings
   - Re-run check after each fix until all pass

// turbo
3. Run build verification (optional, more thorough):
```bash
npm run build 2>&1 | tail -30
```

4. Review results and report summary to user:
   - Total errors found
   - Errors fixed
   - Remaining issues (if any)

## Important Rules
- Never commit during the check process
- Fix errors iteratively, don't attempt all at once
- Prioritize: build errors > type errors > lint warnings
- Always re-run checks after fixes to verify
