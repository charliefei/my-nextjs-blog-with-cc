import { setRequestLocale } from "next-intl/server";
import { getExperienceData } from "@/lib/experience";
import { ExperienceContent } from "@/components/experience/experience-content";

interface ExperiencePageProps {
  params: Promise<{ locale: string }>;
}

export default async function ExperiencePage({ params }: ExperiencePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { work, projects, skills } = getExperienceData(locale);

  return (
    <ExperienceContent work={work} projects={projects} skills={skills} />
  );
}