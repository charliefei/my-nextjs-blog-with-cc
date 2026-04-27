"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeft, Calendar, Clock, User, Tag, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BlogCard } from "@/components/blog/blog-card";
import { TableOfContents } from "@/components/blog/toc";
import { Post, PostMeta } from "@/types/post";
import { MarkdownRenderer } from "@/lib/markdown";
import { extractToc } from "@/lib/toc";

interface BlogContentProps {
  post: Post;
  relatedPosts: PostMeta[];
  locale: string;
}

export function BlogContent({ post, relatedPosts, locale }: BlogContentProps) {
  const t = useTranslations("blog");
  const tocItems = extractToc(post.content);

  return (
    <article className="min-h-screen">
      {/* Hero Section with Cover */}
      <header className="relative">
        {post.coverImage ? (
          // With Cover Image
          <div className="relative h-[50vh] min-h-[400px] max-h-[600px] overflow-hidden">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${post.coverImage})` }}
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex items-end">
              <div className="container mx-auto px-6 lg:px-8 pb-12 pt-20 max-w-5xl">
                <div className="space-y-6 animate-slide-up">
                  {/* Back Button */}
                  <Link href={`/${locale}/blog`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {t("prevPost")}
                    </Button>
                  </Link>

                  {/* Category Badge */}
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className="bg-primary/20 text-primary border-primary/30 backdrop-blur-sm gap-1.5 px-3 py-1"
                    >
                      <FolderOpen className="h-3 w-3" />
                      {post.category}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h1 className="font-heading text-lg md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg leading-tight">
                    {post.title}
                  </h1>

                  {/* Description */}
                  <p className="text-sm md:text-lg text-white/80 max-w-2xl leading-relaxed">
                    {post.description}
                  </p>

                  {/* Meta Info Row */}
                  <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(post.date).toLocaleDateString(locale, {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{t("readingTime", { time: post.readingTime })}</span>
                    </div>
                  </div>

                  {/* Tags Row - Editorial style */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="tag-item backdrop-blur-sm bg-white/10 border-white/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Without Cover Image - Clean Header
          <div className="relative bg-gradient-to-b from-muted to-background">
            <div className="container mx-auto px-6 lg:px-8 py-12 max-w-5xl space-y-6 animate-fade-in">
              {/* Back Button */}
              <Link href={`/${locale}/blog`}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  {t("prevPost")}
                </Button>
              </Link>

              {/* Category Badge */}
              <Badge className="gap-1.5 px-3 py-1">
                <FolderOpen className="h-3 w-3" />
                {post.category}
              </Badge>

              {/* Title */}
              <h1 className="font-heading text-xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                {post.title}
              </h1>

              {/* Description */}
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                {post.description}
              </p>

              {/* Meta Info Row */}
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{new Date(post.date).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{t("readingTime", { time: post.readingTime })}</span>
                </div>
              </div>

              {/* Tags Row */}
              <div className="flex flex-wrap gap-2 pt-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag-item">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Article Content - Two Column Layout */}
      <div className="container mx-auto px-6 lg:px-8 py-8 lg:py-12 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Main Content - order-2 on mobile, order-1 on desktop */}
          <div className="flex-1 min-w-0 order-2 lg:order-1 w-full max-w-full">
            {/* Content with enhanced markdown rendering */}
            <div className="prose dark:prose-invert animate-slide-up w-full max-w-full overflow-x-hidden">
              <MarkdownRenderer content={post.content} />
            </div>

            {/* Tags Section - Editorial style */}
            <div className="mt-12 pt-8 border-t border-border/30">
              <div className="tag-section-header mb-4">
                <Tag className="h-4 w-4" />
                <span>文章标签</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/${locale}/blog?tag=${tag}`}
                    className="tag-item cursor-pointer"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Category Link */}
            <div className="mt-6 flex items-center gap-3">
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
              <Link
                href={`/${locale}/blog?category=${post.category}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
              >
                查看更多 {post.category} 分类文章
              </Link>
            </div>

            <Separator className="my-10" />

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <section className="space-y-6 animate-slide-up">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl font-semibold">{t("relatedPosts")}</h2>
                  <Link
                    href={`/${locale}/blog`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    浏览全部
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {relatedPosts.map((relatedPost) => (
                    <BlogCard key={relatedPost.slug} post={relatedPost} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* TOC Sidebar - order-1 on mobile (above content), order-2 on desktop (right side) */}
          {tocItems.length > 0 && (
            <aside className="w-full lg:w-56 shrink-0 lg:sticky lg:top-20 lg:self-start order-1 lg:order-2">
              <TableOfContents items={tocItems} />
            </aside>
          )}
        </div>
      </div>
    </article>
  );
}