import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getPostBySlug, getRelatedPosts, getAllPosts } from "@/lib/posts";
import { highlightCodeBlocks } from "@/lib/highlight";
import { getProfile } from "@/lib/profile";
import { BlogContent } from "@/components/blog/blog-content";
import { routing } from "@/i18n/routing";
import { getAbsoluteUrl, getSiteUrl } from "@/lib/site";
import {
  buildPageMetadata,
  getBreadcrumbJsonLd,
  getLocaleConfig,
  getLocalizedPath,
  getPersonJsonLd,
  serializeJsonLd,
  type Locale,
} from "@/lib/seo";
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

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale);

  if (!post) return {};

  const title = post.title;
  const description = post.description;
  const publishedTime = new Date(post.date).toISOString();
  const imageUrl = post.coverImage ? getAbsoluteUrl(post.coverImage) : undefined;
  const path = `/blog/${slug}/`;
  const canonical = getSiteUrl(getLocalizedPath(locale as Locale, path));
  const config = getLocaleConfig(locale);

  const alternateLanguages: Record<string, string> = {};
  routing.locales.forEach((altLocale) => {
    const altPost = getPostBySlug(slug, altLocale);
    if (altPost) {
      const key = altLocale === "zh" ? "zh-CN" : "en-US";
      alternateLanguages[key] = getSiteUrl(
        getLocalizedPath(altLocale as Locale, path)
      );
    }
  });

  if (alternateLanguages["en-US"]) {
    alternateLanguages["x-default"] = alternateLanguages["en-US"];
  }

  const metadata = buildPageMetadata({
    locale: locale as Locale,
    path,
    title,
    description,
    ...(post.coverImage ? { image: post.coverImage } : {}),
    type: "article",
  });

  return {
    ...metadata,
    authors: [{ name: post.author, url: getSiteUrl("/") }],
    category: post.category,
    keywords: [...config.keywords, post.category, ...post.tags],
    openGraph: {
      ...metadata.openGraph,
      title,
      description,
      type: "article",
      publishedTime,
      authors: [post.author],
      tags: post.tags,
      url: canonical,
      ...(imageUrl
        ? { images: [{ url: imageUrl, width: 1200, height: 630, alt: title }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
    alternates: {
      canonical,
      ...(Object.keys(alternateLanguages).length > 0
        ? { languages: alternateLanguages }
        : {}),
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
  const highlightedCode = await highlightCodeBlocks(post.content);
  const profile = getProfile();
  const publishedTime = new Date(post.date).toISOString();
  const typedLocale = locale as Locale;
  const articlePath = `/blog/${slug}/`;
  const articleUrl = getSiteUrl(getLocalizedPath(typedLocale, articlePath));
  const blogUrl = getSiteUrl(getLocalizedPath(typedLocale, "/blog/"));
  const homeUrl = getSiteUrl(getLocalizedPath(typedLocale, "/"));
  const imageUrl = post.coverImage ? getAbsoluteUrl(post.coverImage) : undefined;
  const tNav = await getTranslations({ locale, namespace: "nav" });

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${articleUrl}#article`,
    headline: post.title,
    description: post.description,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    ...(imageUrl ? { image: [imageUrl] } : {}),
    datePublished: publishedTime,
    dateModified: publishedTime,
    author: {
      "@id": getSiteUrl("/#person"),
    },
    publisher: getPersonJsonLd(profile),
    articleSection: post.category,
    keywords: post.tags.join(", "),
    url: articleUrl,
    isPartOf: {
      "@id": getSiteUrl("/#website"),
    },
    inLanguage: getLocaleConfig(locale).htmlLang,
  };
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: tNav("home"), url: homeUrl },
    { name: tNav("blog"), url: blogUrl },
    { name: post.title, url: articleUrl },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd([articleJsonLd, breadcrumbJsonLd]),
        }}
      />
      <BlogContent
        post={post}
        relatedPosts={relatedPosts}
        locale={locale}
        highlightedCode={highlightedCode}
        commentsConfig={profile.comments?.giscus}
      />
    </>
  );
}
