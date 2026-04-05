import { setRequestLocale } from "next-intl/server";
import { getProfile } from "@/lib/profile";
import { AboutContent } from "@/components/about/about-content";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const profile = getProfile();

  return <AboutContent profile={profile} locale={locale} />;
}