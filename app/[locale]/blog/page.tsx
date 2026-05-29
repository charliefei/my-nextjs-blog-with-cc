import { setRequestLocale } from "next-intl/server";
import { getAllPosts, getAllTags, getAllCategories } from "@/lib/posts";
import { BlogList } from "@/components/blog/blog-list";
import type { Metadata } from "next";

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: locale === "zh" ? "博客" : "Blog",
    description:
      locale === "zh"
        ? "技术文章、教程与思考。探索前端开发、设计模式与工程实践。"
        : "Technical articles, tutorials, and thoughts. Exploring frontend development, design patterns, and engineering practices.",
    openGraph: {
      title: locale === "zh" ? "博客 | Charlie's Personal Blog" : "Blog | Charlie's Personal Blog",
      description:
        locale === "zh"
          ? "技术文章、教程与思考。"
          : "Technical articles, tutorials, and thoughts.",
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      siteName: "Charlie's Personal Blog",
    },
    alternates: {
      canonical: `/${locale}/blog/`,
      languages: {
        en: "/en/blog/",
        zh: "/zh/blog/",
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const posts = getAllPosts(locale);
  const tags = getAllTags(locale);
  const categories = getAllCategories(locale);

  return <BlogList posts={posts} tags={tags} categories={categories} />;
}
