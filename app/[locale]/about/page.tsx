import { setRequestLocale } from "next-intl/server";
import { getProfile } from "@/lib/profile";
import { getSkills } from "@/lib/experience";
import { getAboutMarkdown } from "@/lib/about";
import { getFriendLinks } from "@/lib/links";
import { AboutContent } from "@/components/about/about-content";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const profile = getProfile();
  const skills = getSkills(locale);
  const aboutMarkdown = getAboutMarkdown(locale);
  const links = getFriendLinks();

  return (
    <AboutContent
      profile={profile}
      locale={locale}
      skills={skills}
      aboutMarkdown={aboutMarkdown}
      links={links}
    />
  );
}
