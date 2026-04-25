"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { SocialLink } from "@/components/icons/social-icons";
import { ProfileConfig } from "@/types/profile";

interface FooterProps {
  profile: ProfileConfig;
}

export function Footer({ profile }: FooterProps) {
  const t = useTranslations("footer");
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-card/50 animate-fade-in">
      <div className="container mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link
              href={`/${locale}`}
              className="font-heading text-xl font-bold tracking-tight"
            >
              <span className="gradient-text">{profile.personal.name}</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t("builtWith")}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            <Link
              href={`/${locale}/blog`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("nav.blog")}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("nav.about")}
            </Link>
            <Link
              href={`/${locale}/resume`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("nav.resume")}
            </Link>
          </nav>

          {/* Social */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">{t("nav.about")}</h3>
            <div className="flex gap-3">
              {profile.social.map((social) => (
                <SocialLink
                  key={social.platform}
                  platform={social.platform}
                  url={social.url}
                  variant="icon"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-border/20">
          <p className="text-center text-xs text-muted-foreground">
            {t("copyright", { year, name: profile.personal.name })}
          </p>
        </div>
      </div>
    </footer>
  );
}