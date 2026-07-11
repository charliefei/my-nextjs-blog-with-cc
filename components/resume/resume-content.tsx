"use client";

import { useTranslations, useLocale } from "next-intl";
import { ProfileConfig } from "@/types/profile";
import { WorkExperience, Project, SkillCategory } from "@/types/experience";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Download, Calendar, FileText, ExternalLink, MapPin, Terminal, Code2, Briefcase, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { getAssetPath } from "@/lib/utils";
import { SocialLink } from "@/components/icons/social-icons";

interface ResumeContentProps {
  profile: ProfileConfig;
  experienceData: {
    work: WorkExperience[];
    projects: Project[];
    skills: SkillCategory[];
  };
}

export function ResumeContent({ profile, experienceData }: ResumeContentProps) {
  const t = useTranslations("resume");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const bio = locale === "zh" ? profile.personal.bio.zh : profile.personal.bio.en;
  
  // Calculate total skills count from all categories
  const totalSkills = experienceData.skills.reduce((acc, cat) => acc + cat.skills.length, 0);

  return (
    <div className="relative min-h-screen">
      {/* Ambient gradient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-105 bg-[radial-gradient(ellipse_60%_60%_at_30%_0%,oklch(0.7_0.12_190/0.16),transparent_70%),radial-gradient(ellipse_50%_50%_at_85%_5%,oklch(0.65_0.12_170/0.12),transparent_70%)]"
      />

      <div className="container mx-auto max-w-7xl px-6 py-8 md:py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[360px_1fr] lg:gap-12 xl:gap-16">
          {/* Left Column - Personal Info Card */}
          <aside className="animate-slide-up lg:sticky lg:top-8 lg:self-start">
            <div className="dev-card-border group relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm transition-colors duration-300 hover:border-primary/40">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/20 blur-3xl transition-opacity duration-500 group-hover:opacity-80"
              />

              {/* Title bar */}
              <div className="relative flex items-center gap-2 border-b border-border/40 bg-muted/40 px-4 py-2.5">
                <span className="h-3 w-3 rounded-full bg-destructive/70" />
                <span className="h-3 w-3 rounded-full bg-chart-4/80" />
                <span className="h-3 w-3 rounded-full bg-primary/70" />
                <span className="ml-2 truncate font-mono text-xs text-muted-foreground">
                  ~/{profile.personal.name.toLowerCase().replace(/\s+/g, "-")}.resume
                </span>
                <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-medium text-primary">
                  <Terminal className="h-3 w-3" />
                  {t("eyebrow")}
                </span>
              </div>

              {/* Body */}
              <div className="relative p-6">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20 ring-1 ring-border/50 ring-offset-2 ring-offset-background">
                      <AvatarImage src={profile.personal.avatar} alt={profile.personal.name} />
                      <AvatarFallback className="text-2xl font-bold bg-muted">
                        {profile.personal.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {profile.personal.jobStatus.openToWork && (
                      <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary animate-pulse flex items-center justify-center ring-2 ring-background">
                        <Sparkles className="h-2.5 w-2.5 text-primary-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 pt-1">
                    <h1 className="gradient-text font-heading text-2xl font-bold leading-tight tracking-tight">
                      {profile.personal.name}
                    </h1>
                    <p className="mt-1 text-sm font-medium text-muted-foreground">
                      {profile.personal.profession}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>{profile.personal.location}</span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-5 rounded-lg border border-border/40 bg-muted/30 px-3 py-2.5 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-primary">❯</span>
                    <span className="text-muted-foreground">whoami</span>
                    <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                      <Code2 className="h-3 w-3" />
                      {t("skillsHint", { count: totalSkills })}
                    </span>
                  </div>
                  <p className="mt-2 font-sans text-sm leading-7 text-muted-foreground">{bio}</p>
                </div>

                {/* Stats */}
                <div className="mt-5 flex flex-wrap gap-2">
                  <Badge variant="outline" className="gap-1.5 text-xs px-3 py-1.5 border-border/50 bg-background">
                    <Code2 className="h-3 w-3 text-primary" />
                    <span>{t("stats.skills", { count: totalSkills })}</span>
                  </Badge>
                  <Badge variant="outline" className="gap-1.5 text-xs px-3 py-1.5 border-border/50 bg-background">
                    <Briefcase className="h-3 w-3 text-primary" />
                    <span>{t("stats.experience", { count: experienceData.work.length })}</span>
                  </Badge>
                </div>

                {/* Social */}
                <div className="mt-5 flex items-center gap-3 border-t border-border/30 pt-5">
                  {profile.social.map((social) => (
                    <SocialLink
                      key={social.platform}
                      platform={social.platform}
                      url={social.url}
                      variant="button"
                      iconClassName="h-4 w-4"
                      className="cursor-pointer"
                    />
                  ))}
                </div>

                {/* Download Actions */}
                <div className="mt-5 flex flex-col gap-2 border-t border-border/30 pt-5">
                  <a href={getAssetPath(profile.resume.pdfUrl)} target="_blank" download rel="noopener noreferrer" className="w-full">
                    <Button className="group/btn h-9 w-full cursor-pointer justify-center gap-2">
                      <Download className="h-4 w-4" />
                      {t("download")}
                    </Button>
                  </a>
                  <a href={getAssetPath(profile.resume.pdfUrl)} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button variant="outline" className="group/btn h-9 w-full cursor-pointer justify-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      {t("openInNewTab")}
                    </Button>
                  </a>
                </div>

                {/* Last Updated */}
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{t("lastUpdated", { date: profile.resume.lastUpdated })}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column - Resume Content */}
          <main className="animate-slide-up space-y-8" style={{ animationDelay: "0.12s" }}>
            <section className="space-y-3">
              <Badge variant="outline" className="border-border/60 bg-background">
                {t("eyebrow")}
              </Badge>
              <h2 className="font-heading text-3xl font-bold leading-tight md:text-4xl">
                <span className="gradient-text">{t("title")}</span>
              </h2>
            </section>

            {/* PDF Viewer */}
            <Card className="glass overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-medium">{t("preview")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={getAssetPath(profile.resume.pdfUrl)} target="_blank" download rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">{t("download")}</span>
                      </Button>
                    </a>
                    <a href={getAssetPath(profile.resume.pdfUrl)} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        <span className="hidden sm:inline">{t("openInNewTab")}</span>
                      </Button>
                    </a>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full" style={{ height: "calc(100vh - 300px)", minHeight: "600px" }}>
                  <iframe
                    src={`${getAssetPath(profile.resume.pdfUrl)}#toolbar=0`}
                    className="w-full h-full border-0"
                    title="Resume PDF"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href={`/${locale}/about`} className="group">
                <Card className="h-full glass transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">{t("quickLinks.about")}</h3>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{t("quickLinks.aboutDesc")}</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href={`/${locale}/experience`} className="group">
                <Card className="h-full glass transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">{t("quickLinks.experience")}</h3>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{t("quickLinks.experienceDesc")}</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href={`/${locale}/blog`} className="group">
                <Card className="h-full glass transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">{t("quickLinks.blog")}</h3>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{t("quickLinks.blogDesc")}</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}