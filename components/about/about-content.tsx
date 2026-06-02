"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { ProfileConfig } from "@/types/profile";
import { SkillCategory } from "@/types/experience";
import { FriendLink } from "@/types/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MarkdownRenderer } from "@/lib/markdown";
import {
  ArrowRight,
  BookOpenText,
  BriefcaseBusiness,
  Code2,
  ExternalLink,
  Globe2,
  Layers3,
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
  aboutMarkdown: string;
  links: FriendLink[];
}

export function AboutContent({ profile, locale, skills, aboutMarkdown, links }: AboutContentProps) {
  const t = useTranslations("about");
  const tNav = useTranslations("nav");
  const [activeTab, setActiveTab] = useState<"details" | "links">("details");
  const bio = locale === "zh" ? profile.personal.bio.zh : profile.personal.bio.en;
  const avatarSrc = profile.personal.avatar;

  const flattenedSkills = skills
    .flatMap((cat) => cat.skills)
    .sort((a, b) => b.level - a.level)
    .slice(0, 14);
  const featuredCategories = skills.slice(0, 3);
  const totalSkills = skills.reduce((acc, cat) => acc + cat.skills.length, 0);
  const tabs = [
    {
      id: "details" as const,
      label: t("bio"),
      description: t("detailsTabHint"),
      icon: <BookOpenText className="h-4 w-4" />,
      meta: t("markdownLabel"),
    },
    {
      id: "links" as const,
      label: t("linksTitle"),
      description: t("linksTabHint"),
      icon: <Globe2 className="h-4 w-4" />,
      meta: t("linksCount", { count: links.length }),
    },
  ];

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
    <div className="min-h-screen">
      <div className="container mx-auto max-w-7xl px-6 py-8 md:py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[360px_1fr] lg:gap-12 xl:gap-16">
          <aside className="animate-fade-in lg:sticky lg:top-8 lg:self-start">
            <div className="space-y-6">
              <header className="space-y-4">
                <Badge variant="outline" className="border-primary/20 bg-primary/10 px-3 py-1 text-primary">
                  {t("eyebrow")}
                </Badge>

                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <Avatar className="h-24 w-24 ring-1 ring-border/50 ring-offset-4 ring-offset-background md:h-28 md:w-28">
                      <AvatarImage src={avatarSrc} alt={profile.personal.name} />
                      <AvatarFallback className="bg-muted text-2xl font-bold">
                        {profile.personal.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {profile.personal.jobStatus.openToWork && (
                      <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background">
                        <Sparkles className="h-3 w-3" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 pt-1">
                    <h1 className="font-heading text-2xl font-bold leading-tight tracking-tight md:text-3xl">
                      {profile.personal.name}
                    </h1>
                    <p className="mt-1 text-sm font-medium text-muted-foreground">
                      {profile.personal.profession}
                    </p>
                    <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span>{profile.personal.location}</span>
                    </div>
                  </div>
                </div>
              </header>

              <section className="space-y-3">
                <div className="flex items-center gap-3">
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

                <div className="flex flex-col gap-2 border-t border-border/30 pt-4 sm:flex-row lg:flex-col">
                  <Link href={`/${locale}/experience`} className="w-full">
                    <Button className="h-9 w-full cursor-pointer justify-center gap-2">
                      {t("viewExperience")}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/${locale}/resume`} className="w-full">
                    <Button variant="outline" className="h-9 w-full cursor-pointer justify-center gap-2">
                      {tNav("resume")}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                {profile.personal.email && (
                  <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/25 p-3 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 text-primary" />
                    <a
                      href={`mailto:${profile.personal.email}`}
                      className="min-w-0 cursor-pointer break-all underline-offset-4 transition-colors hover:text-primary hover:underline"
                    >
                      {profile.personal.email}
                    </a>
                  </div>
                )}
              </section>

              <section className="rounded-lg border border-border/40 bg-muted/25 p-4">
                <h2 className="font-heading text-sm font-semibold">{t("bio")}</h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {bio}
                </p>
              </section>

              <section className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-lg border border-border/50 bg-card/50 p-4 transition-colors duration-200 hover:border-primary/25"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        {fact.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase text-muted-foreground">
                          {fact.label}
                        </p>
                        <p className="mt-1 text-sm font-semibold leading-snug text-foreground">
                          {fact.value}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              {/* <section className="space-y-4 rounded-lg border border-border/40 bg-card/50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-heading text-base font-semibold">{t("toolkit")}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{t("toolkitHint")}</p>
                  </div>
                  <Layers3 className="h-5 w-5 text-primary" />
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

                <div className="border-t border-border/40 pt-4">
                  <div className="flex flex-wrap gap-2">
                    {flattenedSkills.map((skill) => (
                      <Badge key={skill.name} variant="outline" className="border-border/60 bg-background/60">
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </section> */}
            </div>
          </aside>

          <main className="animate-fade-in space-y-8" style={{ animationDelay: "0.1s" }}>
            <section className="space-y-3">
              <Badge variant="outline" className="border-border/60 bg-background">
                {t("detailsEyebrow")}
              </Badge>
              <div className="max-w-3xl space-y-3">
                <h2 className="font-heading text-3xl font-bold leading-tight md:text-4xl">
                  {t("title")}
                </h2>
              </div>
            </section>

            <section className="space-y-5">
              <div
                role="tablist"
                aria-label={t("tabsLabel")}
                className="grid gap-3 rounded-lg border border-border/50 bg-muted/20 p-2 sm:grid-cols-2"
              >
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`about-${tab.id}-panel`}
                      id={`about-${tab.id}-tab`}
                      onClick={() => setActiveTab(tab.id)}
                      className={`cursor-pointer rounded-md border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                        isActive
                          ? "border-primary/30 bg-background text-foreground shadow-sm"
                          : "border-transparent text-muted-foreground hover:border-border/60 hover:bg-background/60 hover:text-foreground"
                      }`}
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span className="flex min-w-0 items-start gap-3">
                          <span
                            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors ${
                              isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {tab.icon}
                          </span>
                          <span className="min-w-0">
                            <span className="block font-heading text-base font-semibold leading-tight">
                              {tab.label}
                            </span>
                            <span className="mt-1 block text-sm leading-6">
                              {tab.description}
                            </span>
                          </span>
                        </span>
                        <span
                          className={`shrink-0 rounded-md border px-2 py-1 text-xs font-medium ${
                            isActive
                              ? "border-primary/20 bg-primary/10 text-primary"
                              : "border-border/50 bg-background/70"
                          }`}
                        >
                          {tab.meta}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {activeTab === "details" ? (
                <section
                  role="tabpanel"
                  id="about-details-panel"
                  aria-labelledby="about-details-tab"
                  className="animate-fade-in rounded-xl bg-linear-to-br from-primary/25 via-border/60 to-transparent p-px shadow-sm"
                >
                  <div className="rounded-[11px] border border-background/70 bg-card/80 px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] md:px-7 md:py-7">
                    {aboutMarkdown ? (
                      <div className="[&_h2:first-child]:mt-0 [&_h2]:text-2xl [&_h3]:text-xl [&_img]:mr-auto [&_img]:max-h-72 [&_img]:max-w-md [&_img]:object-contain [&_p]:text-muted-foreground [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_li]:text-sm [&_li]:leading-7 [&_li]:text-muted-foreground md:[&_li]:text-base">
                        <MarkdownRenderer content={aboutMarkdown} />
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">{t("detailsEmpty")}</p>
                    )}
                  </div>
                </section>
              ) : (
                <section
                  role="tabpanel"
                  id="about-links-panel"
                  aria-labelledby="about-links-tab"
                  className="animate-fade-in space-y-4"
                >
                  <div className="flex flex-col gap-3 border-b border-border/30 pb-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h3 className="font-heading text-2xl font-semibold">{t("linksTitle")}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{t("linksHint")}</p>
                    </div>
                    <Globe2 className="hidden h-5 w-5 text-primary sm:block" />
                  </div>

                  {links.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {links.map((link) => (
                        <FriendLinkCard key={link.url} link={link} />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-border/60 bg-muted/20 p-6 text-sm leading-7 text-muted-foreground">
                      {t("linksEmpty")}
                    </div>
                  )}
                </section>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

function FriendLinkCard({ link }: { link: FriendLink }) {
  const t = useTranslations("about");
  const host = getHostName(link.url);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex min-h-36 cursor-pointer flex-col justify-between rounded-lg border border-border/50 bg-card/50 p-4 transition-all duration-200 hover:border-primary/30 hover:bg-card/80 hover:shadow-sm"
    >
      <div className="flex items-start gap-3">
        <FriendLinkAvatar link={link} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h4 className="truncate font-heading text-base font-semibold transition-colors group-hover:text-primary">
              {link.name}
            </h4>
            <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
          </div>
          {link.category && (
            <Badge variant="outline" className="mt-2 border-border/60 bg-background/60 text-xs">
              {link.category}
            </Badge>
          )}
        </div>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">
        {link.description}
      </p>

      <div className="mt-4 flex items-center gap-2 border-t border-border/30 pt-3 text-xs text-muted-foreground">
        <Globe2 className="h-3.5 w-3.5 text-primary" />
        <span className="truncate">{host || t("linksVisit")}</span>
      </div>
    </a>
  );
}

function FriendLinkAvatar({ link }: { link: FriendLink }) {
  const fallbackAvatarUrl = getFallbackAvatarUrl(link.name);
  const [src, setSrc] = useState(link.avatar || fallbackAvatarUrl);

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border/50 bg-muted text-sm font-semibold text-muted-foreground">
      {src ? (
        <img
          src={src}
          alt={link.name}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => {
            setSrc(src !== fallbackAvatarUrl ? fallbackAvatarUrl : "");
          }}
        />
      ) : (
        link.name.charAt(0)
      )}
    </div>
  );
}

function getHostName(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function getFallbackAvatarUrl(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E8F4F5&color=358e98`;
}
