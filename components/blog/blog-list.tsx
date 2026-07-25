"use client";

import { useTranslations } from "next-intl";
import { BlogCard } from "@/components/blog/blog-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import {
  Search,
  Tag,
  X,
  FileText,
  Hash,
  LayoutGrid,
  List,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PostMeta } from "@/types/post";

interface BlogListProps {
  posts: PostMeta[];
  tags: string[];
  categories: string[];
}

export function BlogList({ posts, tags, categories }: BlogListProps) {
  const t = useTranslations("blog");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");

  // Compute post count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((post) => {
      counts[post.category] = (counts[post.category] || 0) + 1;
    });
    return counts;
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        const matchesSearch =
          !searchQuery ||
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = !selectedTag || post.tags.includes(selectedTag);
        const matchesCategory =
          !selectedCategory || post.category === selectedCategory;
        return matchesSearch && matchesTag && matchesCategory;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [posts, searchQuery, selectedTag, selectedCategory]);

  const hasFilters = selectedTag || selectedCategory || searchQuery;

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTag(null);
    setSelectedCategory(null);
  };

  // First post is featured (only in grid view with no filters)
  const showFeatured = view === "grid" && !hasFilters;
  const featuredPost = showFeatured ? filteredPosts[0] : null;
  const regularPosts = showFeatured ? filteredPosts.slice(1) : filteredPosts;

  return (
    <div className="min-h-screen">
      {/* Editorial Header */}
      <header className="relative py-12 md:py-16">
        <div className="absolute inset-0 bg-linear-to-b from-muted/30 via-background to-background" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative container mx-auto px-6 lg:px-8 max-w-5xl">
          {/* Centered Content */}
          <div className="text-center space-y-8 animate-fade-in">
            {/* Title with decorative accent */}
            <div className="inline-flex items-center gap-3 mb-2">
              <Sparkles className="h-4 w-4 text-primary/60" />
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
                {t("subtitle")}
              </span>
              <Sparkles className="h-4 w-4 text-primary/60" />
            </div>

            {/* Title */}
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              {t("title")}
            </h1>

            {/* Description */}
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {t("description")}
            </p>

            {/* Compact Stats Row */}
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                <FileText className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium">{posts.length}</span>
                <span className="text-muted-foreground">
                  {t("stats.articles")}
                </span>
              </div>
              <div className="w-1 h-1 rounded-full bg-border" />
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                <Tag className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium">{tags.length}</span>
                <span className="text-muted-foreground">
                  {t("stats.tags")}
                </span>
              </div>
            </div>

            {/* Search Bar */}
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
          </div>
        </div>
      </header>

      {/* Tags Filter — always visible */}
      <div className="border-y border-border/40 bg-muted/20">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl py-5">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-medium text-foreground uppercase tracking-wide">
                <Tag className="h-3.5 w-3.5" />
                {t("tags")}
              </div>
              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs text-muted-foreground h-7 px-2"
                >
                  <X className="h-3 w-3 mr-1" />
                  {t("clearFilters")}
                </Button>
              )}
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className="cursor-pointer transition-all hover:border-primary/40 text-xs px-2.5 py-1 shrink-0"
                  onClick={() =>
                    setSelectedTag(selectedTag === tag ? null : tag)
                  }
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Inline Display */}
      {hasFilters && (
        <div className="relative z-10 container mx-auto px-6 lg:px-8 max-w-5xl pt-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {selectedCategory && (
              <Badge variant="secondary" className="gap-1 text-xs">
                {selectedCategory}
                <X
                  className="h-2.5 w-2.5 cursor-pointer hover:text-destructive transition-colors pointer-events-auto!"
                  onClick={() => setSelectedCategory(null)}
                />
              </Badge>
            )}
            {selectedTag && (
              <Badge variant="secondary" className="gap-1 text-xs">
                {selectedTag}
                <X
                  className="h-2.5 w-2.5 cursor-pointer hover:text-destructive transition-colors pointer-events-auto!"
                  onClick={() => setSelectedTag(null)}
                />
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="secondary" className="gap-1 text-xs">
                {t("searchLabel", { query: searchQuery })}
                <X
                  className="h-2.5 w-2.5 cursor-pointer hover:text-destructive transition-colors pointer-events-auto!"
                  onClick={() => setSearchQuery("")}
                />
              </Badge>
            )}
            <button
              onClick={clearFilters}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
            >
              {t("clear")}
            </button>
          </div>
        </div>
      )}

      {/* Main Layout: Category Sidebar + Posts */}
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl py-10">
        <div className="flex gap-8 lg:gap-10">
          {/* Category Sidebar — desktop only */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24">
              <div className="rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
                  <Hash className="h-3.5 w-3.5 text-primary/60" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("categories")}
                  </span>
                </div>

                {/* Category list */}
                <nav className="p-2 space-y-0.5" aria-label={t("categories")}>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                      !selectedCategory
                        ? "bg-primary/5 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted/40 hover:text-foreground hover:translate-x-0.5"
                    )}
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full shrink-0 transition-colors",
                          !selectedCategory
                            ? "bg-primary"
                            : "bg-muted-foreground/30"
                        )}
                      />
                      <span className="truncate">{t("browseAll")}</span>
                    </span>
                    <span className="shrink-0 text-[11px] tabular-nums leading-none px-1.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground ml-2">
                      {posts.length}
                    </span>
                  </button>

                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() =>
                        setSelectedCategory(
                          selectedCategory === category ? null : category
                        )
                      }
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                        selectedCategory === category
                          ? "bg-primary/5 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted/40 hover:text-foreground hover:translate-x-0.5"
                      )}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full shrink-0 transition-colors",
                            selectedCategory === category
                              ? "bg-primary"
                              : "bg-muted-foreground/30"
                          )}
                        />
                        <span className="truncate">{category}</span>
                      </span>
                      <span className="shrink-0 text-[11px] tabular-nums leading-none px-1.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground ml-2">
                        {categoryCounts[category] ?? 0}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* Posts Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Category Pills */}
            <div className="lg:hidden mb-6">
              <div className="flex gap-2.5 overflow-x-auto pb-3 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    "shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 touch-manipulation",
                    !selectedCategory
                      ? "bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/20"
                      : "bg-card border border-border/60 text-muted-foreground hover:border-primary/30 hover:text-foreground active:scale-95"
                  )}
                >
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      !selectedCategory
                        ? "bg-primary-foreground/60"
                        : "bg-muted-foreground/40"
                    )}
                  />
                  {t("browseAll")}
                  <span className="text-xs opacity-70 tabular-nums">
                    {posts.length}
                  </span>
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === category ? null : category
                      )
                    }
                    className={cn(
                      "shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 touch-manipulation",
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/20"
                        : "bg-card border border-border/60 text-muted-foreground hover:border-primary/30 hover:text-foreground active:scale-95"
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full shrink-0",
                        selectedCategory === category
                          ? "bg-primary-foreground/60"
                          : "bg-muted-foreground/40"
                      )}
                    />
                    {category}
                    <span className="text-xs opacity-70 tabular-nums">
                      {categoryCounts[category] ?? 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Header: results count + view toggle */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {hasFilters
                  ? t("showingResults", {
                      count: filteredPosts.length,
                      total: posts.length,
                    })
                  : `${posts.length} ${t("stats.articles")}`}
              </p>

              {/* View Toggle */}
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted/50 border border-border/40">
                <button
                  onClick={() => setView("grid")}
                  className={cn(
                    "p-1.5 rounded-md transition-all",
                    view === "grid"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-label={t("viewGrid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={cn(
                    "p-1.5 rounded-md transition-all",
                    view === "list"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-label={t("viewList")}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Posts */}
            {filteredPosts.length > 0 ? (
              <div className="space-y-8">
                {/* Featured Post (grid view, no filters) */}
                {featuredPost && (
                  <div className="animate-slide-up">
                    <BlogCard post={featuredPost} featured />
                  </div>
                )}

                {/* Regular Posts */}
                {regularPosts.length > 0 && (
                  <div
                    className={cn(
                      view === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 gap-5"
                        : "space-y-3",
                      "animate-slide-up"
                    )}
                  >
                    {regularPosts.map((post, index) => (
                      <div
                        key={post.slug}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <BlogCard post={post} view={view} />
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
                <h3 className="text-lg font-semibold mb-1.5">
                  {t("noPosts")}
                </h3>
                <p className="text-sm text-muted-foreground mb-5">
                  {t("noPostsHint")}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="h-9"
                >
                  {t("clearFilters")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
