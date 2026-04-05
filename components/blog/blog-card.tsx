"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PostMeta } from "@/types/post";

interface BlogCardProps {
  post: PostMeta;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const locale = useLocale();
  const t = useTranslations("blog");

  if (featured) {
    // Featured card - horizontal layout with larger image
    return (
      <Link href={`/${locale}/blog/${post.slug}`} className="group block">
        <article className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-background to-accent/5 border border-border/50 hover:border-primary/30 transition-all duration-500">
          {post.coverImage ? (
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image Side */}
              <div className="relative aspect-[16/10] md:aspect-auto md:h-full overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background md:bg-gradient-to-l" />
              </div>
              {/* Content Side */}
              <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="default" className="bg-primary/90">
                      {post.category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(post.date).toLocaleDateString(locale, {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </span>
                  </div>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground line-clamp-2 text-base">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {t("readingTime", { time: post.readingTime })}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center text-primary font-medium group-hover:gap-3 transition-all">
                    <span>阅读文章</span>
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 md:p-8 lg:p-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant="default">{post.category}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(post.date).toLocaleDateString(locale)}
                  </span>
                </div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-muted-foreground line-clamp-2">{post.description}</p>
              </div>
            </div>
          )}
        </article>
      </Link>
    );
  }

  // Regular card - compact vertical layout
  return (
    <Link href={`/${locale}/blog/${post.slug}`} className="group block h-full">
      <article className="h-full flex flex-col overflow-hidden rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card transition-all duration-300">
        {post.coverImage && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        )}
        <div className="flex-1 p-5 flex flex-col">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Calendar className="h-3.5 w-3.5" />
            <span>{new Date(post.date).toLocaleDateString(locale)}</span>
            <span className="mx-1">·</span>
            <Clock className="h-3.5 w-3.5" />
            <span>{t("readingTime", { time: post.readingTime })}</span>
          </div>
          <h3 className="font-heading text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {post.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 flex-1">
            {post.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}