"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, Clock, Code2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BlogCard } from "@/components/blog/blog-card";
import { ProfileConfig } from "@/types/profile";
import { PostMeta } from "@/types/post";

interface HomeContentProps {
  profile: {
    personal: ProfileConfig["personal"];
    skills: ProfileConfig["skills"];
    experience: ProfileConfig["experience"];
    projects: ProfileConfig["projects"];
    social: ProfileConfig["social"];
  };
  posts: PostMeta[];
}

export function HomeContent({ profile, posts }: HomeContentProps) {
  const t = useTranslations("home");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      {/* Hero Section */}
      <section className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <Avatar className="h-24 w-24 ring-2 ring-primary/20 ring-offset-2 ring-offset-background animate-scale-in stagger-1">
            <AvatarImage src={profile.personal.avatar} alt={profile.personal.name} />
            <AvatarFallback className="text-2xl font-bold">
              {profile.personal.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-4 text-center md:text-left animate-slide-up stagger-2">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t("hero.greeting")}{" "}
              <span className="gradient-text">{profile.personal.name}</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              {t("hero.profession", { profession: profile.personal.profession })}
            </p>
            {profile.personal.jobStatus.openToWork && (
              <Badge variant="outline" className="gap-1 bg-primary/10 text-primary border-primary/20 animate-scale-in stagger-3">
                <Sparkles className="h-3 w-3" />
                {t("hero.openToWork")}
              </Badge>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up stagger-3">
          <Card className="glass overflow-hidden group hover:border-primary/30 transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <Code2 className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{profile.skills.length}</p>
                <p className="text-sm text-muted-foreground">{t("skillsHighlight")}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass overflow-hidden group hover:border-primary/30 transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <Clock className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{profile.experience.length}</p>
                <p className="text-sm text-muted-foreground">{tNav("experience")}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass overflow-hidden group hover:border-primary/30 transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <Sparkles className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{profile.projects.length}</p>
                <p className="text-sm text-muted-foreground">{tNav("resume")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="space-y-6 animate-fade-in stagger-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-3xl font-bold">{t("latestPosts")}</h2>
          <Link href={`/${locale}/blog`}>
            <Button variant="ghost" className="gap-2 group">
              {t("viewAll")}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-4 animate-fade-in stagger-5">
        <Card className="glass max-w-2xl mx-auto overflow-hidden">
          <CardContent className="p-8">
            <h2 className="font-heading text-2xl font-bold mb-2">
              {locale === "zh" ? profile.personal.bio.zh : profile.personal.bio.en}
            </h2>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Link href={`/${locale}/about`}>
                <Button variant="default" className="gap-2">
                  {tNav("about")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={`/${locale}/resume`}>
                <Button variant="outline" className="gap-2">
                  {tNav("resume")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}