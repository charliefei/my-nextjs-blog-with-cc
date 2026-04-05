"use client";

import { useTranslations, useLocale } from "next-intl";
import { BlogCard } from "@/components/blog/blog-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Search, Tag, FolderOpen, X, FileText } from "lucide-react";
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
      {/* Hero Header */}
      <header className="relative bg-gradient-to-b from-muted/50 to-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl space-y-6 animate-fade-in">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t("title")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              {t("description")}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>{posts.length} 篇文章</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span>{tags.length} 个标签</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-xl pt-4">
              <Search className="absolute left-4 top-1/2 translate-y-[-30%] h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base bg-background/80 backdrop-blur-sm border-border/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <Button
              variant="ghost"
              onClick={() => setShowFilters(!showFilters)}
              className="text-muted-foreground"
            >
              {showFilters ? "隐藏筛选" : "显示筛选"}
            </Button>
          </div>
        </div>
      </header>

      {/* Filters Section */}
      {showFilters && (
        <div className="border-b border-border/50 bg-muted/30 animate-slide-up">
          <div className="container mx-auto px-4 py-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Categories */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <FolderOpen className="h-4 w-4" />
                  分类
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      className="cursor-pointer transition-all hover:scale-105"
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
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Tag className="h-4 w-4" />
                  标签
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTag === tag ? "default" : "outline"}
                      className="cursor-pointer transition-all hover:scale-105"
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {hasFilters && (
              <div className="mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground"
                >
                  <X className="h-4 w-4 mr-2" />
                  清除所有筛选
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasFilters && !showFilters && (
        <div className="container mx-auto px-4 pt-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">当前筛选：</span>
            {selectedCategory && (
              <Badge variant="secondary" className="gap-1">
                {selectedCategory}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedCategory(null)}
                />
              </Badge>
            )}
            {selectedTag && (
              <Badge variant="secondary" className="gap-1">
                {selectedTag}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedTag(null)}
                />
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                搜索: {searchQuery}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSearchQuery("")}
                />
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs text-muted-foreground"
            >
              清除全部
            </Button>
          </div>
        </div>
      )}

      {/* Posts Content */}
      <div className="container mx-auto px-4 py-12">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up stagger-1">
                {regularPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("noPosts")}</h3>
            <p className="text-muted-foreground mb-6">
              没有找到符合条件的文章，尝试其他关键词或筛选条件
            </p>
            <Button variant="outline" onClick={clearFilters}>
              清除筛选
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}