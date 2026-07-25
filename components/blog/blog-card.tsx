"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Clock, Calendar, ArrowRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PostMeta } from "@/types/post";

interface BlogCardProps {
  post: PostMeta;
  featured?: boolean;
  view?: "grid" | "list";
}

export function BlogCard({ post, featured = false, view = "grid" }: BlogCardProps) {
  const locale = useLocale();
  const t = useTranslations("blog");

  const formattedDate = new Date(post.date).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Featured card — elegant horizontal layout
  if (featured) {
    return (
      <Link href={`/${locale}/blog/${post.slug}`} className="group block">
        <article className="relative overflow-hidden rounded-xl bg-card/50 border border-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
          {post.coverImage ? (
            <div className="flex flex-col md:flex-row gap-0">
              {/* Image Side */}
              <div className="relative aspect-16/10 md:aspect-4/3 md:w-1/2 overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-r from-transparent to-background/10 md:bg-linear-to-l" />
                {/* Featured badge overlay */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium backdrop-blur-sm">
                    <Star className="h-3 w-3 fill-current" />
                    {t("featured")}
                  </span>
                </div>
              </div>
              {/* Content Side */}
              <div className="md:w-1/2 p-5 md:p-6 flex flex-col">
                <div className="space-y-3 flex-1">
                  {/* Meta Row */}
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="default" className="bg-primary/90 text-xs px-2 py-0.5">
                      {post.category}
                    </Badge>
                    <span className="text-muted-foreground">{formattedDate}</span>
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
                  <span>{t("readMore")}</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ) : (
            /* No cover - compact layout */
            <div className="p-5 md:p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                  <Star className="h-3 w-3 fill-current" />
                  {t("featured")}
                </span>
                <Badge variant="default" className="bg-primary/90 text-xs px-2 py-0.5">
                  {post.category}
                </Badge>
                <span className="text-muted-foreground">{formattedDate}</span>
              </div>
              <h2 className="font-heading text-xl md:text-2xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h2>
              <p className="text-muted-foreground line-clamp-2 text-sm">{post.description}</p>
              <div className="flex items-center text-primary text-sm font-medium gap-1 mt-2">
                <span>{t("readMore")}</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          )}
        </article>
      </Link>
    );
  }

  // List view — compact horizontal card
  if (view === "list") {
    return (
      <Link href={`/${locale}/blog/${post.slug}`} className="group block">
        <article className="flex gap-4 p-4 rounded-lg bg-card/40 border border-border/30 hover:border-primary/20 hover:bg-card/60 hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
          {/* Thumbnail */}
          {post.coverImage && (
            <div className="relative w-28 h-20 sm:w-36 sm:h-24 rounded-md overflow-hidden shrink-0">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-400"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            {/* Meta */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-border/50">
                {post.category}
              </Badge>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formattedDate}
              </span>
              <span className="text-border">·</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readingTime} min
              </span>
            </div>

            {/* Title */}
            <h3 className="font-heading text-sm sm:text-base font-semibold line-clamp-1 group-hover:text-primary transition-colors leading-snug">
              {post.title}
            </h3>

            {/* Description */}
            <p className="text-muted-foreground text-xs line-clamp-1 mt-1 hidden sm:block">
              {post.description}
            </p>
          </div>

          {/* Arrow */}
          <div className="flex items-center shrink-0">
            <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </div>
        </article>
      </Link>
    );
  }

  // Grid view — clean vertical card (default)
  return (
    <Link href={`/${locale}/blog/${post.slug}`} className="group block h-full">
      <article className="h-full flex flex-col overflow-hidden rounded-lg bg-card/40 border border-border/30 hover:border-primary/20 hover:bg-card/60 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group-hover:-translate-y-0.5">
        {post.coverImage && (
          <div className="relative aspect-video overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
          </div>
        )}
        <div className="flex-1 p-4 flex flex-col">
          {/* Compact Meta */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Calendar className="h-3 w-3" />
            <span>{formattedDate}</span>
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
