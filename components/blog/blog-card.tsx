"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PostMeta } from "@/types/post";

interface BlogCardProps {
  post: PostMeta;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const locale = useLocale();
  const t = useTranslations("blog");

  if (featured) {
    // Featured card - elegant horizontal layout
    return (
      <Link href={`/${locale}/blog/${post.slug}`} className="group block">
        <article className="relative overflow-hidden rounded-xl bg-card/50 border border-border/40 hover:border-primary/20 transition-all duration-300 hover:bg-card/80">
          {post.coverImage ? (
            <div className="flex flex-col md:flex-row gap-0">
              {/* Image Side */}
              <div className="relative aspect-[16/10] md:aspect-[4/3] md:w-1/2 overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/10 md:bg-gradient-to-l" />
              </div>
              {/* Content Side */}
              <div className="md:w-1/2 p-5 md:p-6 flex flex-col">
                <div className="space-y-3 flex-1">
                  {/* Meta Row */}
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="default" className="bg-primary/90 text-xs px-2 py-0.5">
                      {post.category}
                    </Badge>
                    <span className="text-muted-foreground">
                      {new Date(post.date).toLocaleDateString(locale, {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="font-heading text-xl md:text-2xl font-semibold group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h2>

                  {/* Description */}
                  <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                    {post.description}
                  </p>

                  {/* Tags + Reading Time */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-3">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readingTime} min
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0 border-border/50 tag-item">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Read More Arrow */}
                <div className="flex items-center text-primary text-sm font-medium mt-3 group-hover:gap-2 transition-all gap-1">
                  <span>阅读全文</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ) : (
            /* No cover - compact layout */
            <div className="p-5 md:p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <Badge variant="default" className="bg-primary/90 text-xs px-2 py-0.5">
                  {post.category}
                </Badge>
                <span className="text-muted-foreground">
                  {new Date(post.date).toLocaleDateString(locale)}
                </span>
              </div>
              <h2 className="font-heading text-xl md:text-2xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h2>
              <p className="text-muted-foreground line-clamp-2 text-sm">{post.description}</p>
              <div className="flex items-center text-primary text-sm font-medium gap-1 mt-2">
                <span>阅读全文</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          )}
        </article>
      </Link>
    );
  }

  // Regular card - clean vertical layout
  return (
    <Link href={`/${locale}/blog/${post.slug}`} className="group block h-full">
      <article className="h-full flex flex-col overflow-hidden rounded-lg bg-card/40 border border-border/30 hover:border-primary/20 hover:bg-card/60 transition-all duration-300">
        {post.coverImage && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-400"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        )}
        <div className="flex-1 p-4 flex flex-col">
          {/* Compact Meta */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Calendar className="h-3 w-3" />
            <span>{new Date(post.date).toLocaleDateString(locale)}</span>
            <span className="text-border">·</span>
            <Clock className="h-3 w-3" />
            <span>{post.readingTime} min</span>
          </div>

          {/* Title */}
          <h3 className="font-heading text-base font-semibold line-clamp-2 group-hover:text-primary transition-colors leading-snug mb-1.5">
            {post.title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground text-xs line-clamp-2 flex-1 leading-relaxed">
            {post.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-3">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0.5 border-border/40 tag-item">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}