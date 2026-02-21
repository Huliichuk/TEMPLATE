---
description: Deploy changes to production via Vercel
---

# Deployment Workflow

// turbo-all

## Pre-deployment Checks

1. Ensure clean build:
```bash
npm run build 2>&1 | tail -20
```

2. If build fails, fix errors before proceeding.

3. Verify all changes are committed:
```bash
git status
```

4. Push to remote:
```bash
git push
```

5. Monitor deployment:
   - Vercel auto-deploys from `main` branch
   - Check deployment status at the hosting dashboard
   - Verify no build errors in deploy logs

## Post-deployment

6. Verify production site loads correctly
7. Test critical user flows

## Rollback

If issues found in production:
```bash
git revert HEAD && git push
```

Or roll back via hosting dashboard to previous deployment.
