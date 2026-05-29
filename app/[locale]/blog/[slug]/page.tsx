import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getPostBySlug, getRelatedPosts, getAllPosts } from "@/lib/posts";
import { BlogContent } from "@/components/blog/blog-content";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale);

  if (!post) return {};

  const title = post.title;
  const description = post.description;
  const publishedTime = new Date(post.date).toISOString();
  const imageUrl = post.coverImage
    ? post.coverImage.startsWith("http")
      ? post.coverImage
      : `${siteUrl}${post.coverImage}`
    : undefined;

  const alternateLanguages: Record<string, string> = {};
  routing.locales.forEach((altLocale) => {
    if (altLocale !== locale) {
      const altPost = getPostBySlug(slug, altLocale);
      if (altPost) {
        alternateLanguages[altLocale] = `${siteUrl}/${altLocale}/blog/${slug}/`;
      }
    }
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      authors: [post.author],
      tags: post.tags,
      url: `${siteUrl}/${locale}/blog/${slug}/`,
      ...(imageUrl
        ? { images: [{ url: imageUrl, width: 1200, height: 630, alt: title }] }
        : {}),
      locale: locale === "zh" ? "zh_CN" : "en_US",
      siteName: "Charlie's Personal Blog",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
    alternates: {
      canonical: `/${locale}/blog/${slug}/`,
      ...(Object.keys(alternateLanguages).length > 0
        ? { languages: alternateLanguages }
        : {}),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = getPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug, locale);
  const publishedTime = new Date(post.date).toISOString();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    ...(post.coverImage
      ? {
          image: post.coverImage.startsWith("http")
            ? post.coverImage
            : `${siteUrl}${post.coverImage}`,
        }
      : {}),
    datePublished: publishedTime,
    dateModified: publishedTime,
    author: {
      "@type": "Person",
      name: post.author,
    },
    keywords: post.tags.join(", "),
    url: `${siteUrl}/${locale}/blog/${slug}/`,
    inLanguage: locale === "zh" ? "zh-Hans" : "en-US",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogContent post={post} relatedPosts={relatedPosts} locale={locale} />
    </>
  );
}
