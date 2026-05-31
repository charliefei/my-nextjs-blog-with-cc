# Personal Blog

一个现代化的个人博客网站，支持中英文切换、亮暗主题切换、Markdown 文章管理，静态导出到 GitHub Pages。

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)

## 功能特性

- 🌐 **国际化** - 支持中英文切换，基于 next-intl
- 🎨 **主题切换** - 亮色/暗色主题，基于 next-themes
- 📝 **Markdown 博客** - 使用 gray-matter 解析 frontmatter
- 📄 **简历展示** - PDF 简历在线预览和下载
- 💼 **经历展示** - 技能、项目、工作经历时间线
- 🔍 **博客搜索** - 标签和分类筛选
- 📱 **响应式设计** - 适配桌面、平板、手机
- ⚡ **静态导出** - 支持 GitHub Pages 用户站点和项目站点双模式部署

## 技术栈

| 技术 | 用途 |
|------|------|
| Next.js 16 | React 框架，App Router |
| TypeScript | 类型安全 |
| Tailwind CSS 4 | 样式系统 |
| shadcn/ui | UI 组件库 |
| next-intl | 国际化 |
| next-themes | 主题切换 |
| gray-matter | Markdown 解析 |
| lucide-react | 图标库 |

## 目录结构

```
blog_ai/
├── app/                        # Next.js App Router
│   ├── [locale]/              # 国际化路由
│   │   ├── layout.tsx         # 布局组件
│   │   ├── page.tsx           # 首页
│   │   ├── blog/              # 博客页面
│   │   ├── about/             # 关于我
│   │   ├── resume/            # 简历
│   │   └── experience/        # 工作经历
│   ├── layout.tsx             # 根布局
│   └── globals.css            # 全局样式
├── components/                 # React 组件
│   ├── ui/                    # shadcn/ui 组件
│   ├── layout/                # 布局组件
│   ├── blog/                  # 博客组件
│   └── theme/                 # 主题组件
├── content/                    # 内容文件
│   ├── posts/                 # Markdown 文章
│   │   ├── en/               # 英文文章
│   │   └── zh/               # 中文文章
│   ├── resume/                # 简历 PDF
│   └── config/                # 配置文件
│       └── profile.json       # 个人信息
├── i18n/                       # 国际化配置
├── messages/                   # 翻译文件
│   ├── en.json               # 英文翻译
│   └── zh.json               # 中文翻译
├── lib/                        # 工具函数
├── types/                      # TypeScript 类型
└── public/                     # 静态资源
    └── images/                # 图片资源
```

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 pnpm

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
# 用户站点部署（charliefei.github.io）
npm run build

# 项目站点部署（charliefei.github.io/my-nextjs-blog-with-cc）
DEPLOY_TARGET=project npm run build
```

静态文件将生成在 `out/` 目录。

## 配置说明

### 个人信息配置

编辑 `content/config/profile.json`：

```json
{
  "personal": {
    "name": "你的名字",
    "avatar": "/images/avatar.png",
    "profession": "全栈开发工程师",
    "jobStatus": {
      "openToWork": true,
      "availableFor": ["full-time", "freelance"]
    },
    "bio": {
      "en": "Your English bio...",
      "zh": "你的中文简介..."
    },
    "location": "上海，中国",
    "email": "your.email@example.com"
  },
  "social": [
    { "platform": "github", "url": "https://github.com/yourusername" },
    { "platform": "linkedin", "url": "https://linkedin.com/in/yourusername" }
  ],
  "skills": [
    { "name": "React", "level": 90, "category": "Frontend" }
  ],
  "projects": [
    {
      "title": "项目名称",
      "description": "项目描述",
      "technologies": ["React", "Node.js"],
      "github": "https://github.com/...",
      "link": "https://..."
    }
  ],
  "experience": [
    {
      "company": "公司名称",
      "position": "职位",
      "startDate": "2022-03",
      "endDate": "2024-01",
      "description": "工作描述",
      "technologies": ["React", "TypeScript"]
    }
  ],
  "resume": {
    "pdfUrl": "/resume/resume.pdf",
    "lastUpdated": "2024-01"
  }
}
```

### 添加博客文章

在 `content/posts/zh/` 或 `content/posts/en/` 目录下创建 Markdown 文件：

```markdown
---
title: 文章标题
description: 文章简介
coverImage: /images/posts/cover.jpg
date: 2024-01-15
tags: [技术, React]
category: 教程
author: 你的名字
slug: article-slug
published: true
---

