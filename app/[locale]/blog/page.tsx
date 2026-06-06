import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllPosts, getAllTags, getAllCategories } from "@/lib/posts";
import { BlogList } from "@/components/blog/blog-list";
import { buildPageMetadata, type Locale } from "@/lib/seo";
import type { Metadata } from "next";

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.blog" });

  return buildPageMetadata({
    locale: locale as Locale,
    path: "/blog/",
    title: t("title"),
    description: t("description"),
  });
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const posts = getAllPosts(locale);
  const tags = getAllTags(locale);
  const categories = getAllCategories(locale);

  return <BlogList posts={posts} tags={tags} categories={categories} />;
}
