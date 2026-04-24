<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project: Charlie Fei's Blog

Personal blog built with Next.js 16.2.2, Tailwind CSS v4, shadcn/ui (@base-ui/react), and next-intl. Static export to GitHub Pages.

## Commands

```bash
npm run dev      # Dev server at localhost:3000
npm run build    # Static export to ./out
npm run lint     # ESLint
npm run start    # Serve static export (not used in dev)
```

**GitHub Pages deploy:** Push to `main` → `.github/workflows/deploy.yml` builds with `GITHUB_PAGES=true` and deploys.

## Architecture

```
app/
  [locale]/                    # next-intl locale routing (en, zh)
    page.tsx                   # Home page
    blog/[slug]/page.tsx       # Blog post (static params from content/posts)
    about/page.tsx
    resume/page.tsx
    experience/page.tsx
    layout.tsx                 # Locale layout: providers + Header + Footer
  layout.tsx                   # Root layout (font variables, minimal HTML)
  globals.css                  # Tailwind v4 + theme tokens + prose + animations

components/
  layout/                      # Header, Footer, LanguageSwitcher
  ui/                          # shadcn components (uses @base-ui/react, not Radix)
  blog/, home/, about/, ...    # Feature-specific components
  theme/                       # next-themes ThemeProvider + ThemeToggle
  mdx/                         # react-markdown + rehype-pretty-code renderer

content/
  config/profile.json          # Personal info, social links, resume PDF
  posts/{en,zh}/*.md           # Blog posts (gray-matter frontmatter)
  experience/
    work/{en,zh}/*.md          # Work experience entries
    projects/{en,zh}/*.md      # Project entries
    skills/{en,zh}.json        # Skill categories

lib/                           # Data access + utilities
  posts.ts                     # getAllPosts, getPostBySlug, getRelatedPosts
  experience.ts                # getAllWorkExperiences, getAllProjects, getSkills
  profile.ts                   # getProfile, getPdfUrl
  toc.ts                       # Table of contents extraction
  utils.ts                     # cn() + getAssetPath()

i18n/                          # next-intl config (routing.ts, request.ts)
messages/                      # Translation JSON (en.json, zh.json)
```

## Key Patterns & Gotchas

### basePath / GitHub Pages
- `next.config.ts`: `output: "export"`, `basePath` and `assetPrefix` only set when `GITHUB_PAGES=true`
- Local dev: no basePath → pages load at `/`, `/blog`, etc.
- Deploy: basePath is `/my-nextjs-blog-with-cc` → pages load at `/my-nextjs-blog-with-cc/blog`
- **Use `getAssetPath(path)` for all static asset URLs** (images, PDFs in `<img>`, `<iframe>`, native `<a>`)
- **Do NOT use `getAssetPath()` inside Next.js `<Link>` components** — they auto-prefix basePath, and double-prefixing breaks links

### pdfUrl Handling
- Native `<a>` tag (not `<Link>`) for PDF download links — `<Link>` intercepts and adds basePath again, causing double-prefixing
- `<iframe>` and `<object>` for PDF preview need `getAssetPath()` manually since basePath doesn't apply to them

### Static Export Constraints
- `output: "export"` means: no SSR, no middleware, no API routes, no `next/image` optimization
- All i18n routes must be pre-generated via `generateStaticParams()`
- `setRequestLocale()` must be called in each locale layout for static rendering

### shadcn/ui Uses @base-ui/react
- Not Radix UI — this project uses `@base-ui/react` as the headless primitive library for shadcn components
- Sheet, Dialog, Tooltip, etc. import from `@base-ui/react` — check component source before modifying

### CSS / Theming
- **Tailwind CSS v4** with `@theme inline` for design tokens (OKLCH color space)
- Dark mode: `.dark` class on `<html>`, toggled by `next-themes`
- Custom utilities: `.glass` (backdrop-blur), `.gradient-bg`, `.gradient-text`, `.noise`
- Fonts: DM Sans (body), Crimson Pro (headings), JetBrains Mono (code)
- Animations: `animate-fade-in`, `animate-slide-up`, `animate-scale-in` + stagger delays

### Content Management
- Blog posts: `content/posts/{locale}/*.md` — frontmatter fields: title, description, coverImage, date, tags, category, slug, published
- Work/Project entries: `content/experience/{work|projects}/{locale}/*.md`
- Skills: `content/experience/skills/{locale}.json`
- Profile: `content/config/profile.json`

### ui-ux-pro-max Skill
- Installed at `.claude/skills/ui-ux-pro-max/`
- **Correct shell command:**
  ```bash
  python .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system -p "Name"
  ```
- **Common mistake:** Using `skills/ui-ux-pro-max/scripts/search.py` (missing `.claude/` prefix) — fails with "No such file or directory"
- The skill's base directory is `.claude/skills/ui-ux-pro-max/`, not `skills/ui-ux-pro-max/`
