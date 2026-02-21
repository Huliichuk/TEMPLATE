---
name: next-intl
description: Official next-intl patterns for Next.js App Router — getRequestConfig, useTranslations, getTranslations, middleware, routing. Benchmark 94.6.
source: https://github.com/amannn/next-intl (Official, benchmark 94.6)
---

# next-intl — Reference

## Setup (App Router)

### 1. i18n Request Config

```typescript
// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  const locale = 'en'; // or detect from middleware

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

### 2. Messages File

```json
// messages/en.json
{
  "HomePage": {
    "title": "Hello world!",
    "description": "Welcome to our platform"
  },
  "Common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete"
  }
}
```

### 3. Middleware

```typescript
// src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except API routes, Next.js internals, static files
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
```

## Usage

### Server Components

```typescript
import { getTranslations } from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('HomePage');
  return <h1>{t('title')}</h1>;
}
```

### Client Components

```typescript
'use client';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');
  return <h1>{t('title')}</h1>;
}
```

## Rules

- **Server Components**: Use `getTranslations()` (async, awaitable)
- **Client Components**: Use `useTranslations()` (hook-based)
- **Namespace pattern**: `t('HomePage.title')` or scope with `useTranslations('HomePage')`
- **JSON parity**: All locale files MUST have identical keys — missing keys cause `MISSING_MESSAGE`
- **Middleware**: Required for locale detection and URL prefix routing
