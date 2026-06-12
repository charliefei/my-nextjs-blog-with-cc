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
  Code2,
  ExternalLink,
  Globe2,
  Mail,
  MapPin,
  Sparkles,
  Terminal,
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

  const totalSkills = skills.reduce((acc, cat) => acc + cat.skills.length, 0);

  const tabs = [
    {
      id: "details" as const,
      label: t("bio"),
      icon: <BookOpenText className="h-4 w-4" />,
      meta: t("markdownLabel"),
    },
    {
      id: "links" as const,
      label: t("linksTitle"),
      icon: <Globe2 className="h-4 w-4" />,
      meta: t("linksCount", { count: links.length }),
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Ambient gradient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-105 bg-[radial-gradient(ellipse_60%_60%_at_30%_0%,oklch(0.7_0.12_190/0.16),transparent_70%),radial-gradient(ellipse_50%_50%_at_85%_5%,oklch(0.65_0.12_170/0.12),transparent_70%)]"
      />

      <div className="container mx-auto max-w-7xl px-6 py-8 md:py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[360px_1fr] lg:gap-12 xl:gap-16">
          <aside className="animate-slide-up lg:sticky lg:top-8 lg:self-start">
            {/* Developer name card — terminal chrome */}
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
                    ~/{profile.personal.name.toLowerCase().replace(/\s+/g, "-")}.card
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-medium text-primary">
                    <Terminal className="h-3 w-3" />
                    {t("eyebrow")}
                  </span>
                </div>

                {/* Body */}
                <div className="relative p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <div
                        aria-hidden
                        className="absolute -inset-1.5 rounded-full bg-linear-to-tr from-primary/40 via-accent/30 to-transparent opacity-70 blur-md transition-opacity duration-500 group-hover:opacity-100"
                      />
                      <Avatar className="relative h-20 w-20 ring-1 ring-border/50 ring-offset-4 ring-offset-background md:h-24 md:w-24">
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
                      <h1 className="gradient-text font-heading text-2xl font-bold leading-tight tracking-tight md:text-3xl">
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

                  {/* Mono prompt line + bio */}
                  <div className="mt-5 rounded-lg border border-border/40 bg-muted/30 px-3 py-2.5 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-primary">❯</span>
                      <span className="text-muted-foreground">whoami</span>
                      <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        <Code2 className="h-3 w-3" />
                        {t("stats.skillsValue", { count: totalSkills })}
                      </span>
                    </div>
                    <p className="mt-2 font-sans text-sm leading-7 text-muted-foreground">{bio}</p>
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

                  {/* Email */}
                  {profile.personal.email && (
                    <a
                      href={`mailto:${profile.personal.email}`}
                      className="group/mail mt-3 flex items-center gap-2 rounded-lg border border-border/50 bg-muted/25 p-2.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                    >
                      <Mail className="h-4 w-4 shrink-0 text-primary" />
                      <span className="min-w-0 break-all underline-offset-4 group-hover/mail:underline">
                        {profile.personal.email}
                      </span>
                    </a>
                  )}

                  {/* Actions */}
                  <div className="mt-5 flex flex-col gap-2 border-t border-border/30 pt-5">
                    <Link href={`/${locale}/experience`} className="w-full">
                      <Button className="group/btn h-9 w-full cursor-pointer justify-center gap-2">
                        {t("viewExperience")}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                      </Button>
                    </Link>
                    <Link href={`/${locale}/resume`} className="w-full">
                      <Button
                        variant="outline"
                        className="group/btn h-9 w-full cursor-pointer justify-center gap-2"
                      >
                        {tNav("resume")}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
          </aside>

          <main className="animate-slide-up space-y-8" style={{ animationDelay: "0.12s" }}>
            <section className="space-y-3">
              <Badge variant="outline" className="border-border/60 bg-background">
                {t("detailsEyebrow")}
              </Badge>
              <h2 className="font-heading text-3xl font-bold leading-tight md:text-4xl">
                <span className="gradient-text">{t("title")}</span>
              </h2>
            </section>

            <section className="space-y-6">
              {/* Sleek segmented tabs with sliding indicator */}
              <div
                role="tablist"
                aria-label={t("tabsLabel")}
                className="relative grid w-full grid-cols-2 rounded-full border border-border/50 bg-muted/30 p-1 backdrop-blur-sm sm:max-w-md"
              >
                {/* Sliding active pill */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-background shadow-sm ring-1 ring-border/50 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    activeTab === "links" ? "translate-x-full" : "translate-x-0"
                  }`}
                />
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
                      className={`relative z-10 flex cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span
                        className={`transition-colors duration-300 ${isActive ? "text-primary" : ""}`}
                      >
                        {tab.icon}
                      </span>
                      <span className="whitespace-nowrap">{tab.label}</span>
                      <span
                        className={`hidden rounded-full px-2 py-0.5 text-xs transition-colors duration-300 sm:inline ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "bg-muted/60 text-muted-foreground"
                        }`}
                      >
                        {tab.meta}
                      </span>
                    </button>
                  );
                })}
              </div>

              {activeTab === "details" ? (
                <section
                  key="details"
                  role="tabpanel"
                  id="about-details-panel"
                  aria-labelledby="about-details-tab"
                  className="animate-tab-left dev-card-border group relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 shadow-sm backdrop-blur-sm"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-accent/15 blur-3xl transition-opacity duration-500 group-hover:opacity-80"
                  />

                  {/* Header bar */}
                  <div className="relative flex items-center gap-2 border-b border-border/40 bg-muted/40 px-5 py-2.5">
                    <BookOpenText className="h-4 w-4 text-primary" />
                    <span className="font-mono text-xs text-muted-foreground">README.md</span>
                    <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-medium text-primary">
                      {t("markdownLabel")}
                    </span>
                  </div>

                  <div className="scrollbar-thin relative max-h-[calc(100vh-13rem)] overflow-y-auto overscroll-contain px-5 py-5 md:px-7 md:py-7">
                    {aboutMarkdown ? (
                      <div className="[&_a]:text-primary [&_a]:underline-offset-4 [&_h2:first-child]:mt-0 [&_h2]:bg-linear-to-r [&_h2]:from-foreground [&_h2]:to-foreground/70 [&_h2]:bg-clip-text [&_h2]:text-2xl [&_h3]:text-xl [&_img]:rounded-lg [&_img]:mr-auto [&_img]:max-h-72 [&_img]:max-w-md [&_img]:object-contain [&_img]:shadow-md [&_p]:text-muted-foreground [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_li]:text-sm [&_li]:leading-7 [&_li]:text-muted-foreground [&_li::marker]:text-primary/70 md:[&_li]:text-base">
                        <MarkdownRenderer content={aboutMarkdown} />
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">{t("detailsEmpty")}</p>
                    )}
                  </div>
                </section>
              ) : (
                <section
                  key="links"
                  role="tabpanel"
                  id="about-links-panel"
                  aria-labelledby="about-links-tab"
                  className="animate-tab-right space-y-4"
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
                      {links.map((link, index) => (
                        <FriendLinkCard key={link.url} link={link} index={index} />
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

function FriendLinkCard({ link, index }: { link: FriendLink; index: number }) {
  const t = useTranslations("about");
  const host = getHostName(link.url);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ animationDelay: `${index * 0.05}s` }}
      className="group animate-fade-in flex min-h-36 cursor-pointer flex-col justify-between rounded-xl border border-border/50 bg-card/50 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card/80 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <FriendLinkAvatar link={link} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h4 className="truncate font-heading text-base font-semibold transition-colors group-hover:text-primary">
              {link.name}
            </h4>
            <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
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