文章正文内容...
```

**Frontmatter 字段说明：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | ✅ | 文章标题 |
| description | string | ✅ | 文章简介 |
| date | string | ✅ | 发布日期 (YYYY-MM-DD) |
| tags | string[] | ✅ | 标签列表 |
| category | string | ✅ | 分类 |
| author | string | ✅ | 作者 |
| slug | string | ✅ | URL 路径 |
| coverImage | string | ❌ | 封面图片 |
| published | boolean | ❌ | 是否发布，默认 true |

### 添加简历

将你的简历 PDF 文件放到 `content/resume/resume.pdf`。

### 工作经历/项目/技能管理

Experience 页面通过 Markdown 文件管理，支持中英文。

#### 目录结构

```
content/experience/
├── work/                  # 工作经历
│   ├── en/               # 英文
│   │   └── company-a.md
│   └── zh/               # 中文
│       └── company-a.md
├── projects/              # 项目经历
│   ├── en/
│   └── zh/
└── skills/                # 技能配置
    ├── en.json
    └── zh.json
```

#### 工作经历 Markdown

在 `content/experience/work/{locale}/` 创建 `.md` 文件：

```markdown
---
type: work
company: 公司名称
position: 职位
startDate: 2022-03
endDate:        # 留空表示至今
location: 上海
technologies:
  - React
  - TypeScript
order: 1        # 排序，数字越小越靠前
---

## 概述

工作描述内容，支持 Markdown 格式...

## 主要成就

- 成就1
- 成就2
```

#### 项目经历 Markdown

在 `content/experience/projects/{locale}/` 创建 `.md` 文件：

```markdown
---
type: project
title: 项目名称
description: 项目简介
technologies:
  - React
  - Node.js
github: https://github.com/yourusername/project
link: https://project-demo.com
image: /images/projects/screenshot.png
featured: true   # 是否重点项目
order: 1
---

项目详细描述...
```

#### 技能配置 JSON

在 `content/experience/skills/{locale}.json` 配置：

```json
[
  {
    "category": "前端开发",
    "skills": [
      {
        "name": "React",
        "level": 95,
        "description": "精通 React hooks 和性能优化"
      },
      {
        "name": "TypeScript",
        "level": 90,
        "description": "强类型、泛型和工具类型"
      }
    ]
  }
]
```

### 添加头像和图片

- 头像：`public/images/avatar.png`
- 文章封面：`public/images/posts/`

### 自定义主题颜色

在 `content/config/profile.json` 中配置：

```json
{
  "theme": {
    "primaryColor": "#6366f1",
    "accentColor": "#8b5cf6"
  }
}
```

### Giscus 评论配置

1. 访问 https://giscus.app/zh-CN
2. 输入你的 GitHub 仓库（需开启 Discussions）
3. 获取 `repo-id` 和 `category-id`
4. 配置到 `profile.json`：

```json
{
  "comments": {
    "giscus": {
      "repo": "yourusername/blog-comments",
      "repoId": "your-repo-id",
      "categoryId": "your-category-id",
      "mapping": "pathname"
    }
  }
}
```

---

## 部署指南

### GitHub Pages 部署

支持两种部署模式，通过 `DEPLOY_TARGET` 环境变量切换。

#### 部署模式

| 模式 | 环境变量 | 仓库 | 访问地址 |
|------|----------|------|----------|
| **用户站点** | 不设置（默认） | `charliefei.github.io` | `https://charliefei.github.io/` |
| **项目站点** | `DEPLOY_TARGET=project` | `my-nextjs-blog-with-cc` | `https://charliefei.github.io/my-nextjs-blog-with-cc/` |

- **用户站点**：静态资源从根路径 `/` 提供，无需 basePath
- **项目站点**：静态资源从 `/my-nextjs-blog-with-cc/` 子路径提供，自动添加 basePath 前缀

#### 用户站点部署（charliefei.github.io）

将 `out/` 目录推送到 `charliefei.github.io` 仓库：

