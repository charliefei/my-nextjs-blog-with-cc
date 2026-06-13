# Bug 修复报告：移动端生产构建出现横向滚动条 + 修复导致 Header sticky 失效

- **日期**：2026-06-13
- **影响范围**：所有移动端访问者（viewport ≤ ~380px 的设备），尤以 320px (iPhone SE 一代 / 旧 Android) 显著
- **严重程度**：
  - 主问题（横向滚动条）— 中：影响所有窄屏移动端用户的浏览体验
  - 次生问题（sticky 失效）— 高：Header 完全脱离视口，导航 / 主题切换 / 语言切换全部不可用
- **修复文件**：`app/globals.css`（1 处）、`components/layout/header.tsx`（2 处）
- **状态**：已修复并在 320 / 375 / 414px 三个视口、首页 + 博客文章页两个页面验证通过

---

## 一、现象

### 主问题

在 `npm run start`（生产静态导出）部署到 GitHub Pages / Docker / `serve out` 后，
用 320px 宽的移动设备（或 Chrome devtools 的 iPhone SE emulation）打开任意页面：

- 视口**底部**或**顶部**出现横向滚动条。
- 整个页面可以左右拖动，背景的 `gradient-bg` 在右侧露出一段空白 / 重复纹理。
- Header 最右侧的「汉堡菜单」按钮被部分裁掉，只露出 ~11/36 px，无法点击。

### 次生问题

按一个直觉修复（给 `<html>` 加 `overflow-x: hidden`）后：

- 横向滚动条确实消失 ✓
- **但** Header 不再 sticky —— 滚动 500px 后 Header 的 `getBoundingClientRect().top` 变成 `-500`，整个 header 跟着页面一起滚走，导航 / 主题切换 / 语言切换 / RSS 入口全部不可用 ✗

### 不在 dev 模式复现的原因（推测）

`npm run dev` 时用户通常在 375px (iPhone 8 / X / 11 / 12 等主流宽度) 视口下测试，
此时 Header 内容总宽 321px 减去两侧 padding 48px = **273px**，在 375 - 48 = 327px 的可用空间内**刚好塞下**（溢出 0），
所以 dev 模式在 375px 下观察不到任何问题。

`npm run start` / 真机部署时，用户在 320px 的窄屏设备上访问，溢出 49px，触发横向滚动。
**dev vs prod 行为差异本质上是视口宽度差异，不是构建产物的 CSS 差异。**

---

## 二、定位过程

### 1. 复现并度量

启动 `npx serve@latest out -l 3000`，用 Chrome devtools emulation 切到 320×568 mobile 视口，
对首页 `/zh/` 跑：

```js
const all = document.querySelectorAll('*');
for (const el of all) {
  const r = el.getBoundingClientRect();
  if (r.right > 320 + 1) {
    /* 记录 r.right, r.width, className, position */
  }
}
```

得到：

| 元素 | className | right | width |
|---|---|---|---|
| 操作区 div | `flex items-center gap-0.5 shrink-0` | 345 | 150 |
| 汉堡菜单按钮 | `md:hidden inline-flex ... h-9 w-9` | 345 | 36 |
| 品牌区链接 | `group flex items-center gap-2.5 shrink-0` | 195 | 171 |

整个页面 `document.documentElement.scrollWidth = 345 > clientWidth = 320`，`canScrollHtml: true` —— 横向滚动条出现的硬证据。

### 2. 锁定溢出根因 = Header 容器

`documentElement` 唯一的横向溢出源头是 Header 的内层 flex div。

测量其内容：

```
Header 内层 div：width 320, padding 24px+24px → 内容区 272px
  ├─ 品牌 (shrink-0):   171px   「Charlie / Blog」+ 32px 环
  └─ 操作 (shrink-0):   150px   语言 + 主题 + RSS + 汉堡
合计 321px > 272px (px-6) → 溢出 49px
```

而 `<body>` 上的 `overflow-x: hidden` 并不能阻止 `<html>` 元素报告 `scrollWidth=345` 并出现滚动条 —— **body 的 hidden 只是把视觉裁剪了，html 的滚动上下文并未被限制**。

### 3. 第一次修复（错误的）

直觉做法：给 `<html>` 也加 `overflow-x: hidden`，强制裁剪整页的横向溢出。

```diff
+ html {
+   @apply font-sans scroll-smooth;
+   overflow-x: hidden;
+ }
```

同时把 Header 自身也调小，避免内容被裁：
- `px-6 lg:px-8` → `px-4 sm:px-6 lg:px-8`（窄屏省 16px）
- `/ Blog` 在窄屏（< sm:）下永远隐藏（之前是 scrolled 时才隐藏）

