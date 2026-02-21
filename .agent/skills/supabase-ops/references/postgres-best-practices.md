---
name: supabase-postgres-best-practices
description: Official Supabase PostgreSQL best practices for RLS policies, schema design, indexing, and performance optimization. Combined with Next.js integration patterns.
source: |
  https://github.com/supabase/agent-skills (score 10)
  https://github.com/alinaqi/claude-bootstrap (score 8.7)
---

# Supabase & PostgreSQL — Best Practices Reference

## Row Level Security (RLS)

### Optimized RLS Policies (CRITICAL)

```sql
-- ❌ BAD — auth.uid() called per row (1M rows = 1M calls)
CREATE POLICY orders_policy ON orders
  USING (auth.uid() = user_id);

-- ✅ GOOD — wrapped in SELECT, called once, cached (100x+ faster)
CREATE POLICY orders_policy ON orders
  USING ((SELECT auth.uid()) = user_id);
```

### Security Definer for Complex Checks

```sql
CREATE OR REPLACE FUNCTION is_team_member(team_id bigint)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_id = $1 AND user_id = (SELECT auth.uid())
  );
$$;

CREATE POLICY team_orders_policy ON orders
  USING ((SELECT is_team_member(team_id)));

-- ALWAYS index columns used in RLS policies
CREATE INDEX orders_user_id_idx ON orders (user_id);
```

## Schema Design

```sql
CREATE TABLE users (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- Not serial
  email text,                     -- Not varchar(n)
  created_at timestamptz,         -- Not timestamp (always use timezone)
  is_active boolean DEFAULT true, -- Not varchar for booleans
  price numeric(10,2)             -- Not float for money
);

-- Always index foreign key columns (Postgres doesn't auto-index them!)
CREATE TABLE orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id bigint REFERENCES customers(id) ON DELETE CASCADE,
  total numeric(10,2)
);
CREATE INDEX orders_customer_id_idx ON orders (customer_id);
```

### Data Type Rules

| Use | Instead of |
|---|---|
| `bigint GENERATED ALWAYS AS IDENTITY` | `serial` |
| `text` | `varchar(n)` |
| `timestamptz` | `timestamp` |
| `boolean` | `varchar` for flags |
| `numeric(10,2)` | `float` for money |

## Indexing Strategy

```sql
-- Composite: equality columns FIRST, range columns LAST
CREATE INDEX orders_status_created_idx ON orders (status, created_at);

-- Covering: avoid table lookups (INCLUDE clause)
CREATE INDEX users_email_idx ON users (email) INCLUDE (name, created_at);

-- Choose right index type:
CREATE INDEX products_attrs_idx ON products USING gin (attributes);  -- JSONB
CREATE INDEX events_time_idx ON events USING brin (created_at);      -- Time-series
CREATE INDEX sessions_token_idx ON sessions USING hash (token);      -- Equality-only
```

### Partitioning (>100M rows)

```sql
CREATE TABLE events (
  id bigint GENERATED ALWAYS AS IDENTITY,
  created_at timestamptz NOT NULL,
  data jsonb
) PARTITION BY RANGE (created_at);

CREATE TABLE events_2024_01 PARTITION OF events
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

---

## Supabase + Next.js Integration

### Server Client (`lib/supabase/server.ts`)

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from Server Component — ignore
          }
        },
      },
    }
  );
}
```

### Middleware Auth Pattern

```typescript
import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const publicRoutes = ['/', '/login', '/signup', '/auth/callback'];

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  const isPublicRoute = publicRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirectTo', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (user && ['/login', '/signup'].includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}
```

### Anti-Patterns (AVOID)

| ❌ Don't | ✅ Do Instead |
|---|---|
| Use Supabase client directly for DB queries | Use Drizzle ORM for type safety |
| Fetch data in client components | Use server components |
| Skip middleware for auth | Always use middleware for session refresh |
| Call `cookies()` synchronously in Next.js 15+ | Use `await cookies()` |
| Expose service keys to client | Only use anon key client-side |
| Skip `revalidatePath` after mutations | Always revalidate |
