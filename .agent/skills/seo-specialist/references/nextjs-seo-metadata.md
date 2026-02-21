---
name: nextjs-seo-metadata
description: Official Next.js Metadata API patterns — generateMetadata, Open Graph, Twitter Cards, sitemap, robots. Benchmark 90.5.
source: https://nextjs.org/docs (Official Next.js docs, benchmark 90.5)
---

# Next.js SEO & Metadata — Reference

## Static Metadata

```typescript
// app/layout.tsx or app/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My App',
  description: 'A modern SaaS platform',
  alternates: {
    canonical: 'https://example.com',
    languages: { en: 'https://example.com/en' },
  },
  openGraph: {
    title: 'My App',
    description: 'A modern SaaS platform',
    images: [{ url: 'https://example.com/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My App',
    description: 'A modern SaaS platform',
    images: ['https://example.com/og-image.png'],
  },
}
```

## Dynamic Metadata (generateMetadata)

```typescript
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params // Next.js 15: async params

  const post = await fetch(`https://api.example.com/blog/${slug}`)
    .then((res) => res.json())

  // Extend parent metadata (OpenGraph images)
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [{ url: post.image }, ...previousImages],
    },
  }
}
```

## Metadata Fields

| Field | Purpose |
|---|---|
| `title` | Page title (string, template, or absolute) |
| `description` | Meta description |
| `metadataBase` | Base URL for relative metadata URLs |
| `openGraph` | Open Graph tags (Facebook, LinkedIn) |
| `twitter` | Twitter Card tags |
| `alternates` | Canonical URL, language alternates |
| `icons` | Favicon, apple-touch-icon |
| `robots` | `index`, `follow`, `noindex`, etc. |
| `themeColor` | Browser theme color |

## Title Templates

```typescript
// app/layout.tsx — parent template
export const metadata: Metadata = {
  title: {
    default: 'My App',
    template: '%s | My App', // %s = child page title
  },
}

// app/blog/page.tsx — child
export const metadata: Metadata = {
  title: 'Blog', // Renders as "Blog | My App"
}

// Override template with absolute
export const metadata: Metadata = {
  title: { absolute: 'Custom Title' }, // Ignores parent template
}
```

## Rules

- **Every page** MUST have unique `title` and `description`
- **Use** `generateMetadata` for dynamic routes (blog, products)
- **Extend** parent OG images with `(await parent).openGraph?.images`
- **Set** `metadataBase` in root layout for relative URLs
- **Single** `<h1>` per page for proper heading hierarchy
- **Params** are async in Next.js 15 — always `await params`
