"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeft, Calendar, Clock, User, Tag } from "lucide-react";
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
    <article className="container mx-auto px-4 py-12 space-y-8">
      {/* Back Button */}
      <Link href={`/${locale}/blog`} className="animate-fade-in">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t("prevPost")}
        </Button>
      </Link>

      {/* Header */}
      <header className="space-y-4 animate-slide-up stagger-1">
        {post.coverImage && (
          <div className="aspect-video overflow-hidden rounded-lg">
            <img
              src={post.coverImage}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <h1 className="font-heading text-4xl md:text-5xl font-bold">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(post.date).toLocaleDateString(locale)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{t("readingTime", { time: post.readingTime })}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{post.author}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </header>

      <Separator className="animate-fade-in stagger-2" />

      {/* Content */}
      <div className="prose prose-lg max-w-none animate-slide-up stagger-2">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>

      <Separator className="animate-fade-in stagger-3" />

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="space-y-4 animate-slide-up stagger-3">
          <h2 className="font-heading text-2xl font-bold">{t("relatedPosts")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <BlogCard key={relatedPost.slug} post={relatedPost} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}