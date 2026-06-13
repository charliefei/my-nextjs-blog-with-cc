import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get asset path with basePath prefix for GitHub Pages deployment.
 *
 * Absolute URLs (http://, https://, protocol-relative //, data:) are returned
 * unchanged — they're already fully qualified and don't need the basePath
 * prefix. This lets config like `avatar` or `coverImage` point at external
 * CDNs / Gravatar / etc. without breaking.
 */
export function getAssetPath(path: string): string {
  // Pass through anything that isn't a same-origin path
  if (/^(https?:|data:|\/\/)/i.test(path)) {
    return path;
  }
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}
