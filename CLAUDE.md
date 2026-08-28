<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project: Charlie Fei's Blog

Personal blog built with Next.js 16.2.2, Tailwind CSS v4, shadcn/ui (@base-ui/react), and next-intl. Static export to GitHub Pages.

**Requires:** Node.js v22+

## Commands

```bash
npm run dev           # Dev server at localhost:3000
npm run build         # next build → fix-seo-html → flatten-rsc-paths (writes to ./out)
npm run build:only    # Next.js build only (no post-processing)
npm run lint          # ESLint
npm run compress      # Optimize blog images (lossy WebP + AVIF)
npm run start         # Serve static export (not used in dev)
```

**GitHub Pages deploy:** Push to `main` → `.github/workflows/deploy.yml.bak` builds with `DEPLOY_TARGET=project` and deploys to project site (currently disabled/backed up). User site (`charliefei.github.io`): build without the env var and push `out/` directly.

**Docker deploy:** `docker compose -f docker/docker-compose.yml up -d` (nginx serving the static export).

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
  globals.css                  # Tailwind v4 ENTRY ONLY: font/vendor imports, @custom-variant, @theme, :root/.dark tokens, and @imports of all partials
  styles/                      # Shared CSS partials (@import-ed by globals.css, one Tailwind unit): base.css, utilities.css, prose.css, animations.css
  llms.txt/route.ts            # LLMs.txt generation (force-static GET)
  llms-full.txt/route.ts       # LLMs full text generation (force-static GET)
  rss.xml/route.ts             # RSS feed, default locale (force-static GET)
  [locale]/rss.xml/route.ts    # Per-locale RSS feed (force-static + generateStaticParams)

components/
  layout/                      # Header, Footer, LanguageSwitcher
  ui/                          # shadcn components (uses @base-ui/react, not Radix)
  blog/, home/, about/, ...    # Feature-specific components
  comments/                    # Giscus comments (GiscusComments)
  icons/                       # Icon components (social-icons.tsx)
  resume/                      # Resume page components (resume-content.tsx)
  theme/                       # next-themes ThemeProvider + ThemeToggle
  # Component-specific CSS lives next to its component as <name>.css
  # (layout/header.css, blog/toc.css, blog/reading-progress.css,
  #  about/tilt-avatar.css, theme/theme-transition.css) — all are
  # @import-ed by app/globals.css, NEVER JS-imported from the .tsx

