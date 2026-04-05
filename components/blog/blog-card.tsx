"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Clock, Calendar } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PostMeta } from "@/types/post";

interface BlogCardProps {
  post: PostMeta;
}

export function BlogCard({ post }: BlogCardProps) {
  const locale = useLocale();
  const t = useTranslations("blog");

  return (
    <Link href={`/${locale}/blog/${post.slug}`}>
      <Card className="h-full overflow-hidden group hover:border-primary/30 transition-all duration-300 animate-fade-in glass">
        {post.coverImage && (
          <div className="aspect-video overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date(post.date).toLocaleDateString(locale)}</span>
            <Clock className="h-4 w-4 ml-2" />
            <span>{t("readingTime", { time: post.readingTime })}</span>
          </div>
          <h3 className="font-heading text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-muted-foreground line-clamp-3 text-sm">
            {post.description}
          </p>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}