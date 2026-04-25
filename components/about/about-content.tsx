"use client";

import { useTranslations } from "next-intl";
import { ProfileConfig } from "@/types/profile";
import { SkillCategory } from "@/types/experience";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Sparkles } from "lucide-react";
import { SocialLink } from "@/components/icons/social-icons";
import Link from "next/link";

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
  const bio = locale === "zh" ? profile.personal.bio.zh : profile.personal.bio.en;

  // Flatten skills from all categories for preview
  const flattenedSkills = skills.flatMap(cat => cat.skills).slice(0, 8);

  return (
    <div className="container mx-auto px-6 lg:px-8 py-8 md:py-12 space-y-6 md:space-y-8 max-w-4xl">
      {/* Header */}
      <div className="space-y-3 md:space-y-4 animate-fade-in">
        <h1 className="font-heading text-3xl md:text-4xl font-bold">{t("title")}</h1>
      </div>

      {/* Profile Card */}
      <Card className="overflow-hidden animate-slide-up stagger-1 glass">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-primary/20 ring-offset-4 ring-offset-background animate-scale-in">
              <AvatarImage src={profile.personal.avatar} alt={profile.personal.name} />
              <AvatarFallback className="text-3xl md:text-4xl font-bold">
                {profile.personal.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-3 md:space-y-4 text-center md:text-left">
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold">{profile.personal.name}</h2>
                <p className="text-lg md:text-xl text-muted-foreground">{profile.personal.profession}</p>
              </div>
              {profile.personal.jobStatus.openToWork && (
                <Badge variant="outline" className="gap-1 bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="h-3 w-3" />
                  Open to work
                </Badge>
              )}
              <div className="flex items-center gap-2 text-muted-foreground justify-center md:justify-start text-sm md:text-base">
                <MapPin className="h-4 w-4" />
                <span>{t("location")}: {profile.personal.location}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bio Section */}
      <Card className="animate-slide-up stagger-2 glass">
        <CardHeader>
          <h3 className="font-heading text-xl md:text-2xl font-semibold">{t("bio")}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">{bio}</p>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="animate-slide-up stagger-3 glass">
        <CardHeader>
          <h3 className="font-heading text-xl md:text-2xl font-semibold">{t("social")}</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {profile.social.map((social) => (
              <SocialLink
                key={social.platform}
                platform={social.platform}
                url={social.url}
                username={social.username}
                variant="card"
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills Preview */}
      <Card className="animate-slide-up stagger-4 glass">
        <CardHeader>
          <h3 className="font-heading text-xl md:text-2xl font-semibold">{tNav("experience")}</h3>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {flattenedSkills.map((skill) => (
              <Badge key={skill.name} variant="secondary" className="px-3 py-1 text-sm tag-item">
                {skill.name}
              </Badge>
            ))}
          </div>
          <div className="mt-4">
            <Link href={`/${locale}/experience`} className="text-sm md:text-base text-primary hover:underline">
              View full experience →
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}