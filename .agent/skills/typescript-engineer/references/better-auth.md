---
name: better-auth-best-practices
description: Authentication patterns using Better Auth library with Next.js App Router. Covers server config, session validation, middleware, hooks, and plugins (2FA, organizations, admin). Reference material from /better-auth/skills (238 snippets, score 7.8).
source: https://github.com/better-auth/skills/blob/main/better-auth/best-practices/SKILL.md
---

# Better Auth — Best Practices Reference

## Server Configuration (`lib/auth.ts`)

```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { twoFactor, organization, admin } from "better-auth/plugins";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: `<a href="${url}">Click here to reset your password</a>`
      });
    }
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!
    }
  },

  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email",
        html: `<a href="${url}">Verify email</a>`
      });
    }
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5 // 5 minutes
    }
  },

  plugins: [twoFactor(), organization(), admin()],

  trustedOrigins: ["https://example.com"],
  rateLimit: { enabled: true, window: 60, max: 100 }
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
```

## Session Validation in Server Components

```typescript
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      <p>Email: {session.user.email}</p>
    </div>
  );
}
```

## Session Validation in API Routes

```typescript
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userData = await fetchUserData(session.user.id);
  return NextResponse.json(userData);
}
```

## Middleware for Route Protection

```typescript
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers
  });

  const protectedPaths = ["/dashboard", "/settings", "/admin"];
  const isProtected = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}
```

## Authentication Hooks

```typescript
import { betterAuth, createAuthMiddleware } from "better-auth";

export const auth = betterAuth({
  hooks: {
    before: [
      {
        matcher: (ctx) => ctx.path === "/sign-in/email",
        handler: createAuthMiddleware(async (ctx) => {
          console.log("Sign-in attempt:", ctx.body?.email);
          return { context: ctx };
        })
      }
    ],
    after: [
      {
        matcher: (ctx) => ctx.path === "/sign-in/email",
        handler: createAuthMiddleware(async (ctx) => {
          if (ctx.context.returned?.user) {
            await trackLogin(ctx.context.returned.user.id);
          }
          return { context: ctx };
        })
      }
    ]
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({
          data: { ...user, role: "user", createdAt: new Date() }
        }),
        after: async (user) => {
          await sendWelcomeEmail(user.email);
          await createDefaultWorkspace(user.id);
        }
      }
    }
  }
});
```

## Session Management Notes

- If `secondaryStorage` is defined, sessions are stored there instead of DB
- `cookieCache` strategies: `compact` (default), `jwt` (signed), `jwe` (encrypted)
- Key options: `session.expiresIn`, `session.updateAge`, `session.cookieCache.maxAge`
- Changing `session.cookieCache.version` invalidates all sessions
