import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProfile } from "@/lib/profile";
import { ResumeContent } from "@/components/resume/resume-content";
import { buildPageMetadata, type Locale } from "@/lib/seo";

interface ResumePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ResumePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.resume" });

  return buildPageMetadata({
    locale: locale as Locale,
    path: "/resume/",
    title: t("title"),
    description: t("description"),
  });
}

export default async function ResumePage({ params }: ResumePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const profile = getProfile();

  return <ResumeContent profile={profile} />;
}
