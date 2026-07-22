"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeft, Calendar, Clock, User, Tag, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlogCard } from "@/components/blog/blog-card";
import { MobileToc, DesktopToc } from "@/components/blog/toc";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { GiscusComments } from "@/components/comments/giscus-comments";
import type { GiscusConfig } from "@/types/profile";
import { Post, PostMeta } from "@/types/post";
import { MarkdownRenderer } from "@/lib/markdown";
import { extractToc } from "@/lib/toc";

interface BlogContentProps {
  post: Post;
  relatedPosts: PostMeta[];
  locale: string;
  highlightedCode: Record<string, string>;
  commentsConfig?: GiscusConfig;
}

export function BlogContent({
  post,
  relatedPosts,
  locale,
  highlightedCode,
  commentsConfig,
}: BlogContentProps) {
  const t = useTranslations("blog");
  const tocItems = extractToc(post.content);
  const formattedDate = new Date(post.date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="min-h-screen">
      <ReadingProgress />

      <div className="container mx-auto px-6 lg:px-8 max-w-350">
        {/* Mobile TOC — sticky bar at top */}
        {tocItems.length > 0 && <MobileToc items={tocItems} />}

        <div className="flex items-start gap-10 xl:gap-12">

          {/* ── Left Sidebar: Article Info (desktop only) ── */}
          <aside className="hidden xl:block w-56 shrink-0 sticky top-24 self-start">
            <div className="space-y-5 animate-fade-in">
              <Link href={`/${locale}/blog`}>
                <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {t("prevPost")}
                </Button>
              </Link>

              {post.coverImage && (
                <div className="rounded-lg overflow-hidden border border-border/30">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-auto object-cover"
                    loading="eager"
                  />
                </div>
              )}

              <Badge variant="outline" className="gap-1.5 px-2.5 py-0.5 text-xs">
                <FolderOpen className="h-3 w-3" />
                {post.category}
              </Badge>

              <h1 className="font-heading text-lg font-bold tracking-tight leading-snug">
                {post.title}
              </h1>

              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <User className="h-3 w-3" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  <span>{t("readingTime", { time: post.readingTime })}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag-item text-[0.65rem]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0 w-full max-w-prose mx-auto py-8 lg:py-12">
            {/* Mobile: minimal article info at top */}
            <div className="xl:hidden mb-8 space-y-3 animate-fade-in">
              <Link href={`/${locale}/blog`}>
                <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {t("prevPost")}
                </Button>
              </Link>

              <Badge variant="outline" className="gap-1.5 px-2.5 py-0.5 text-xs">
                <FolderOpen className="h-3 w-3" />
                {post.category}
              </Badge>

              <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                {post.title}
              </h1>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {post.description}
              </p>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground text-xs">
                <div className="flex items-center gap-1.5">
                  <User className="h-3 w-3" />
                  <span>{post.author}</span>
                </div>
                <span className="text-border">·</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  <span>{formattedDate}</span>
                </div>
                <span className="text-border">·</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  <span>{t("readingTime", { time: post.readingTime })}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag-item text-[0.65rem]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Article Body */}
            <div className="prose dark:prose-invert w-full max-w-full overflow-x-hidden">
              <MarkdownRenderer content={post.content} highlightedCode={highlightedCode} />
            </div>

            {/* Article Footer: Tags + Category */}
            <div className="mt-14 pt-8 border-t border-border/30 space-y-6">
              <div className="tag-section-header mb-4">
                <Tag className="h-4 w-4" />
                <span>{t("articleTags")}</span>
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

              <div className="flex items-center gap-3">
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
                <Link
                  href={`/${locale}/blog?category=${post.category}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
                >
                  {t("viewMoreCategory", { category: post.category })}
                </Link>
              </div>
            </div>

            {/* Comments */}
            <div className="gradient-divider my-10" />
            <GiscusComments
              config={commentsConfig}
              locale={locale}
              term={`blog/${post.slug}`}
            />

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <>
                <div className="gradient-divider my-10" />
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-heading text-xl font-semibold">{t("relatedPosts")}</h2>
                    <Link
                      href={`/${locale}/blog`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {t("browseAll")}
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {relatedPosts.map((relatedPost) => (
                      <BlogCard key={relatedPost.slug} post={relatedPost} />
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>

          {/* ── Right Sidebar: Desktop TOC ── */}
          {tocItems.length > 0 && (
            <aside className="hidden lg:block w-60 shrink-0 sticky top-24 self-start">
              <DesktopToc items={tocItems} />
            </aside>
          )}
        </div>
      </div>
    </article>
  );
}
