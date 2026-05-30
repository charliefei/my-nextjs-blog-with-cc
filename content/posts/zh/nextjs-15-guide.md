---
title: Next.js 15 入门指南
description: 全面介绍如何使用 Next.js 15 App Router 构建现代 Web 应用，涵盖路由、数据获取和部署等内容。
coverImage: /images/posts/nextjs-guide.jpg
date: 2026-04-05
tags: [Next.js, React, Web开发]
category: 教程
author: Charlie Fei
slug: nextjs-15-guide
published: true
---

## 简介

Next.js 15 带来了诸多强大特性，让构建现代 Web 应用变得前所未有的简单。本指南将从基础概念入手，系统性地带你了解 App Router 的完整生态——从路由系统、布局管理，到数据获取、渲染策略和错误处理，帮助你建立全面的知识框架。

## App Router 基础

App Router 是现代 Next.js 应用的基石。它基于文件系统路由，目录结构即对应页面路径。下面是一个简单的路由示例：

```typescript
// app/page.tsx
export default function HomePage() {
  return (
    <main>
      <h1>欢迎使用 Next.js 15</h1>
    </main>
  )
}
```

在 `app` 目录下创建的文件会自动映射为对应的路由：

| 文件路径 | 对应路由 |
| --- | --- |
| `app/page.tsx` | `/` |
| `app/about/page.tsx` | `/about` |
| `app/blog/[slug]/page.tsx` | `/blog/:slug`（动态路由） |
| `app/blog/[...catchAll]/page.tsx` | `/blog/*`（通配路由） |

## 布局系统

布局是 Next.js App Router 的一大亮点，它让页面间的共享 UI 变得异常简单。

### 根布局

每个应用都必须有一个根布局（`app/layout.tsx`），它包裹所有页面：

```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

### 嵌套布局

你可以在任意路由层级添加 `layout.tsx`，布局会自动嵌套。导航时布局保持状态，不会重新渲染：

```typescript
// app/blog/layout.tsx
// 所有 /blog/* 页面共享此布局
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

### 模板

模板（`template.tsx`）与布局类似，但每次导航都会重新渲染，适合需要重置状态的场景（如页面试点追踪）：

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

## 路由进阶

### 路由组

使用 `(groupName)` 目录结构组织路由，不会影响 URL 路径。适用于将不同模块的路由分组，或为不同组使用不同布局：

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

### 并行路由

通过命名插槽（`@slotName`）在同一布局中同时渲染多个页面，适合仪表盘或多区域页面：

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

## 加载与错误处理

Next.js 15 为每个路由段提供了内置的加载和错误边界。

### 加载界面

添加 `loading.tsx` 即可在页面加载时显示骨架屏或加载动画，配合流式渲染实现即时的加载反馈：

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

### 错误边界

`error.tsx` 会包裹路由段，捕获渲染中的异常。必须是客户端组件：

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
      <h2>出错了</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>重试</button>
    </div>
  )
}
```

### 404 页面

通过 `not-found.tsx` 自定义 Not Found 界面，或调用 `notFound()` 函数主动触发：

```typescript
// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h1>404 - 页面未找到</h1>
      <Link href="/">返回首页</Link>
    </div>
  )
}
```

### 全局错误

`global-error.tsx` 包裹整个应用，仅在根布局出现严重错误时使用（需包含 `<html>` 和 `<body>` 标签）：

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
        <h2>应用发生严重错误</h2>
        <button onClick={() => reset()}>重试</button>
      </body>
    </html>
  )
}
```

## 核心特性

- **服务端组件**：默认在服务器端渲染，减少客户端 JavaScript 体积，提升首屏加载性能。可直接访问数据库和文件系统，无需暴露 API 端点。
- **流式渲染**：支持将 HTML 分块渐进式传输到客户端，用户可以更快看到页面内容，无需等待整个页面完全生成。配合 `loading.tsx` 实现流畅的加载体验。
- **Metadata API**：通过导出 `metadata` 对象或 `generateMetadata` 函数，以类型安全的方式定义页面标题、描述、Open Graph 等元数据，轻松优化 SEO。
- **Server Actions**：在服务端组件中直接定义表单提交和数据变更逻辑，无需手动创建 API 路由，简化前后端交互。支持渐进增强（JavaScript 不可用时退化为传统表单提交）。

## 数据获取

Next.js 15 提供了灵活的数据获取方式，你可以在服务端组件中直接使用 `async/await`：

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

得益于服务端组件的特性，数据获取在服务器端完成，不会暴露 API 凭据，也无需客户端加载额外数据请求逻辑。

### fetch 缓存策略

内置的 `fetch` 支持细粒度的缓存控制：

```typescript
// 静态数据请求——默认行为，缓存结果
const staticData = await fetch('https://...')

// 动态数据请求——每次请求重新获取
const dynamicData = await fetch('https://...', { cache: 'no-store' })

// 基于时间的增量再验证——每 10 秒重新获取一次
const revalidatedData = await fetch('https://...', {
  next: { revalidate: 10 },
})
```

### 数据库查询

服务端组件可以直接查询数据库，无需编写 API 路由：

```typescript
export default async function UserProfile({ params }: { params: { id: string } }) {
  const user = await db.users.findUnique({
    where: { id: params.id },
  })

  return <div>{user.name}</div>
}
```

## 渲染策略

Next.js 15 提供多种渲染模式，可根据页面特性灵活选择。

### 静态渲染（Static Rendering）

默认渲染方式。路由在构建时渲染，结果被缓存并可被 CDN 分发。适合内容页面、博客文章等不频繁变化的内容。

```typescript
export const dynamic = 'force-static'
```

### 动态渲染（Dynamic Rendering）

路由在每次请求时动态渲染。适合个性化内容、实时数据等场景：

```typescript
export const dynamic = 'force-dynamic'
```

### 增量静态再生成（ISR）

结合静态与动态的优势——静态提供，按需更新。适合数据定期变化但不要求实时的场景：

```typescript
// 页面级别 ISR
export const revalidate = 3600 // 每 1 小时重新生成
```

### 路由段配置

每个路由段可以通过导出的配置项精细控制行为：

```typescript
export const dynamic = 'auto'           // 静态/动态自动选择
export const dynamicParams = true        // 未生成的动态参数是否自动处理
export const revalidate = false          // 重新验证间隔（秒）
export const fetchCache = 'auto'         // fetch 缓存策略
export const runtime = 'nodejs'          // 运行时环境
export const preferredRegion = 'auto'    // 部署区域
```

## 中间件

中间件（`middleware.ts`）在请求完成之前执行，可用于重定向、重写、鉴权、国际化路由等场景：

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 基于 Cookie 重定向用户
  if (!request.cookies.has('session')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

// 配置匹配路径
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
```

## 总结

Next.js 15 为构建高性能 Web 应用提供了坚实而优雅的基础。本文涵盖了从路由系统、布局管理、数据获取，到渲染策略和错误处理的核心概念。关键要点回顾：

- **文件系统路由**让页面组织结构一目了然
- **布局与加载边界**提供了优雅的 UI 组合与用户体验
- **服务端组件**简化了数据获取并提升了性能
- **多样的渲染策略**让你在不同场景下选择最优方案
- **内置错误处理**确保应用的健壮性

以上只是 Next.js 能力的一部分，建议从这些基础入手，在实践中逐步探索更多高级特性。