**这一组合确实消除了横向滚动条**，但 sticky 立刻失效。

### 4. 定位 sticky 失效的根因

跑：

```js
const h = document.querySelector('header');
window.scrollTo(0, 500);
console.log(h.getBoundingClientRect().top);
// → -500   ← header 跟着页面滚走了 500px
```

查 `getComputedStyle(document.documentElement).overflow`：

```
html:  "hidden auto"   ← 已被我设了 overflow-x: hidden
body:  "hidden auto"   ← 项目原本就有
```

**`overflow-x: hidden` 在 CSS 规范里属于「非 visible」值，会让该元素成为滚动容器（scroll container）。**
`position: sticky` 的定位上下文是「最近的滚动容器」；原本 sticky 是以 viewport 为锚点，
现在 sticky 被锁定在 `<html>` 这个滚动容器内，**而 html 在视口里没给自己留出 sticky 生效的"高度"**（`html { height: 100% }` = 100vh，与可视区同高），
于是 sticky 退化成普通 `relative`，header 直接跟着 body 一起滚走。

这是 Chrome / Firefox / Safari 都有记录的已知行为 —— **任何祖先元素上的 `overflow: hidden` 都可能破坏 `position: sticky`**。

### 5. 第二次修复（正确的）

CSS 新值 `overflow-x: clip`：

| 属性 | 视觉效果（裁剪） | 是否创建 BFC | 是否创建滚动容器 | 对 `position: sticky` |
|---|---|:-:|:-:|---|
| `overflow-x: hidden` | ✓ | ✓ | ✓ | 破坏 |
| `overflow-x: clip` | ✓ | ✓ | ✗ | 保持 |

`clip` 与 `hidden` 的裁剪行为完全一致，但**不创建滚动容器**，因此 `position: sticky` 继续以 viewport 为锚点。

支持度：Chrome 90+ / Edge 90+ / Firefox 81+ / Safari 16+（2022-09）。
本项目 `next 16.2.2` 的浏览器目标（`browserslist` 默认 `last 2 versions`）全部覆盖。

---

## 三、根因

**两段独立的根因，叠加产生用户看到的 bug：**

### 根因 A：Header 容器在窄屏下"内容 > 容器"

- 设计上 Header 内层用 `flex justify-between` 容纳「品牌 + 操作」两组元素。
- 两组元素都加了 `shrink-0`，意思是"我不许被压缩"，于是容器只会被撑大、不会缩。
- 在 ≤ ~380px 视口下，两组元素总宽（321px）超过容器可用宽（272px），无解，必然溢出。

**深一层**：这是设计阶段没有真正在 320px 视口下做交互测试导致的疏漏 —— Tailwind 响应式断点默认从 `sm: (640px)` 开始，开发者很容易忽略 `sm:` 之下的"小手机"场景。

### 根因 B：项目对"防横向滚动"的标准做法不成立

- 项目原本只在 `body` 上加 `overflow-x: hidden`。
- 这只能**视觉裁剪** body 内的溢出元素，**并不能阻止 `<html>` 元素本身报告 `scrollWidth > clientWidth` 并出现横向滚动条**。
- 一个直观的兜底（在 html 上加 `overflow-x: hidden`）会破坏 `position: sticky` —— 因为 `hidden` 创建了滚动容器，sticky 的定位上下文被劫持。

---

## 四、修复方案

### 文件 1：`app/globals.css`

把 `<body>` 的 `overflow-x: hidden` 改为 `overflow-x: clip`，**`html` 不加任何 overflow 限制**：

```diff
  body {
    @apply bg-background text-foreground antialiased;
    font-feature-settings: "rlig" 1, "calt" 1;
-   overflow-x: hidden;
+   /* `clip` (not `hidden`) prevents horizontal scroll WITHOUT creating a scroll
+      container — keeping position: sticky on <header> working as intended.
+      `hidden` would establish html/body as scroll containers, which can break
+      sticky on Chrome and absolutely breaks it on mobile Safari. */
+   overflow-x: clip;
  }
  html {
    @apply font-sans scroll-smooth;
-   overflow-x: hidden; /* ... */
  }
```

### 文件 2：`components/layout/header.tsx`

**第 58 行**，内层 div 在非 scrolled 状态下的 padding 收窄，**先解决内容塞不下的问题**：

```diff
- "header-top h-16 max-w-7xl px-6 lg:px-8"
+ "header-top h-16 max-w-7xl px-4 sm:px-6 lg:px-8"
```

