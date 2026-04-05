"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeft, Calendar, Clock, User, Tag, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BlogCard } from "@/components/blog/blog-card";
import { Post, PostMeta } from "@/types/post";
import { MarkdownRenderer } from "@/lib/markdown";

interface BlogContentProps {
  post: Post;
  relatedPosts: PostMeta[];
  locale: string;
}

export function BlogContent({ post, relatedPosts, locale }: BlogContentProps) {
  const t = useTranslations("blog");

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
              <div className="container mx-auto px-4 pb-12 pt-20 max-w-4xl">
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
                  <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg leading-tight">
                    {post.title}
                  </h1>

                  {/* Description */}
                  <p className="text-lg text-white/80 max-w-2xl leading-relaxed">
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
            <div className="container mx-auto px-4 py-12 max-w-4xl space-y-6 animate-fade-in">
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
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                {post.title}
              </h1>

              {/* Description */}
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
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

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Content with enhanced markdown rendering */}
        <div className="prose prose-lg dark:prose-invert max-w-none animate-slide-up">
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
    </article>
  );
}