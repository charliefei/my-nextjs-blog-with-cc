---
title: "Next.js 15: A Complete Guide"
description: A comprehensive introduction to building modern web applications with Next.js 15 App Router, covering routing, layouts, data fetching, rendering strategies, and error handling.
coverImage: /images/posts/nextjs-guide.jpg
date: 2026-04-05
tags: [Next.js, React, Web Development]
category: Tutorials
author: Charlie Fei
slug: nextjs-15-guide
published: true
---

## Introduction

Next.js 15 brings powerful features that make building modern web applications easier than ever. This guide starts with the fundamentals and systematically walks through the complete App Router ecosystem — from the routing system and layout management to data fetching, rendering strategies, and error handling — helping you build a comprehensive knowledge framework.

## App Router Basics

The App Router is the foundation of modern Next.js applications. It uses file-system routing, where the directory structure maps directly to page paths. Here's a simple routing example:

```typescript
// app/page.tsx
export default function HomePage() {
  return (
    <main>
      <h1>Welcome to Next.js 15</h1>
    </main>
  )
}
```

Files created inside the `app` directory are automatically mapped to corresponding routes:

| File Path | Corresponding Route |
| --- | --- |
| `app/page.tsx` | `/` |
| `app/about/page.tsx` | `/about` |
| `app/blog/[slug]/page.tsx` | `/blog/:slug` (dynamic route) |
| `app/blog/[...catchAll]/page.tsx` | `/blog/*` (catch-all route) |

## Layout System

Layouts are a highlight of the Next.js App Router, making it incredibly easy to share UI across pages.

### Root Layout

Every application must have a root layout (`app/layout.tsx`), which wraps all pages:

```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

### Nested Layouts

You can add `layout.tsx` at any route segment level, and layouts are automatically nested. Layouts preserve state during navigation and do not re-render:

```typescript
// app/blog/layout.tsx
// Shared by all /blog/* pages
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Sidebar />
      <article>{children}</article>
    </div>
  )
}
```

### Templates

Templates (`template.tsx`) are similar to layouts but re-render on every navigation, making them suitable for scenarios that require state reset (such as page view tracking):

```typescript
// app/blog/template.tsx
export default function BlogTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="page-enter-animation">{children}</div>
}
```

## Advanced Routing

### Route Groups

Use `(groupName)` directory structure to organize routes without affecting the URL path. Useful for grouping routes by module or applying different layouts to different groups:

```typescript
app/
  (marketing)/
    page.tsx          // /
    about/page.tsx    // /about
  (shop)/
    products/
      page.tsx        // /products
    cart/page.tsx     // /cart
```

### Parallel Routes

Render multiple pages simultaneously within the same layout using named slots (`@slotName`), ideal for dashboards or multi-section pages:

```typescript
// app/layout.tsx
export default function Layout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode
  team: React.ReactNode
  analytics: React.ReactNode
}) {
  return (
    <>
      {children}
      <div className="grid grid-cols-2">
        {team}
        {analytics}
      </div>
    </>
  )
}
```

## Loading & Error Handling

Next.js 15 provides built-in loading and error boundaries for each route segment.

### Loading UI

Add `loading.tsx` to display a skeleton screen or loading animation while the page is loading, providing instant feedback through streaming:

```typescript
// app/blog/loading.tsx
export default function Loading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}
```

### Error Boundaries

`error.tsx` wraps route segments and catches rendering exceptions. It must be a client component:

```typescript
// app/blog/error.tsx
'use client'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

### 404 Page

Customize the Not Found page via `not-found.tsx`, or trigger it programmatically with `notFound()`:

```typescript
// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <Link href="/">Back to Home</Link>
    </div>
  )
}
```

### Global Error

`global-error.tsx` wraps the entire application and is used only when a critical error occurs in the root layout (must include `<html>` and `<body>` tags):

```typescript
// app/global-error.tsx
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <h2>A critical application error occurred</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}
```

