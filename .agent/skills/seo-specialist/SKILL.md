---
name: seo-specialist
description: Expert-level SEO implementation for Next.js App Router applications. Covers metadata, structured data, Core Web Vitals, internationalization, and crawl optimization.
---

# SEO Specialist Skill — Next.js SEO

## Overview

This skill is the guide for implementing SEO in Next.js App Router applications. 

> [!CAUTION]
> Do not aggressively add JSON-LD, Breadcrumb schemas, or complex metadata to pages unless the user explicitly requests SEO optimization for that page. Keep metadata simple (Title, Description) by default.

## When to Use

- When explicitly asked to optimize a page for SEO.
- Creating dynamic routes that specifically need search visibility (e.g. blog posts).
- Implementing internationalization (i18n).

---

## 1. Metadata API

### 1.1 Static Metadata (Fixed Pages)
For pages with unchanging content (about, contact, pricing):

```typescript
// app/about/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Brand Name',
  description: 'Learn about our mission, team, and values. We build premium SaaS solutions.',
  alternates: {
    canonical: 'https://example.com/about',
  },
  openGraph: {
    title: 'About Us | Brand Name',
    description: 'Learn about our mission, team, and values.',
    url: 'https://example.com/about',
    siteName: 'Brand Name',
    images: [{ url: '/og/about.png', width: 1200, height: 630, alt: 'About Brand Name' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Brand Name',
    description: 'Learn about our mission, team, and values.',
    images: ['/og/about.png'],
  },
};
```

### 1.2 Dynamic Metadata (Data-Driven Pages)
For pages where metadata depends on route params or fetched data:

```typescript
// app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import { getPost } from '@/lib/posts';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params; // Next.js 15: params is async
  const post = await getPost(slug);

  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
    alternates: {
      canonical: `https://example.com/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://example.com/blog/${slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}
```

### 1.2b Extended: Inheriting Parent Metadata (`ResolvingMetadata`)
Use `ResolvingMetadata` to extend parent metadata instead of replacing it:

```typescript
import type { Metadata, ResolvingMetadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  // Extend parent OG images instead of replacing
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product.name,
    openGraph: {
      images: [product.image, ...previousImages],
    },
  };
}
```

### 1.3 Root Layout Metadata (Site-Wide Defaults)
```typescript
// app/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: {
    default: 'Brand Name — Premium Solutions',
    template: '%s | Brand Name', // Pages override with just the page title
  },
  description: 'Default site description for SEO.',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};
