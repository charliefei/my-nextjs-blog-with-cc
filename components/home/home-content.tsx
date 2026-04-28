"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, Clock, MapPin, Sparkles, FileText, Calendar, Briefcase, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SocialLink } from "@/components/icons/social-icons";
import { ProfileConfig } from "@/types/profile";
import { PostMeta } from "@/types/post";
import { SkillCategory, WorkExperience, Project } from "@/types/experience";

interface HomeContentProps {
  profile: {
    personal: ProfileConfig["personal"];
    social: ProfileConfig["social"];
  };
  posts: PostMeta[];
  experienceData: {
    work: WorkExperience[];
    projects: Project[];
    skills: SkillCategory[];
  };
}

export function HomeContent({ profile, posts, experienceData }: HomeContentProps) {
  const t = useTranslations("home");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const bio = locale === "zh" ? profile.personal.bio.zh : profile.personal.bio.en;

  // Calculate total skills count from all categories
  const totalSkills = experienceData.skills.reduce((acc, cat) => acc + cat.skills.length, 0);

  return (
    <div className="min-h-screen">
      {/* Split Layout Container */}
      <div className="container mx-auto px-6 lg:px-8 py-8 md:py-12 lg:py-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 lg:gap-12 xl:gap-16">

          {/* Left Column - Personal Info */}
          <aside className="lg:sticky lg:top-8 lg:self-start animate-fade-in">
            <div className="space-y-6">
              {/* Portrait Section */}
              <div className="relative">
                {/* Avatar with subtle glow ring */}
                <div className="relative inline-block">
                  <Avatar className="h-28 w-28 md:h-32 md:w-32 ring-1 ring-border/50 ring-offset-4 ring-offset-background">
                    <AvatarImage src={profile.personal.avatar} alt={profile.personal.name} />
                    <AvatarFallback className="text-3xl font-bold bg-muted">
                      {profile.personal.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {/* Status indicator */}
                  {profile.personal.jobStatus.openToWork && (
                    <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary animate-pulse flex items-center justify-center ring-2 ring-background">
                      <Sparkles className="h-2.5 w-2.5 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </div>

              {/* Name & Title */}
              <div className="space-y-2">
                <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight">
                  {profile.personal.name}
                </h1>
                <p className="text-muted-foreground font-medium">
                  {profile.personal.profession}
                </p>
              </div>

              {/* Location Badge */}
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>{profile.personal.location}</span>
              </div>

              {/* Bio Card */}
              <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {bio}
                </p>
              </div>

              {/* Quick Stats - Minimal Row */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="gap-1.5 text-xs px-3 py-1.5 border-border/50 bg-background">
                  <Code2 className="h-3 w-3 text-primary" />
                  <span>{totalSkills} 技能</span>
                </Badge>
                <Badge variant="outline" className="gap-1.5 text-xs px-3 py-1.5 border-border/50 bg-background">
                  <Briefcase className="h-3 w-3 text-primary" />
                  <span>{experienceData.work.length} 经历</span>
                </Badge>
                <Badge variant="outline" className="gap-1.5 text-xs px-3 py-1.5 border-border/50 bg-background">
                  <FileText className="h-3 w-3 text-primary" />
                  <span>{posts.length} 文章</span>
                </Badge>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3 pt-2">
                {profile.social.map((link) => (
                  <SocialLink
                    key={link.platform}
                    platform={link.platform}
                    url={link.url}
                    variant="button"
                    iconClassName="h-4 w-4"
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-4 border-t border-border/30">
                <Link href={`/${locale}/about`} className="w-full">
                  <Button variant="default" size="sm" className="w-full justify-center gap-2 h-9">
                    {tNav("about")}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Link href={`/${locale}/resume`} className="w-full">
                  <Button variant="outline" size="sm" className="w-full justify-center gap-2 h-9">
                    {tNav("resume")}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </aside>

          {/* Right Column - Latest Articles */}
          <main className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="space-y-6">
              {/* Section Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border/30">
                <div className="space-y-1">
                  <h2 className="font-heading text-xl md:text-2xl font-semibold">
                    {t("latestPosts")}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    最新发布的技术文章与思考
                  </p>
                </div>
                <Link
                  href={`/${locale}/blog`}
                  className="group flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <span className="underline underline-offset-2 decoration-border/50 group-hover:decoration-primary">
                    查看全部
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Articles List */}
              <div className="space-y-4">
                {posts.map((post, index) => (
                  <ArticleItem key={post.slug} post={post} locale={locale} index={index} />
                ))}
              </div>

              {/* Empty State */}
              {posts.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">暂无文章</p>
                </div>
              )}

              {/* More Articles Hint */}
              {posts.length > 0 && (
                <div className="pt-6 text-center">
                  <Link href={`/${locale}/blog`}>
                    <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                      浏览更多文章
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// Article Item Component - Inline style for list
function ArticleItem({ post, locale, index }: { post: PostMeta; locale: string; index: number }) {
  const t = useTranslations("blog");

  return (
    <a
      href={`/${locale}/blog/${post.slug}`}
      className="group block p-4 rounded-lg bg-card/40 border border-border/30 hover:border-primary/20 hover:bg-card/60 transition-all duration-200 animate-fade-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex flex-col md:flex-row md:items-start gap-3">
        {/* Cover Image - Optional thumbnail */}
        {post.coverImage && (
          <div className="md:w-32 md:h-20 w-full h-40 rounded-md overflow-hidden shrink-0">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Meta Row */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-border/40 shrink-0">
              {post.category}
            </Badge>
            <Calendar className="h-3 w-3 shrink-0" />
            <span className="shrink-0">
              {new Date(post.date).toLocaleDateString(locale, {
                month: "short",
                day: "numeric"
              })}
            </span>
            <span className="text-border hidden sm:inline">·</span>
            <Clock className="h-3 w-3 shrink-0 hidden sm:inline" />
            <span className="shrink-0 hidden sm:inline">{post.readingTime} min</span>
          </div>

          {/* Title */}
          <h3 className="font-heading text-base md:text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {post.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {post.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 pt-1">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="tag-item text-xs backdrop-blur-sm bg-white/10 border-white/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Arrow Indicator */}
        <div className="hidden md:flex items-center self-center shrink-0">
          <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </a>
  );
}