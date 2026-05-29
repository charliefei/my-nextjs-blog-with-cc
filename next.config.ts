import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repoName = "my-nextjs-blog-with-cc";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: isGitHubPages ? `/${repoName}` : undefined,
  assetPrefix: isGitHubPages ? `/${repoName}/` : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: isGitHubPages ? `/${repoName}` : "",
    NEXT_PUBLIC_SITE_URL: process.env.NODE_ENV === "production"
      ? "https://charliefei.github.io"
      : "http://localhost:3000"
  },
};

export default withNextIntl(nextConfig);