```

### 1.4 Dynamic OG Image Generation (File Convention)
Next.js supports **file-based OG images** — place `opengraph-image.tsx` in any route folder:

```typescript
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'Blog post cover';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 60,
        }}
      >
        <div style={{ fontSize: 32, opacity: 0.8 }}>Blog</div>
        <div style={{ textAlign: 'center', marginTop: 16 }}>{post?.title}</div>
      </div>
    ),
    { ...size }
  );
}
```

> [!TIP]
> File-based OG images are **auto-cached** and **auto-linked** in metadata — no need to manually add them to the `openGraph.images` array.

Supported file conventions:
- `opengraph-image.png` / `.jpg` / `.gif` — static images
- `opengraph-image.tsx` — dynamic generation via `ImageResponse`
- `twitter-image.tsx` — same pattern for Twitter cards
- Recommended dimensions: **1200×630px**

### 1.5 Rules
- **Every public page** MUST export `metadata` or `generateMetadata`
- **Title format**: `Page Title | Brand Name` (use `title.template` in root layout)
- **Description**: 120-160 characters, unique per page, include primary keyword
- **Canonical URL**: ALWAYS set on every page to prevent duplicate content
- **Open Graph images**: 1200×630px, descriptive `alt` text
- **Dynamic OG**: Use `opengraph-image.tsx` for data-driven pages (blog, products)

---

## 2. Structured Data (JSON-LD)

### 2.1 Implementation Pattern
```typescript
// components/json-ld.tsx
interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'), // XSS prevention
      }}
    />
  );
}
```

### 2.2 Common Schema Types

**Organization (Root Layout)**
```typescript
<JsonLd data={{
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Brand Name',
  url: 'https://example.com',
  logo: 'https://example.com/logo.png',
  sameAs: [
    'https://twitter.com/brand',
    'https://linkedin.com/company/brand',
  ],
}} />
```

**Article (Blog Posts)**
```typescript
<JsonLd data={{
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.title,
  description: post.excerpt,
  image: post.coverImage,
  datePublished: post.publishedAt,
  dateModified: post.updatedAt,
  author: {
    '@type': 'Person',
    name: post.author.name,
  },
}} />
```

**Product (E-Commerce)**
```typescript
<JsonLd data={{
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: product.images,
  brand: { '@type': 'Brand', name: product.brand },
  offers: {
    '@type': 'Offer',
    price: product.price,
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    url: `https://example.com/products/${product.slug}`,
  },
  aggregateRating: product.rating ? {
    '@type': 'AggregateRating',
    ratingValue: product.rating,
    reviewCount: product.reviewCount,
  } : undefined,
}} />
```

**FAQ Page**
```typescript
<JsonLd data={{
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
}} />
```

**BreadcrumbList (Navigation)**
```typescript
<JsonLd data={{
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://example.com' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://example.com/blog' },
    { '@type': 'ListItem', position: 3, name: post.title },
  ],
}} />
```

**When to use which schema:**
| Page Type | Schema Type |
|---|---|
| Homepage | `Organization` + `WebSite` |
| Blog post | `Article` + `BreadcrumbList` |
| Product page | `Product` + `BreadcrumbList` |
| FAQ page | `FAQPage` |
| Contact page | `LocalBusiness` or `Organization` |
| How-to guide | `HowTo` + `Article` |

### 2.3 Rules
- Sanitize ALL dynamic content in JSON-LD to prevent XSS
- Place JSON-LD in the page component, not in `<head>` (Next.js handles it)
- Only implement JSON-LD if explicitly requested.

---

## 3. Sitemap & Robots

### 3.1 Dynamic Sitemap
```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  const postUrls = posts.map((post) => ({
    url: `https://example.com/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    { url: 'https://example.com', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: 'https://example.com/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://example.com/blog', lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    ...postUrls,
  ];
}
```

### 3.2 Robots
```typescript
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/'],
      },
    ],
    sitemap: 'https://example.com/sitemap.xml',
  };
}
```

### 3.3 Rules
- NEVER block CSS/JS resources in robots.txt
- Include sitemap URL in robots.txt
- Use `noindex` meta tag (not robots.txt) for pages to crawl but not index
- Update sitemap when adding new public routes
- For large sites (1000+ pages), implement sitemap index with multiple sitemaps

---

## 4. Core Web Vitals Optimization

### 4.1 LCP (Largest Contentful Paint) — Target: < 2.5s
- Use `next/image` with `priority` for hero/above-the-fold images
- Preload critical fonts with `next/font`
- Use Server Components to reduce TTFB
- Minimize render-blocking resources

### 4.2 INP (Interaction to Next Paint) — Target: < 200ms
- Minimize client-side JavaScript — prefer Server Components
- Use `dynamic()` imports for heavy components
- Avoid blocking the main thread with expensive computations
- Use `useTransition` for non-urgent state updates

### 4.3 CLS (Cumulative Layout Shift) — Target: < 0.1
- ALWAYS set `width` and `height` on images (or use `fill` with container)
- Use `next/font` to prevent FOUT/FOIT
- Reserve space for dynamic content (ads, embeds, lazy-loaded components)
- Avoid injecting content above existing content

### 4.4 Image SEO Pattern
```typescript
import Image from 'next/image';

// Hero image — priority loaded, responsive sizes
<Image
  src="/hero.webp"
  alt="Descriptive alt text with keywords"  // SEO: descriptive alt
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority  // Above the fold = priority
  placeholder="blur"
  blurDataURL="data:image/..."  // LQIP for better UX
/>

// Below-fold image — lazy loaded (default)
<Image
  src="/feature.webp"
  alt="Feature description"
  width={800}
  height={450}
  sizes="(max-width: 768px) 100vw, 50vw"
  // No priority = lazy loaded by default
/>
```

---

## 5. Internationalization SEO (hreflang)

### 5.1 Alternate Languages in Metadata
```typescript
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://example.com/about',
    languages: {
      'en': 'https://example.com/en/about',
      'es': 'https://example.com/es/about',
      'de': 'https://example.com/de/about',
      'uk': 'https://example.com/uk/about',
      'x-default': 'https://example.com/about',
    },
  },
};
```

### 5.2 Rules
- ALWAYS include `hreflang` alternates for multilingual pages
- Include `x-default` for the fallback language
- Ensure each language version links to ALL other language versions
- Use `next-intl` for structured i18n routing
- Localize metadata (title, description) for each language

---

## 6. Technical SEO Checklist

### Per-Page Checklist (When SEO is requested)
- [ ] `title` tag — unique, 50-60 characters, includes primary keyword
- [ ] `meta description` — unique, 120-160 characters, compelling CTA
- [ ] Open Graph tags (if requested)
- [ ] JSON-LD structured data (only if requested)
- [ ] Single `<h1>` per page with primary keyword
- [ ] Semantic HTML (`<main>`, `<article>`, `<section>`, `<nav>`, `<aside>`)
- [ ] All images have descriptive `alt` attributes
- [ ] All images use `next/image` component
- [ ] Internal links use `<Link>` component (not `<a>`)
- [ ] No broken links

### Site-Wide Checklist
- [ ] `sitemap.xml` generated and submitted to GSC
- [ ] `robots.txt` configured correctly
- [ ] `metadataBase` set in root layout
- [ ] `title.template` configured for consistent titles
- [ ] 404 page (`not-found.tsx`) exists with proper metadata
- [ ] Error page (`error.tsx`) exists
- [ ] All routes have proper metadata exports
- [ ] HTTPS enforced
- [ ] `hreflang` tags for all supported languages
- [ ] Core Web Vitals passing (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- [ ] No render-blocking resources
- [ ] Images served in modern formats (WebP/AVIF)

### Content SEO Rules
- [ ] URL structure is clean, descriptive, lowercase, hyphenated
- [ ] Heading hierarchy is logical (h1 → h2 → h3, no skipping)
- [ ] Content is unique and valuable (no thin pages)
- [ ] Internal linking connects related content
- [ ] External links use `rel="noopener noreferrer"` when appropriate

---

## 7. Common SEO Mistakes to Avoid

| ❌ Mistake | ✅ Correct Approach |
|---|---|
| No metadata on dynamic pages | Export `generateMetadata` on every dynamic route |
| `<img>` instead of `next/image` | ALWAYS use `next/image` for optimization |
| Missing `alt` text on images | Descriptive `alt` with relevant keywords |
| No canonical URL | Set `alternates.canonical` on every page |
| `100vh` hero without content | Ensure LCP element is within viewport |
| Client-side only rendering | Use Server Components for SEO-critical content |
| Blocking JS/CSS in robots.txt | Only block non-public routes like `/api/`, `/admin/` |
| Same title/description on all pages | Unique metadata per page |
| No structured data | Add JSON-LD for Organization, Article, Product, etc. |
| Missing `hreflang` on multilingual sites | Include alternates for ALL supported languages |
