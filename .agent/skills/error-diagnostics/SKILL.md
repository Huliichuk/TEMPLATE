---
name: Error Diagnostics
description: Skills for diagnosing and resolving TypeScript, build, and runtime errors
---

# Error Diagnostics Skill

## When to Use
- TypeScript compilation errors
- Build failures
- Runtime errors in browser
- Sentry production error triage
- Database / API error debugging

## Diagnostic Workflow

### 1. TypeScript Errors
```bash
npx tsc --noEmit --pretty 2>&1 | head -40
```

Common patterns:
| Error | Root Cause | Fix |
|-------|-----------|-----|
| `Module not found` | Wrong import path or missing file | Check path, create file, or clear build cache |
| `Property does not exist` | Type mismatch | Check interface definition, add property or cast |
| `Type X is not assignable to Y` | Wrong return type | Fix function return type or generic parameter |
| `Cannot find name` | Missing import | Add import statement |
| `Argument of type X not assignable` | Mutation type mismatch | Fix generic type parameter |

### 2. Build Errors
```bash
npm run build 2>&1 | tail -30
```

Common patterns:
| Error | Root Cause | Fix |
|-------|-----------|-----|
| Stale type cache | Old generated types | Clear build cache (e.g., `rm -rf .next/types`) |
| `Missing required prop` | Component interface changed | Update all consumers |
| `Cannot use import statement` | Server/Client boundary | Add `"use client"` directive |
| `Hydration mismatch` | Server/client HTML differs | Make rendering consistent |

### 3. Runtime Errors (Browser)
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Check the error stack trace → find the source file
5. For production: use Sentry MCP tools (`mcp_sentry_get_issue_details`)

### 4. Database Errors (Supabase/Postgres)
Use `mcp_supabase_get_logs(project_id, service="postgres")` or `service="api"`.

Common patterns:
| Error | Root Cause | Fix |
|-------|-----------|-----|
| `42501 permission denied` | Missing RLS policy | Add appropriate policy |
| `23505 unique violation` | Duplicate key | Check upsert logic or add constraint |
| `23503 foreign key violation` | Referenced row missing | Ensure parent exists first |
| `PGRST301` | JWT invalid/expired | Check auth token |

### 5. Stale Cache Issues
When errors don't make sense, clear caches:
```bash
# Next.js
rm -rf .next/types && rm -rf .next

# Node
rm -rf node_modules/.cache

# General
npm run build  # Force fresh build
```

## Five Whys Technique
For complex bugs, ask "Why?" five times to find root cause:
1. Why does the error occur? → trace the call stack
2. Why does that function fail? → check its inputs
3. Why are inputs wrong? → check the caller
4. Why does the caller send wrong data? → check data source
5. Why is the data source wrong? → found the root cause

## Error Reporting Format
```
### Error: [error message]
- **File**: path/to/file.ts:42
- **Root Cause**: [explanation]
- **Fix**: [specific change]
- **Verified**: ✅ tsc passes after fix
```
