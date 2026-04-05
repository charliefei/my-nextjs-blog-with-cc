import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post, PostMeta, PostFrontmatter } from "@/types/post";

const postsDirectory = path.join(process.cwd(), "content/posts");

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.ceil(words / wordsPerMinute);
}

export function getAllPosts(locale: string): PostMeta[] {
  const localePostsDirectory = path.join(postsDirectory, locale);

  if (!fs.existsSync(localePostsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(localePostsDirectory);

  const posts = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(localePostsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      const frontmatter = data as PostFrontmatter;

      return {
        ...frontmatter,
        slug,
        readingTime: calculateReadingTime(content),
      };
    })
    .filter((post) => post.published !== false)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getPostBySlug(slug: string, locale: string): Post | null {
  const localePostsDirectory = path.join(postsDirectory, locale);

  try {
    const fullPath = path.join(localePostsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const frontmatter = data as PostFrontmatter;

    return {
      ...frontmatter,
      slug,
      content,
      readingTime: calculateReadingTime(content),
    };
  } catch {
    return null;
  }
}

export function getAllTags(locale: string): string[] {
  const posts = getAllPosts(locale);
  const tags = posts.flatMap((post) => post.tags);
  return [...new Set(tags)].sort();
}

export function getAllCategories(locale: string): string[] {
  const posts = getAllPosts(locale);
  const categories = posts.map((post) => post.category);
  return [...new Set(categories)].sort();
}

export function getPostsByTag(tag: string, locale: string): PostMeta[] {
  const posts = getAllPosts(locale);
  return posts.filter((post) => post.tags.includes(tag));
}

export function getPostsByCategory(category: string, locale: string): PostMeta[] {
  const posts = getAllPosts(locale);
  return posts.filter((post) => post.category === category);
}

export function getRelatedPosts(
  currentSlug: string,
  locale: string,
  limit = 3
): PostMeta[] {
  const currentPost = getPostBySlug(currentSlug, locale);
  if (!currentPost) return [];

  const allPosts = getAllPosts(locale);

  const related = allPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      const tagOverlap = post.tags.filter((tag) =>
        currentPost.tags.includes(tag)
      ).length;
      const sameCategory = post.category === currentPost.category ? 1 : 0;
      return {
        ...post,
        relevanceScore: tagOverlap * 2 + sameCategory,
      };
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);

  return related.map(({ relevanceScore, ...post }) => post as PostMeta);
}