## Key Features

- **Server Components**: Rendered on the server by default, reducing client-side JavaScript and improving initial load performance. They can directly access databases and file systems without exposing API endpoints.
- **Streaming**: Supports progressive HTML chunk transmission to the client, allowing users to see content faster without waiting for the entire page to generate. Works with `loading.tsx` for a smooth loading experience.
- **Metadata API**: Define page title, description, Open Graph metadata, and more in a type-safe way by exporting `metadata` objects or `generateMetadata` function, making SEO optimization easy.
- **Server Actions**: Define form submission and data mutation logic directly in server components without manually creating API routes, simplifying front-end/back-end interaction. Supports progressive enhancement (falls back to traditional form submission when JavaScript is unavailable).

## Data Fetching

Next.js 15 offers flexible data fetching approaches. You can use `async/await` directly in server components:

```typescript
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts')
  return res.json()
}

export default async function PostsPage() {
  const posts = await getPosts()
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

Thanks to server components, data fetching happens on the server side — no API credentials are exposed, and no additional data request logic needs to be loaded on the client.

### fetch Caching Strategies

The built-in `fetch` supports fine-grained cache control:

```typescript
// Static data request — default behavior, caches the result
const staticData = await fetch('https://...')

// Dynamic data request — re-fetches on every request
const dynamicData = await fetch('https://...', { cache: 'no-store' })

// Time-based incremental revalidation — re-fetches every 10 seconds
const revalidatedData = await fetch('https://...', {
  next: { revalidate: 10 },
})
```

### Database Queries

Server components can query databases directly without writing API routes:

```typescript
export default async function UserProfile({ params }: { params: { id: string } }) {
  const user = await db.users.findUnique({
    where: { id: params.id },
  })

  return <div>{user.name}</div>
}
```

## Rendering Strategies

Next.js 15 offers multiple rendering modes that can be flexibly chosen based on page characteristics.

### Static Rendering

The default rendering mode. Routes are rendered at build time, cached, and can be distributed via CDN. Ideal for content pages, blog posts, and other infrequently changing content.

```typescript
export const dynamic = 'force-static'
```

### Dynamic Rendering

Routes are rendered dynamically on each request. Suitable for personalized content and real-time data:

```typescript
export const dynamic = 'force-dynamic'
```

### Incremental Static Regeneration (ISR)

Combines the benefits of static and dynamic — serve statically, update on demand. Suitable for scenarios where data changes periodically but does not require real-time updates:

```typescript
// Page-level ISR
export const revalidate = 3600 // Regenerate every hour
```

### Route Segment Configuration

Each route segment can be finely controlled through exported configuration options:

```typescript
export const dynamic = 'auto'           // Auto-select static/dynamic
export const dynamicParams = true        // Auto-handle ungenerated dynamic params
export const revalidate = false          // Revalidation interval (seconds)
export const fetchCache = 'auto'         // fetch cache strategy
export const runtime = 'nodejs'          // Runtime environment
export const preferredRegion = 'auto'    // Deployment region
```

## Middleware

Middleware (`middleware.ts`) executes before a request completes, used for redirects, rewrites, authentication, i18n routing, and more:

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Redirect user based on cookie
  if (!request.cookies.has('session')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

// Configure matching paths
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
```

## Summary

Next.js 15 provides a solid and elegant foundation for building high-performance web applications. This article covers the core concepts from routing system, layout management, and data fetching to rendering strategies and error handling. Key takeaways:

- **File-system routing** makes page organization intuitive at a glance
- **Layouts and loading boundaries** provide elegant UI composition and user experience
- **Server components** simplify data fetching and improve performance
- **Multiple rendering strategies** let you choose the optimal approach for each scenario
- **Built-in error handling** ensures application robustness

These are just some of Next.js's capabilities. Start with these fundamentals and gradually explore more advanced features in practice.
