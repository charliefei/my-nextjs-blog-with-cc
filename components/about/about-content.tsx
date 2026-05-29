"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ProfileConfig } from "@/types/profile";
import { SkillCategory } from "@/types/experience";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAssetPath } from "@/lib/utils";
import {
  ArrowRight,
  BriefcaseBusiness,
  Code2,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";
import { SocialLink } from "@/components/icons/social-icons";

interface AboutContentProps {
  profile: {
    personal: ProfileConfig["personal"];
    social: ProfileConfig["social"];
  };
  locale: string;
  skills: SkillCategory[];
}

export function AboutContent({ profile, locale, skills }: AboutContentProps) {
  const t = useTranslations("about");
  const tNav = useTranslations("nav");
  const homeT = useTranslations("home");
  const bio = locale === "zh" ? profile.personal.bio.zh : profile.personal.bio.en;
  const avatarSrc = getAssetPath(profile.personal.avatar);

  const flattenedSkills = skills
    .flatMap((cat) => cat.skills)
    .sort((a, b) => b.level - a.level)
    .slice(0, 12);
  const featuredCategories = skills.slice(0, 3);
  const totalSkills = skills.reduce((acc, cat) => acc + cat.skills.length, 0);

  const facts = [
    {
      icon: <MapPin className="h-4 w-4" />,
      label: t("location"),
      value: profile.personal.location,
    },
    {
      icon: <Code2 className="h-4 w-4" />,
      label: t("stats.skillsLabel"),
      value: t("stats.skillsValue", { count: totalSkills }),
    },
    {
      icon: <BriefcaseBusiness className="h-4 w-4" />,
      label: t("stats.focusLabel"),
      value: profile.personal.profession,
    },
  ];

  return (
    <div className="container mx-auto max-w-4xl px-6 py-8 md:py-12 lg:px-8">
      <div className="space-y-6 md:space-y-8">
        <header className="animate-fade-in space-y-3">
          <Badge variant="outline" className="border-primary/20 bg-primary/10 px-3 py-1 text-primary">
            {t("eyebrow")}
          </Badge>
          <h1 className="font-heading text-3xl font-bold leading-tight md:text-4xl">
            {t("title")}
          </h1>
        </header>

        <section className="animate-slide-up stagger-1 overflow-hidden rounded-lg border border-border/50 bg-card/60">
          <div className="p-5 md:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Avatar className="h-20 w-20 ring-1 ring-border/60 ring-offset-4 ring-offset-background md:h-24 md:w-24">
                <AvatarImage src={avatarSrc} alt={profile.personal.name} />
                <AvatarFallback className="text-xl font-bold">
                  {profile.personal.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1 space-y-3">
                <div>
                  <h2 className="font-heading text-2xl font-semibold leading-tight">
                    {profile.personal.name}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-muted-foreground md:text-base">
                    {profile.personal.profession}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {profile.personal.jobStatus.openToWork && (
                    <Badge variant="outline" className="gap-1.5 border-primary/20 bg-primary/10 text-primary">
                      <Sparkles className="h-3 w-3" />
                      {homeT("hero.openToWork")}
                    </Badge>
                  )}
                  <Badge variant="outline" className="gap-1.5 border-border/60 bg-background">
                    <MapPin className="h-3 w-3 text-primary" />
                    {profile.personal.location}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-lg border border-border/50 bg-background/60 p-4 transition-colors duration-200 hover:border-primary/25"
                >
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                    {fact.icon}
                  </div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    {fact.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-snug text-foreground">
                    {fact.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-border/40 pt-5 sm:flex-row">
              <Link href={`/${locale}/experience`} className="w-full sm:w-auto">
                <Button className="h-9 w-full cursor-pointer gap-2 px-3.5 sm:w-auto">
                  {t("viewExperience")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={`/${locale}/resume`} className="w-full sm:w-auto">
                <Button variant="outline" className="h-9 w-full cursor-pointer gap-2 px-3.5 sm:w-auto">
                  {tNav("resume")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="animate-slide-up stagger-2 rounded-lg border border-border/50 bg-card/60 p-5 md:p-6">
          <h2 className="font-heading text-xl font-semibold">{t("bio")}</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
            {bio}
          </p>
        </section>

        <section className="animate-slide-up stagger-3 rounded-lg border border-border/50 bg-card/60 p-5 md:p-6">
          <div className="mb-4">
            <h2 className="font-heading text-lg font-semibold">{t("social")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("socialHint")}</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {profile.social.map((social) => (
              <SocialLink
                key={social.platform}
                platform={social.platform}
                url={social.url}
                username={social.username}
                variant="card"
                className="cursor-pointer rounded-lg bg-background/60"
              />
            ))}
          </div>
        </section>

        <section className="animate-slide-up stagger-4 rounded-lg border border-border/50 bg-card/60 p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-lg font-semibold">{t("toolkit")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t("toolkitHint")}</p>
            </div>
            <Code2 className="h-5 w-5 text-primary" />
          </div>

          <div className="space-y-4">
            {featuredCategories.map((category) => (
              <div key={category.category} className="space-y-2">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  {category.category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {category.skills.slice(0, 4).map((skill) => (
                    <Badge key={skill.name} variant="secondary" className="tag-item">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 border-t border-border/40 pt-4">
            <div className="flex flex-wrap gap-2">
              {flattenedSkills.map((skill) => (
                <Badge key={skill.name} variant="outline" className="border-border/60 bg-background/60">
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        <div className="animate-slide-up stagger-5 flex items-center gap-2 rounded-lg border border-border/50 bg-muted/25 p-4 text-sm text-muted-foreground">
          <Mail className="h-4 w-4 text-primary" />
          <a
            href={`mailto:${profile.personal.email}`}
            className="cursor-pointer underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            {profile.personal.email}
          </a>
        </div>
      </div>
    </div>
  );
}
