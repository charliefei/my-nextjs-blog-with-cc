import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/*
 * 部署模式（通过 DEPLOY_TARGET 环境变量控制）：
 *
 * - 用户站点（默认）：推送到 charliefei.github.io 仓库
 *   访问地址 https://charliefei.github.io/，无需 basePath
 *   构建命令：npm run build
 *
 * - 项目站点：推送到 my-nextjs-blog-with-cc 仓库
 *   访问地址 https://charliefei.github.io/my-nextjs-blog-with-cc/
 *   需要 basePath 作为资源前缀
 *   构建命令：DEPLOY_TARGET=project npm run build
 */
const isProjectSite = process.env.DEPLOY_TARGET === "project";
const repoName = "my-nextjs-blog-with-cc";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // 仅项目站点需要子路径前缀，用户站点从根路径提供资源
  basePath: isProjectSite ? `/${repoName}` : undefined,
  assetPrefix: isProjectSite ? `/${repoName}/` : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: isProjectSite ? `/${repoName}` : "",
    NEXT_PUBLIC_SITE_URL: process.env.NODE_ENV === "production"
      ? "https://charliefei.github.io"
      : "http://localhost:3000"
  },
};

export default withNextIntl(nextConfig);