"use client";

import { useTranslations, useLocale } from "next-intl";
import { BlogCard } from "@/components/blog/blog-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Search, Tag, FolderOpen, X, FileText, Sparkles } from "lucide-react";
import { PostMeta } from "@/types/post";

interface BlogListProps {
  posts: PostMeta[];
  tags: string[];
  categories: string[];
}

export function BlogList({ posts, tags, categories }: BlogListProps) {
  const t = useTranslations("blog");
  const locale = useLocale();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = !selectedTag || post.tags.includes(selectedTag);
      const matchesCategory = !selectedCategory || post.category === selectedCategory;
      return matchesSearch && matchesTag && matchesCategory;
    });
  }, [posts, searchQuery, selectedTag, selectedCategory]);

  const hasFilters = selectedTag || selectedCategory || searchQuery;

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTag(null);
    setSelectedCategory(null);
  };

  // First post is featured
  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen">
      {/* Editorial Header */}
      <header className="relative py-12 md:py-16">
        {/* Subtle background texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background" />
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }} />

        <div className="relative container mx-auto px-6 lg:px-8 max-w-5xl">
          {/* Centered Content */}
          <div className="text-center space-y-8 animate-fade-in">
            {/* Title with decorative accent */}
            <div className="inline-flex items-center gap-3 mb-2">
              <Sparkles className="h-4 w-4 text-primary/60" />
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
                Thoughts & Ideas
              </span>
              <Sparkles className="h-4 w-4 text-primary/60" />
            </div>

            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              {t("title")}
            </h1>

            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {t("description")}
            </p>

            {/* Compact Stats Row */}
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                <FileText className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium">{posts.length}</span>
                <span className="text-muted-foreground">篇</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-border" />
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                <Tag className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium">{tags.length}</span>
                <span className="text-muted-foreground">标签</span>
              </div>
            </div>

            {/* Elegant Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
              <Input
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-11 text-sm bg-background border-border/60 hover:border-border focus:border-primary/50 transition-colors rounded-full"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Minimal Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <span className="group-hover:underline underline-offset-2">
                {showFilters ? "隐藏筛选" : "高级筛选"}
              </span>
              <span className="text-xs opacity-50">
                {showFilters ? "↑" : "↓"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Compact Filters Panel */}
      {showFilters && (
        <div className="border-y border-border/40 bg-muted/20 animate-slide-up">
          <div className="container mx-auto px-6 lg:px-8 max-w-5xl py-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Categories */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-medium text-foreground uppercase tracking-wide">
                  <FolderOpen className="h-3.5 w-3.5" />
                  分类
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      className="cursor-pointer transition-all hover:border-primary/40 text-xs px-2.5 py-1"
                      onClick={() =>
                        setSelectedCategory(selectedCategory === category ? null : category)
                      }
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-medium text-foreground uppercase tracking-wide">
                  <Tag className="h-3.5 w-3.5" />
                  标签
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTag === tag ? "default" : "outline"}
                      className="cursor-pointer transition-all hover:border-primary/40 text-xs px-2.5 py-1"
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {hasFilters && (
              <div className="mt-4 pt-4 border-t border-border/30">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs text-muted-foreground h-8"
                >
                  <X className="h-3 w-3 mr-1.5" />
                  清除筛选
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Active Filters Inline Display */}
      {hasFilters && !showFilters && (
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl pt-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {selectedCategory && (
              <Badge variant="secondary" className="gap-1 text-xs">
                {selectedCategory}
                <X
                  className="h-2.5 w-2.5 cursor-pointer hover:text-destructive transition-colors"
                  onClick={() => setSelectedCategory(null)}
                />
              </Badge>
            )}
            {selectedTag && (
              <Badge variant="secondary" className="gap-1 text-xs">
                {selectedTag}
                <X
                  className="h-2.5 w-2.5 cursor-pointer hover:text-destructive transition-colors"
                  onClick={() => setSelectedTag(null)}
                />
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="secondary" className="gap-1 text-xs">
                搜索: {searchQuery}
                <X
                  className="h-2.5 w-2.5 cursor-pointer hover:text-destructive transition-colors"
                  onClick={() => setSearchQuery("")}
                />
              </Badge>
            )}
            <button
              onClick={clearFilters}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
            >
              清除
            </button>
          </div>
        </div>
      )}

      {/* Posts Content */}
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl py-10">
        {filteredPosts.length > 0 ? (
          <div className="space-y-8">
            {/* Featured Post */}
            {featuredPost && (
              <div className="animate-slide-up">
                <BlogCard post={featuredPost} featured />
              </div>
            )}

            {/* Regular Posts Grid */}
            {regularPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-slide-up">
                {regularPosts.map((post, index) => (
                  <div
                    key={post.slug}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <BlogCard post={post} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1.5">{t("noPosts")}</h3>
            <p className="text-sm text-muted-foreground mb-5">
              尝试其他关键词或筛选条件
            </p>
            <Button variant="outline" size="sm" onClick={clearFilters} className="h-9">
              清除筛选
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}