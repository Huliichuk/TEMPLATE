---
name: vercel-nextjs-patterns
description: Official Vercel Next.js best practices covering file conventions, server actions, error handling, and middleware. Score 9.6.
source: https://github.com/vercel-labs/next-skills (score 9.6)
---

# Vercel Next.js Best Practices — Reference

## File Conventions

```
app/
├── layout.tsx          # Root layout (required)
├── page.tsx            # Home page (/)
├── loading.tsx         # Loading UI
├── error.tsx           # Error UI
├── not-found.tsx       # 404 UI
├── global-error.tsx    # Global error UI
├── route.ts            # API endpoint
├── template.tsx        # Re-rendered layout
├── default.tsx         # Parallel route fallback
├── blog/
│   ├── page.tsx        # /blog
│   └── [slug]/
│       └── page.tsx    # /blog/:slug
└── (group)/            # Route group (no URL impact)
    └── page.tsx
```

## Server Actions

```tsx
// app/actions.ts
'use server';
import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  await db.post.create({ data: { title } });
  revalidatePath('/posts');
}

export async function deletePost(id: string) {
  await db.post.delete({ where: { id } });
  revalidateTag('posts');
}

// Usage in component
export default function NewPost() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <button type="submit">Create</button>
    </form>
  );
}
```

## ⚠️ CRITICAL: redirect() in try-catch

```tsx
'use server'
import { redirect } from 'next/navigation'

// ❌ BAD — redirect() throws, catch blocks swallow it
async function createPost(formData: FormData) {
  try {
    const post = await db.post.create({ ... })
    redirect(`/posts/${post.id}`)  // This THROWS!
  } catch (error) {
    // redirect() throw is caught — navigation fails!
    return { error: 'Failed to create post' }
  }
}

// ✅ GOOD — Call redirect outside try-catch
async function createPost(formData: FormData) {
  let post
  try {
    post = await db.post.create({ ... })
  } catch (error) {
    return { error: 'Failed to create post' }
  }
  redirect(`/posts/${post.id}`)  // Outside try-catch
}

// ✅ GOOD — Use unstable_rethrow
import { unstable_rethrow } from 'next/navigation'

async function createPost(formData: FormData) {
  try {
    const post = await db.post.create({ ... })
    redirect(`/posts/${post.id}`)
  } catch (error) {
    unstable_rethrow(error) // Re-throws Next.js internal errors
    return { error: 'Something went wrong' }
  }
}
```

## Middleware

```typescript
// middleware.ts (root of project)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Auth, redirects, rewrites, etc.
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
```

## Covered Topics

- File Conventions (project structure)
- RSC Boundaries (Server/Client Component rules)
- Data Patterns (fetching and mutation)
- Async Patterns (Next.js 15+ async APIs)
- Directives (`'use client'`, `'use server'`, `'use cache'`)
- Runtime Selection (Node.js vs Edge)
- Error Handling (error.tsx, not-found.tsx)
- Metadata for SEO
- `next/image` and `next/font` optimizations
- Bundling, Scripts, Hydration Errors
- Suspense Boundaries, Parallel Routes
