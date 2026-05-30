# Bug 修复报告：客户端导航博客文章时报错 `enqueueModel is not a function`

- **日期**：2026-05-31
- **影响范围**：GitHub Pages 线上站点（user site, `charliefei.github.io`）
- **严重程度**：高 —— 点击任意博客文章卡片进行客户端导航时控制台报错，RSC 数据流解析中断
- **修复文件**：`lib/posts.ts`（2 处）
- **状态**：已修复并通过真实浏览器验证

---

## 一、现象

在 GitHub Pages 线上站点，从博客列表页点击任意一篇文章卡片（客户端软导航）时，浏览器控制台抛出：

```
Uncaught TypeError: t.reason.enqueueModel is not a function
    at I (0174xh3wfsjm1.js:1:7393)
    ...
    at r.createFromFetch
    at action / dispatch (router)
    at onClick
```

关键特征：

- 报错堆栈来自 **React Flight（RSC）客户端反序列化器**（`createFromFetch` → 路由 `dispatch` → `onClick`）。
- 只在**生产构建**（压缩后的 chunk，如 `0174xh3wfsjm1.js`）出现。
- 只在 **GitHub Pages 线上**复现；本地 `npm run dev` 和本地 `serve out` 均无法复现。
- 每篇文章稳定复现，并非偶发或缓存抖动。

---

## 二、定位过程

### 1. 锁定报错位置

在 `node_modules/next/dist/compiled/react-server-dom-webpack/.../*-client.browser.development.js`
中搜索 `enqueueModel`，定位到 `resolveModelChunk`：

```js
function resolveModelChunk(response, chunk, value) {
  if ("pending" !== chunk.status) chunk.reason.enqueueModel(value); // ← 报错行
  else { ... }
}
```

`enqueueModel` 只存在于**流式 chunk**（由 `startReadableStream` / `startAsyncIterable` 创建）。
报错意味着：一个 model 行被解析后，尝试 resolve 到一个**状态已非 `pending`、但 `reason` 不是流**的 chunk 上 ——
即 **Flight 数据流在解析过程中发生了错位（desync）**，行 ID 对不上，导致把一行数据塞给了错误的 chunk。

### 2. 复现并抓取真实数据

- 本地 `npm run dev`、`serve out` 点击文章 → **无报错**。
- 在真实线上站点 `https://charliefei.github.io/zh/blog/` 点击文章卡片 → **稳定复现**报错。
- 抓取客户端导航触发的 RSC 请求：全部返回 **200**，文件内容看起来完整正常 —— 排除 404 / 文件缺失。

### 3. 还原 React 的逐行扫描逻辑

阅读 Flight 客户端的行扫描状态机（`processBinaryChunk` 系列，state 0~4）后明确：

- 普通行（如 `I[...]`、`{...}`）以 `\n` 结尾，解析器读到换行为止。
- **文本行 `T` 类型**格式为 `<id>:T<hex>,<内容>`，其中 `<hex>` 是**内容的字节长度**。
  解析器会**精确消费这么多字节**，**不会**在其后跳过换行符。

用与 React 完全一致的逻辑逐字节走博客文章的 RSC payload，发现解析在 **第 11 行（`T` 文本行，正文 Markdown）** 处错位：

```
Row 11 (T, len=6085): 期望在 offset 13681 处是行尾，
实际读到字节 0x67 ('g')，上下文："--shiki-light:#6A737D;--shiki-light-font"
```

即：`11:T17c5,` 声明内容长度 `0x17c5 = 6085` 字节，但实际服务端返回的该行内容只有 **5894** 字节，
解析器多读了 **191 字节**，越界冲进了下一行（代码高亮 HTML），之后所有行头全部错位。

### 4. 找到 191 字节差异的来源

```
declared header      : 6085   ← React 在内存里算出的字节长度
线上实际内容字节       : 5894
overshoot（多读）      : 191
```

