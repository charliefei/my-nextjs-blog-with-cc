import { setRequestLocale } from "next-intl/server";
import { getAllPosts, getAllTags, getAllCategories } from "@/lib/posts";
import { BlogList } from "@/components/blog/blog-list";

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const posts = getAllPosts(locale);
  const tags = getAllTags(locale);
  const categories = getAllCategories(locale);

  return <BlogList posts={posts} tags={tags} categories={categories} />;
}