```bash
npm run build
cd out
git init
git add .
git commit -m "deploy"
git remote add origin git@github.com:charliefei/charliefei.github.io.git
git push -f origin main
```

#### 项目站点部署（GitHub Actions，推荐）

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        env:
          DEPLOY_TARGET: project
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './out'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

然后在仓库 **Settings** → **Pages** 中，Source 选择 **GitHub Actions**。

#### 自定义域名

1. 在 `public/` 目录创建 `CNAME` 文件，内容为你的域名：
   ```
   blog.yourdomain.com
   ```

2. 在域名服务商处配置 DNS：
   - **A 记录**：指向 GitHub Pages IP
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153
   - 或 **CNAME 记录**：指向 `yourusername.github.io`

#### 注意事项

- GitHub Pages 的 URL 区分大小写
- 静态导出不支持 Next.js 服务端功能（API Routes、ISR 等）
- 如需使用自定义 404 页面，确保 `out/404.html` 存在

### Docker 部署

项目提供了完整的 Docker + Nginx 部署方案，适合部署到 VPS、云服务器或本地 Docker 环境。

#### 文件说明

所有 Docker 相关文件位于 `docker/` 目录：

| 文件 | 说明 |
|------|------|
| `Dockerfile` | 多阶段构建：Node.js 构建 + Nginx 运行 |
| `nginx.conf` | Nginx 配置文件（静态文件服务、缓存、安全头） |
| `docker-compose.yml` | Docker Compose 编排文件 |
| `.dockerignore` | 构建排除文件 |

#### 环境要求

- Docker 20.10+
- Docker Compose 2.0+（可选，也可直接用 `docker build`）

#### 方式一：Docker Compose（推荐）

```bash
# 构建并启动
docker compose -f docker/docker-compose.yml up -d --build

# 查看日志
docker compose -f docker/docker-compose.yml logs -f

# 停止
docker compose -f docker/docker-compose.yml down
```

访问 http://localhost:3000

#### 方式二：Docker 命令

```bash
# 构建镜像
docker build -t blog:latest -f docker/Dockerfile .

# 运行容器
docker run -d --name blog -p 3000:80 --restart unless-stopped blog:latest

# 查看日志
docker logs -f blog

# 停止并删除容器
docker stop blog && docker rm blog
```

#### 自定义端口

修改 `docker/docker-compose.yml` 中的端口映射：

```yaml
ports:
  - "8080:80"    # 将宿主机端口改为 8080
```

或使用命令行参数：

```bash
docker run -d --name blog -p 8080:80 --restart unless-stopped blog:latest
```

#### 使用外部 Nginx 配置

如需在运行时挂载自定义 Nginx 配置，取消 `docker-compose.yml` 中的注释：

```yaml
volumes:
  - ./nginx.conf:/etc/nginx/nginx.conf:ro
```

#### 配合反向代理

如果你使用 Nginx 或 Caddy 作为反向代理，将流量转发到容器的 80 端口即可。

**Nginx 反向代理示例：**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:9090;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Caddy 反向代理示例：**

```caddy
your-domain.com {
    reverse_proxy 127.0.0.1:9090
}
```

---

## 常见问题

### 如何更新博客内容？

1. 修改 `content/posts/` 下的 Markdown 文件
2. 运行 `npm run build` 验证构建
3. 推送代码，GitHub Actions 会自动部署

### 如何添加新的语言？

1. 在 `i18n/routing.ts` 添加新语言：
   ```typescript
   export const routing = defineRouting({
     locales: ['en', 'zh', 'ja'],  // 添加日语
     defaultLocale: 'en'
   })
   ```

2. 创建翻译文件 `messages/ja.json`

3. 创建文章目录 `content/posts/ja/`

### 如何修改样式？

- 全局样式：编辑 `app/globals.css`
- 主题颜色：修改 CSS 变量或 `profile.json` 中的 `theme` 字段
- 组件样式：使用 Tailwind CSS 类名

### 构建失败怎么办？

1. 检查 Node.js 版本（需要 18+）
2. 删除 `node_modules` 和 `.next` 重新安装
3. 检查 Markdown 文件的 frontmatter 格式

---

## 许可证

MIT License

---

## 致谢

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [next-intl](https://next-intl-docs.vercel.app/)