---
title: Building a Blog with Markdown
description: Learn how to create a markdown-powered blog with Next.js, featuring frontmatter parsing, syntax highlighting, and RSS feed generation.
coverImage: /images/posts/markdown-blog.jpg
date: 2026-03-28
tags: [Markdown, Blog, Content]
category: Tutorials
author: Your Name
slug: building-blog-markdown
published: true
---

## Why Markdown?

Markdown is perfect for blog content because it's:
- **Simple**: Easy to write and read
- **Portable**: Works anywhere
- **Extensible**: Supports frontmatter for metadata

## Setting Up the Pipeline

We use gray-matter to parse frontmatter:

```typescript
import matter from 'gray-matter'

const { data, content } = matter(fileContents)
```

## Code Highlighting

With rehype-pretty-code, we get beautiful syntax highlighting:

```javascript
const greeting = "Hello, World!"
console.log(greeting)
```

## Conclusion

Markdown-based blogs are maintainable, portable, and perfect for technical content.