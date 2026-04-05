export interface TocItem {
  id: string;      // anchor ID (slug)
  text: string;    // heading text
  level: number;   // 2 for h2, 3 for h3
}

/**
 * Generate a URL-friendly slug from text
 * Supports both English and Chinese characters
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove special characters but keep Chinese, letters, numbers, and hyphens
    .replace(/[^\u4e00-\u9fa5a-z0-9-]/g, '')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Extract table of contents items from markdown content
 * Matches ## (h2) and ### (h3) headings
 */
export function extractToc(content: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = slugify(text);

    items.push({
      id,
      text,
      level,
    });
  }

  return items;
}