- 检查源 Markdown：`content/posts/zh/ralph.md` 有 **201 个 CR（`\r`）字节**（CRLF 换行）。
- 检查 git 配置：`core.autocrlf = true`（Windows 默认），无 `.gitattributes`。
- 正文行内 CR 数量正好是 **191** —— 与 overshoot 完全吻合。

### 5. 关键对照实验（解释"为何线上崩、本地不崩"）

对**本地构建产物** `out/zh/blog/ralph/index.txt` 做对照：

| 场景 | row 11 声明长度 | 实际到下一行字节数 | 结果 |
|---|---|---|---|
| 本地构建（保留 CRLF） | 6085 | 6085 | **对齐，不报错** |
| 模拟部署剥离 CRLF→LF | 6085 | 5894（少 191） | **越界 191 字节，崩溃** |

---

## 三、根因

**Flight 文本行的字节长度前缀，与最终服务端返回的字节数不一致，导致 RSC 流解析错位。**

完整链条：

1. Markdown 源文件是 **CRLF 换行**（`git core.autocrlf=true`，Windows 检出时自动转 CRLF）。
2. Next.js 用内存中**带 `\r\n`** 的字符串序列化 RSC，算出 `T` 行字节长度前缀（例：6085）。
3. 部署到 GitHub Pages 时，`\r` 字节被剥离（CRLF→LF 归一化），该行实际只剩 5894 字节。
4. React 客户端仍按前缀 6085 精确读取，**多读 191 字节**（= 被剥离的 CR 数）。
5. 解析器越界进入下一行，后续每一行行头全部错位，最终把一个 model 行 resolve 到非流 chunk 上
   → 抛出 `chunk.reason.enqueueModel is not a function`。

> 之所以本地无法复现：本地 `out/` 文件**保留了 CRLF**，字节数恰好与前缀对齐（6085==6085）；
> 只有线上剥离 `\r` 后才会出现 191 字节的偏差。

---

## 四、修复方案

在 Markdown 读取路径将换行归一化为 LF，使字节长度前缀**从一开始就按 LF-only 内容计算**，
与线上最终服务的字节完全一致。

文件：`lib/posts.ts`，`getAllPosts` 与 `getPostBySlug` 两处读取：

```diff
- const fileContents = fs.readFileSync(fullPath, "utf8");
+ const fileContents = fs.readFileSync(fullPath, "utf8").replace(/\r\n/g, "\n");
```

修复点选择理由：这是博客文章正文的**唯一**读取入口，在此归一化可一次性覆盖列表页与详情页两条数据流，
不依赖部署流水线是否剥离 CRLF。

---

## 五、验证

### 构建产物字节核对

重新构建后，对所有文章 `index.txt` 用 React 一致的逻辑逐字节核对：

- 所有文件 **CR 字节数 = 0**。
- "构建产物"与"模拟部署剥离 CRLF 后"**字节完全一致** —— 部署时的 CRLF 剥离已变成空操作，不再产生偏差。

### 真实浏览器验证（`serve out` + Chrome 客户端导航）

| 测试路径 | 结果 |
|---|---|
| zh 列表页 → 点击 Ralph 文章（原报错路径） | ✅ 无报错，正文/代码高亮/目录正常 |
| 文章间跳转（→ nextjs-15-guide，声明长度最大 9538） | ✅ 无报错 |
| en 列表页 → 点击 Ralph 文章（en 行 ID 18，声明 6017） | ✅ 无报错（仅字体预加载的良性 warning） |

### 类型/构建门禁

```
npm run build:only  →  exit 0
```

---

## 六、后续建议（可选，非本次必需）

为从源头杜绝换行不一致，建议新增 `.gitattributes`：

```
*.md text eol=lf
```

这样无论开发者本地 `core.autocrlf` 如何配置，Markdown 在仓库与检出时均保持 LF，
与本次的读取归一化形成双重保险。

---

## 七、涉及文件

- 修改：`lib/posts.ts`（2 处，CRLF→LF 归一化）
- 报告：`docs/bugfix-rsc-enqueueModel.md`（本文件）
