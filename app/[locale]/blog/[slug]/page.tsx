import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getPostBySlug, getRelatedPosts, getAllPosts } from "@/lib/posts";
import { BlogContent } from "@/components/blog/blog-content";
import { routing } from "@/i18n/routing";

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];

  routing.locales.forEach((locale) => {
    const posts = getAllPosts(locale);
    posts.forEach((post) => {
      params.push({ locale, slug: post.slug });
    });
  });

  return params;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = getPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug, locale);

  return <BlogContent post={post} relatedPosts={relatedPosts} locale={locale} />;
}