const DEFAULT_SITE_URL = "http://localhost:3000";

export function getSiteOrigin(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
  return siteUrl.replace(/\/+$/, "");
}

export function getBasePath(): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return basePath.replace(/\/+$/, "");
}

export function getSiteUrl(path = "/"): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteOrigin()}${getBasePath()}${normalizedPath}`;
}

export function getAbsoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  const normalizedPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  const basePath = getBasePath();

  if (
    basePath &&
    (normalizedPath === basePath || normalizedPath.startsWith(`${basePath}/`))
  ) {
    return `${getSiteOrigin()}${normalizedPath}`;
  }

  return `${getSiteOrigin()}${basePath}${normalizedPath}`;
}
