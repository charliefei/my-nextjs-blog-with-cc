export interface PostFrontmatter {
  title: string;
  description: string;
  coverImage?: string;
  date: string;
  tags: string[];
  category: string;
  author: string;
  slug: string;
  published?: boolean;
}

export interface Post extends PostFrontmatter {
  content: string;
  readingTime: number;
}

export interface PostMeta extends PostFrontmatter {
  readingTime: number;
}