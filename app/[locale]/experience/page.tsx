import { setRequestLocale } from "next-intl/server";
import { getProfile } from "@/lib/profile";
import { ExperienceContent } from "@/components/experience/experience-content";

interface ExperiencePageProps {
  params: Promise<{ locale: string }>;
}

export default async function ExperiencePage({ params }: ExperiencePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const profile = getProfile();

  return <ExperienceContent profile={profile} />;
}