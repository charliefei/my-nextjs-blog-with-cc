export interface TocItem {
  id: string;      // anchor ID (slug)
  text: string;    // heading text
  level: number;   // 1-3 for h1-h3
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
 * Matches # (h1) to ### (h3) headings, excluding code blocks
 */
export function extractToc(content: string): TocItem[] {
  // Remove fenced code blocks (``` or ~~~ delimited) to avoid matching # comments inside
  const contentWithoutCodeBlocks = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/~~~[\s\S]*?~~~/g, '');

  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(contentWithoutCodeBlocks)) !== null) {
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