---
name: error-patterns
description: Common error patterns and resolution strategies for Next.js, TypeScript, Supabase, and Stripe integrations.
source: Internal knowledge + vercel-nextjs-patterns
---

# Error Patterns — Reference

## Next.js Gotchas

| Error | Cause | Fix |
|---|---|---|
| `redirect()` silently fails | Caught by `try-catch` | Move `redirect()` outside `try-catch` or use `unstable_rethrow()` |
| `notFound()` swallowed | Same as above | Same pattern — re-throw navigation errors |
| Hydration mismatch | Server/client HTML differs | Ensure consistent rendering, use `suppressHydrationWarning` for dates |
| `useState` in Server Component | Missing `'use client'` | Add directive or move to Client Component |
| `cookies()`/`headers()` sync | Next.js 15 async APIs | `await cookies()`, `await headers()`, `await params` |
| Barrel import bundle bloat | `import { X } from '.'` | Direct imports: `import { X } from './X'` |

## TypeScript Errors

| Error | Cause | Fix |
|---|---|---|
| `Module not found` | Wrong import path | Check path, verify file exists |
| `Property does not exist on type` | Missing interface field | Update interface or use optional chaining |
| `Type X not assignable to Y` | Schema mismatch | Fix types at boundary, check Zod schema |
| `Cannot find name` | Missing import | Add import statement |

## Supabase/Postgres Errors

| Error Code | Meaning | Fix |
|---|---|---|
| `42501` | Permission denied | Add/fix RLS policy |
| `23505` | Unique constraint violation | Use `ON CONFLICT` or check before insert |
| `23503` | Foreign key violation | Ensure parent row exists first |
| `PGRST301` | JWT expired | Refresh auth token |
| `PGRST116` | Row not found (.single()) | Handle null: check before access |

## Stripe Errors

| Error | Cause | Fix |
|---|---|---|
| No such customer | Deleted/wrong customer ID | Verify customer exists in Stripe |
| Invalid API key | Wrong env var | Check `STRIPE_SECRET_KEY` in `.env` |
| Webhook signature failed | Wrong signing secret | Use correct `STRIPE_WEBHOOK_SECRET` |
| Amount too small | Below minimum (50 cents) | Enforce minimum in UI |

## Debug Workflow

```
1. Reproduce → exact steps to trigger
2. Isolate → which layer? (UI / Action / DB / External)
3. Read error → full stack trace, not just message
4. Five Whys → trace cause chain to root
5. Fix → minimal change, verify no regression
6. Test → add test for the failure case
```

## Stale Cache Clearing

```bash
# Next.js
rm -rf .next/types && rm -rf .next

# Node modules cache
rm -rf node_modules/.cache

# Force fresh build
npm run build
```