**第 90-92 行**，`<span>/ Blog</span>` 的可见性从"scrolled 时才隐藏"改为"小于 sm: 时永远隐藏"，
解决品牌区在窄屏塞不下"Charlie / Blog"完整文字的问题，
也让窄屏下品牌宽度从 171px 缩到 114px，腾出空间给操作区：

```diff
  <span
    className={cn(
-     "ml-1.5 text-muted-foreground font-normal transition-all duration-500",
-     scrolled && "hidden sm:inline"
+     "ml-1.5 text-muted-foreground font-normal transition-all duration-500 hidden sm:inline"
    )}
  >
    / Blog
  </span>
```

### 修复点选择理由

- **`overflow-x: clip` on `<body>`**：裁剪整页所有横向溢出（包括 `position: fixed` / `sticky` 后代），
  又不破坏 sticky。是目前 CSS 规范里唯一同时满足"防横向滚动 + 不破坏 sticky"的方案。
- **Header padding `px-4` on mobile**：让容器本身就有更多可用空间，从源头减少溢出概率。
- **永远隐藏 " / Blog" on < sm:**：消除"非 scrolled 显示、scrolled 隐藏"这种奇怪的视觉跳动（同一视口下，滚动一小段后品牌文字就消失了，违反用户预期）。

---

## 五、验证

### 防横向滚动（三视口 × 两页面）

| 视口 | 页面 | `htmlScroll` | `htmlClient` | `canScrollHtml` |
|---|---|:-:|:-:|:-:|
| 320×568 | `/zh/` | 320 | 320 | false ✓ |
| 375×667 | `/zh/blog/claude-agent-sdk-blog` | 375 | 375 | false ✓ |
| 414×896 | `/zh/blog/claude-agent-sdk-blog` | 414 | 414 | false ✓ |

### Sticky 仍工作

| 视口 | 页面 | `window.scrollY` | `header.getBoundingClientRect().top` | 结果 |
|---|---|:-:|:-:|---|
| 375×667 | `/zh/blog/claude-agent-sdk-blog` | 8333.6 | 0 | sticky ✓ |
| 320×568 | `/zh/` | 345.6 | 0 | sticky ✓ |
| 414×896 | `/zh/blog/claude-agent-sdk-blog` | 620.8 | 0 | sticky ✓ |

### 视觉确认

- 320px 视口：Header 浮窗完整显示 Logo → "Charlie" → Globe → Moon → RSS → 汉堡菜单，
  **无任何图标被裁**。
- 375px 视口：滚动到正文 8333px 深度时，截图显示 Header pill 浮窗 + 阅读进度条依然固定在视口顶部，
  主题/语言/RSS/菜单按钮全部可点击。

### 类型 / 构建门禁

```
npm run build:only  →  exit 0
node scripts/fix-seo-html.mjs   →  10 files fixed
node scripts/flatten-rsc-paths.mjs  →  48 paths flattened
```

---

## 六、经验沉淀（给后续开发者）

1. **永远不要在 `position: sticky` 元素或其祖先上用 `overflow: hidden` 防横向滚动。**
   用 `overflow: clip` 替代。规范、Chrome 90+、Firefox 81+、Safari 16+ 全部支持。

2. **`overflow: hidden` 不等于"防页面横向滚动"。** 它只是把溢出元素视觉裁剪。
   要从源头解决：
   - 在设计阶段对 320px / 360px 这类"小手机"视口做交互测试（不止 iPhone 8 的 375px）。
   - 横向溢出通常来自 `flex` 子项总宽 > 容器 + 子项 `shrink-0`，优先用 `flex-wrap` 或在小屏隐藏非核心元素。

3. **Tailwind 的 `sm:` (640px) 断点不等于"所有移动端"。** 在 640px 之下整整 320px 的范围
   是 iPhone SE 一代 / 旧 Android / 折叠屏小屏的实际视口；设计稿在这一段缺乏覆盖是常见遗漏。

4. **使用 Chrome devtools 的 iPhone SE emulation (320×568) 作为最小支持视口的回归基线。**

---

## 七、涉及文件

- 修改：`app/globals.css`（`body` 的 `overflow-x: hidden` → `overflow-x: clip`；删除 `html` 的 `overflow-x: hidden`）
- 修改：`components/layout/header.tsx`（line 58 padding 收窄；line 90-92 "/ Blog" 永久隐藏于 < sm:）
- 报告：`docs/bugfix-mobile-horizontal-scroll.md`（本文件）
