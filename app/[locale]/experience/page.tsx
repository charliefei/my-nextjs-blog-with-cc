import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getExperienceData } from "@/lib/experience";
import { ExperienceContent } from "@/components/experience/experience-content";
import { buildPageMetadata, type Locale } from "@/lib/seo";

interface ExperiencePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ExperiencePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.experience" });

  return buildPageMetadata({
    locale: locale as Locale,
    path: "/experience/",
    title: t("title"),
    description: t("description"),
  });
}

export default async function ExperiencePage({ params }: ExperiencePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { work, projects, skills } = getExperienceData(locale);

  return (
    <ExperienceContent work={work} projects={projects} skills={skills} />
  );
}