content/
  config/profile.json          # Personal info, social links, resume PDF
  posts/{en,zh}/*.md           # Blog posts (gray-matter frontmatter)
  experience/
    work/{en,zh}/*.md          # Work experience entries
    projects/{en,zh}/*.md      # Project entries
    skills/{en,zh}.json        # Skill categories

lib/                           # Data access + utilities
  posts.ts                     # getAllPosts, getPostBySlug, getRelatedPosts
  highlight.ts                 # Build-time Shiki pipeline (called from blog post page)
  rss.ts                       # generateRssFeed() for /rss.xml route
  seo.ts                       # JSON-LD, breadcrumb, metadata helpers
  site.ts                      # getSiteUrl / getAbsoluteUrl (used by RSS + SEO)
  links.ts                     # Internal/external link helpers
  about.ts                     # getAbout / about-page data
  experience.ts                # getAllWorkExperiences, getAllProjects, getSkills
  profile.ts                   # getProfile, getPdfUrl
  toc.ts                       # Table of contents extraction
  markdown.tsx                 # Client react-markdown renderer (synchronous; consumes highlightedCode map)
  utils.ts                     # cn() + getAssetPath()
  llms.ts                      # LLMs.txt content generation

i18n/                          # next-intl config (routing.ts, request.ts)
messages/                      # Translation JSON (en.json, zh.json)

scripts/
  fix-seo-html.mjs            # Post-build: locale-specific HTML lang fix (static export can't derive per-locale)
  flatten-rsc-paths.mjs        # Post-build: fixes RSC server-reference paths for static export
  compress-images.mjs          # Lossy image compression (WebP + AVIF)
  compress-config.json         # compress-images config

.github/workflows/
  deploy.yml.bak               # GitHub Pages CI (currently disabled)

docker/                         # Docker deployment (Dockerfile, docker-compose.yml, nginx.conf)
```

## Key Patterns & Gotchas

### basePath / GitHub Pages
- `next.config.ts`: `output: "export"`, `trailingSlash: true`
- Two deploy modes controlled by `DEPLOY_TARGET` env var:
  - **User site** (default): `charliefei.github.io` — no basePath, assets from `/`
  - **Project site** (`DEPLOY_TARGET=project`): `charliefei.github.io/my-nextjs-blog-with-cc` — basePath/assetPrefix = `/my-nextjs-blog-with-cc`
- `NEXT_PUBLIC_BASE_PATH` is `""` for user site, `/<repoName>` for project site (used in `getAssetPath()`)
- **Use `getAssetPath(path)` for all static asset URLs** (images, PDFs in `<img>`, `<iframe>`, native `<a>`)
- **Do NOT use `getAssetPath()` inside Next.js `<Link>` components** — they auto-prefix basePath, and double-prefixing breaks links
- **PDF links:** native `<a>` tag (not `<Link>`) for PDF downloads — `<Link>` intercepts and double-prefixes; `<iframe>`/`<object>` for PDF preview need `getAssetPath()` manually

### Static Export Constraints
- `output: "export"` means: no SSR, no middleware, no API routes, no `next/image` optimization
- All i18n routes must be pre-generated via `generateStaticParams()`
- `setRequestLocale()` must be called in each locale layout for static rendering
- Static GET route handlers (RSS, LLMs.txt) use `export const dynamic = "force-static"` and return `new Response(...)` — no JSX, no i18n wrappers
- **`serve out` / local static serving keeps CRLF, so it CANNOT reproduce GitHub-Pages-only RSC byte-desync bugs** — Pages strips `\r`. To debug a prod-only Flight crash: fetch the `.txt` RSC payload and walk it like React's row scanner (states 0–4 in `react-server-dom-webpack-client.browser.development.js`); `T<hex>,` rows consume exactly `<hex>` bytes with NO trailing-newline skip.

### shadcn/ui Uses @base-ui/react
- Not Radix UI — this project uses `@base-ui/react` as the headless primitive library for shadcn components
- Sheet, Dialog, Tooltip, etc. import from `@base-ui/react` — check component source before modifying

### CSS / Theming
- **Tailwind CSS v4** with `@theme inline` for design tokens (OKLCH color space)
- Dark mode: `.dark` class on `<html>`, toggled by `next-themes`
- **Stylesheet organization (split Aug 2026):** `app/globals.css` is the ENTRY ONLY — it holds the Google Fonts `@import url(...)` (must stay line 1), `@import "tailwindcss"/"tw-animate-css"/"shadcn/tailwind.css"`, `@custom-variant`, `@theme inline`, and the `:root`/`.dark` token blocks. Everything else lives in partials that `globals.css` pulls in via plain CSS `@import`:
  - `app/styles/` — cross-page shared: `base.css` (element defaults, scrollbars, `.scrollbar-thin`), `utilities.css` (`.gradient-bg`, `.gradient-text`, `.noise`, `.tag-item`, `.gradient-divider`), `prose.css` (`.prose`/`.prose-compact`, code blocks, Shiki dual-theme selectors, tables, blockquotes, heading anchors), `animations.css` (entrance fades, tab slides, `.dev-card-border`, stagger delays)
  - Component-colocated: `components/layout/header.css` (`.glass-float`/`.shadow-float`/`.brand-ring`/`.header-top`), `components/blog/toc.css`, `components/blog/reading-progress.css` (progress bar + back-to-top), `components/about/tilt-avatar.css`, `components/theme/theme-transition.css`
  - Tailwind inlines the whole `@import` graph into ONE compilation unit before Next sees it — `@apply`, theme tokens, `@property` all work across files, and output cascade order follows the `@import` order in `globals.css`. **To add styles: create the partial and add an `@import` line to `globals.css` in the right cascade position. Do NOT JS-`import "./x.css"` from a `.tsx`** — that is a separate Tailwind unit where `@apply bg-background`/`font-heading`/etc. fail the production build (`Cannot apply unknown utility class`; needs `@reference`) and Next's cssChunking may reorder chunks.
  - Ordering notes: `.prose-compact` rules must stay after the `.prose` rules inside `prose.css` (project cards carry both classes); custom-property blocks (`:root`/`.dark`, including `--code-bg/--code-text` in `prose.css`) are runtime-resolved and order-independent.
- Fonts: DM Sans (body), Crimson Pro (headings), JetBrains Mono (code)
- Animations: `animate-fade-in`, `animate-slide-up`, `animate-tab-left/right`, `animate-avatar-tap` + `stagger-1/2` delays (dead classes `.glass`/`animate-scale-in`/`animate-caret`/`stagger-3-5` were removed in the split)
- **Horizontal-scroll protection uses `overflow-x: clip` on `<body>`, NOT `overflow-x: hidden`.**
  `hidden` creates a scroll container, which silently breaks `position: sticky` on `<header>` (Header scrolls off-screen with the page). `clip` has the same clipping effect but does NOT establish a scroll container, so sticky keeps working. Supported in Chrome 90+ / Firefox 81+ / Safari 16+ — well within this project's browser target. **Never put `overflow: hidden` on `<html>` or on any ancestor of a `position: sticky` element.**
- **Mobile-narrow-viewport regression baseline:** Chrome devtools iPhone SE emulation (320×568). Tailwind's `sm:` is 640px, which is much wider than real "small phones" (iPhone SE gen 1, older Android) — always visually test header / flex containers at 320px, not just 375px.
- **Header flex items use `shrink-0` on both sides** (brand + actions). If the combined natural width exceeds the container at 320px, items WILL overflow (they can't shrink, only the container can grow). When adding new icon buttons to `components/layout/header.tsx`'s actions area, measure at 320px first or plan to hide on `< sm:`.

### Code Syntax Highlighting (build-time)
- Renderer is `lib/markdown.tsx` (client, react-markdown) — renders synchronously, so it CANNOT run Shiki
- `rehype-pretty-code` (Shiki, async) runs at BUILD time in `lib/highlight.ts`, called from `app/[locale]/blog/[slug]/page.tsx`
- Flow: page.tsx awaits `highlightCodeBlocks()` → map keyed by trimmed source → passed as `highlightedCode` prop → `CodeBlock` injects HTML via `dangerouslySetInnerHTML`, else plain fallback
- **`grid: true` is mandatory** in highlight options — `grid: false` causes DOUBLE line spacing (newline text nodes render as extra lines under `white-space: pre`)
- Dual-theme: spans carry `--shiki-light`/`--shiki-dark` vars; globals.css maps them to `color` via `.dark` class (NOT prefers-color-scheme)
- Missing fence lang → defaults to `plaintext` (Shiki `defaultLang` + renderer fallback must agree)

### Linting
- `npm run lint` has 6 PRE-EXISTING `react-hooks/refs` errors in `components/blog/toc.tsx` (present on clean HEAD) — not yours
- `npm run build:only` is the real correctness gate (TypeScript passes independently of those lint errors)

### Content Management
- Blog posts: `content/posts/{locale}/*.md` — frontmatter fields: title, description, coverImage, date, tags, category, slug, published
- **Markdown MUST be read with CRLF→LF normalization** — `lib/posts.ts` does `.readFileSync(...).replace(/\r\n/g, "\n")`. RSC Flight text-rows (`<id>:T<hexBYTElen>,...`) declare an exact byte length; GitHub Pages strips CRLF→LF on deploy, so CRLF source makes served bytes shorter than the header → Flight parser desyncs → client-nav crash `enqueueModel is not a function`. `.gitattributes` (`eol=lf`) enforces LF at checkout as a second layer. Any new markdown read path must normalize too.
- Work/Project entries: `content/experience/{work|projects}/{locale}/*.md`
- Skills: `content/experience/skills/{locale}.json`
- Profile: `content/config/profile.json`

### Internationalization (i18n)
- All user-facing text MUST use `useTranslations()` from `next-intl` — never hardcode Chinese or English strings
- Translation files: `messages/en.json` and `messages/zh.json` — keep both in sync when adding keys
- Namespace per feature: `nav`, `home`, `blog`, `about`, `resume`, `experience`, `footer`, `theme`, `lang`, `notFound`
- `t()` supports interpolation: `t("key", { count: n, name: "..." })`
- Watch for easily-missed hardcoded strings: stat counters (`{n} 技能`), filter labels, sr-only text, empty state messages, badge text

### RSC Crash Postmortem
- Full write-up of the `enqueueModel is not a function` client-nav crash lives at [`docs/bugfix-rsc-enqueueModel.md`](docs/bugfix-rsc-enqueueModel.md). Read it before touching markdown read paths or the build pipeline.

### Mobile Horizontal-Scroll / Sticky Postmortem
- Full write-up of the "horizontal scrollbar on mobile in production + `overflow-x: hidden` breaking sticky" bug lives at [`docs/bugfix-mobile-horizontal-scroll.md`](docs/bugfix-mobile-horizontal-scroll.md). Read it before:
  - Touching `app/globals.css`'s `html` / `body` overflow rules
  - Adding new icon buttons to the Header's actions area
  - Changing any `shrink-0` flex children at the top of the page tree
- The TL;DR (full reasoning in the doc):
  1. `overflow: hidden` creates a scroll container → silently breaks `position: sticky` (Header scrolls off-screen)
  2. Use `overflow: clip` instead — same clipping, no scroll container
  3. The original "dev didn't show it, prod did" was almost certainly a viewport-width difference (dev at 375px, prod on real 320px device) — same code, different overflow outcome
  4. Always test header / sticky layouts at 320×568, not just 375×667

### AGENTS.md Mirror
- `AGENTS.md` is a verbatim copy of this file (some agent tools look for it). Update both together, or `cp CLAUDE.md AGENTS.md` after edits.
