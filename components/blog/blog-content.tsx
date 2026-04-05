"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeft, Calendar, Clock, User, Tag, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BlogCard } from "@/components/blog/blog-card";
import { Post, PostMeta } from "@/types/post";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
              <div className="container mx-auto px-4 pb-12 pt-20">
                <div className="max-w-4xl space-y-6 animate-slide-up">
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

                  {/* Category & Tags */}
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge
                      variant="outline"
                      className="bg-primary/20 text-primary border-primary/30 backdrop-blur-sm gap-1"
                    >
                      <FolderOpen className="h-3 w-3" />
                      {post.category}
                    </Badge>
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-white/10 text-white border-white/20 backdrop-blur-sm"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Title */}
                  <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">
                    {post.title}
                  </h1>

                  {/* Description */}
                  <p className="text-lg text-white/80 max-w-2xl">
                    {post.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-6 text-white/70 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.date).toLocaleDateString(locale, {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{t("readingTime", { time: post.readingTime })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Without Cover Image - Clean Header
          <div className="relative bg-gradient-to-b from-muted to-background">
            <div className="container mx-auto px-4 py-12 space-y-6 animate-fade-in">
              {/* Back Button */}
              <Link href={`/${locale}/blog`}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  {t("prevPost")}
                </Button>
              </Link>

              {/* Category & Tags */}
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="gap-1">
                  <FolderOpen className="h-3 w-3" />
                  {post.category}
                </Badge>
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Title */}
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                {post.title}
              </h1>

              {/* Description */}
              <p className="text-xl text-muted-foreground max-w-2xl">
                {post.description}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.date).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{t("readingTime", { time: post.readingTime })}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none animate-slide-up">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Tags Section */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Tag className="h-4 w-4" />
              <span className="text-sm font-medium">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="my-8" />

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="space-y-6 animate-slide-up">
              <h2 className="font-heading text-2xl font-bold">{t("relatedPosts")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard key={relatedPost.slug} post={relatedPost} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}