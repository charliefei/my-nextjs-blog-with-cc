"use client";

import { useTranslations, useLocale } from "next-intl";
import { ProfileConfig } from "@/types/profile";
import { Button } from "@/components/ui/button";
import {
  Download,
  ExternalLink,
  ArrowRight,
  FileUser,
  FileText,
  Briefcase,
  Code2,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { getAssetPath } from "@/lib/utils";

interface ResumeContentProps {
  profile: ProfileConfig;
}

export function ResumeContent({ profile }: ResumeContentProps) {
  const t = useTranslations("resume");
  const locale = useLocale();
  const hasPdf = !!profile.resume.pdfUrl;

  return (
    <div className="relative min-h-screen">
      {/* Subtle ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.7_0.1_190/0.12),transparent)]"
      />

      <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-12 lg:px-8 lg:py-16">
        {/* Header */}
        <header className="animate-slide-up mb-8 md:mb-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 font-mono text-xs text-primary">
                <FileUser className="h-3.5 w-3.5" />
                {t("eyebrow")}
              </div>
              <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
                <span className="gradient-text">{t("title")}</span>
              </h1>
              <p className="mt-2 max-w-lg text-sm text-muted-foreground">
                {profile.personal.name} · {profile.personal.profession}
              </p>
            </div>

            {/* Action buttons */}
            {hasPdf && (
              <div className="flex items-center gap-2">
                <a
                  href={getAssetPath(profile.resume.pdfUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  <Button
                    size="sm"
                    className="group/btn h-9 cursor-pointer gap-2"
                  >
                    <Download className="h-4 w-4 transition-transform group-hover/btn:-translate-y-0.5" />
                    {t("download")}
                  </Button>
                </a>
                <a
                  href={getAssetPath(profile.resume.pdfUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 cursor-pointer gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {t("openInNewTab")}
                  </Button>
                </a>
              </div>
            )}
          </div>
        </header>

        {/* Main content */}
        <main className="animate-slide-up" style={{ animationDelay: "0.08s" }}>
          {hasPdf ? (
            <PdfViewer
              pdfUrl={getAssetPath(profile.resume.pdfUrl)}
              lastUpdated={profile.resume.lastUpdated}
              downloadLabel={t("download")}
              updatedLabel={t("lastUpdated", {
                date: profile.resume.lastUpdated,
              })}
            />
          ) : (
            <EmptyResume t={t} locale={locale} />
          )}
        </main>

        {/* Quick links */}
        <nav
          className="animate-slide-up mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 md:mt-10"
          style={{ animationDelay: "0.16s" }}
        >
          <QuickLink
            href={`/${locale}/about`}
            icon={<Code2 className="h-4 w-4" />}
            label={t("quickLinks.about")}
            description={t("quickLinks.aboutDesc")}
          />
          <QuickLink
            href={`/${locale}/experience`}
            icon={<Briefcase className="h-4 w-4" />}
            label={t("quickLinks.experience")}
            description={t("quickLinks.experienceDesc")}
          />
          <QuickLink
            href={`/${locale}/blog`}
            icon={<GraduationCap className="h-4 w-4" />}
            label={t("quickLinks.blog")}
            description={t("quickLinks.blogDesc")}
          />
        </nav>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   PDF Viewer
   ────────────────────────────────────────────── */

function PdfViewer({
  pdfUrl,
  lastUpdated,
  downloadLabel,
  updatedLabel,
}: {
  pdfUrl: string;
  lastUpdated: string;
  downloadLabel: string;
  updatedLabel: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/40 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-border/80 hover:shadow-md">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border/40 bg-muted/30 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-chart-4/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-primary/60" />
          </div>
          <span className="ml-2 font-mono text-xs text-muted-foreground">
            resume.pdf
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/60" />
            {updatedLabel}
          </span>
          <a
            href={pdfUrl}
            target="_blank"
            download
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Download className="h-3.5 w-3.5" />
            {downloadLabel}
          </a>
        </div>
      </div>

      {/* PDF embed */}
      <div
        className="w-full"
        style={{ height: "calc(100vh - 320px)", minHeight: "560px" }}
      >
        <iframe
          src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
          className="h-full w-full border-0"
          title="Resume PDF"
        />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Empty State — no PDF configured
   ────────────────────────────────────────────── */

function EmptyResume({
  t,
  locale,
}: {
  t: ReturnType<typeof useTranslations>;
  locale: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 px-6 py-16 text-center backdrop-blur-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border/50 bg-muted/40 text-muted-foreground/60">
        <FileText className="h-7 w-7" />
      </div>
      <h2 className="mt-5 font-heading text-lg font-semibold tracking-tight">
        {t("empty.title")}
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {t("empty.description")}
      </p>
      <Link
        href={`/${locale}/experience`}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
      >
        {t("empty.viewExperience")}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Shared small components
   ────────────────────────────────────────────── */

function QuickLink({
  href,
  icon,
  label,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <Link href={href} className="group">
      <div className="flex h-full items-center justify-between rounded-xl border border-border/50 bg-card/40 p-4 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card/60 hover:shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-muted/30 text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary">
            {icon}
          </div>
          <div>
            <div className="text-sm font-semibold transition-colors group-hover:text-primary">
              {label}
            </div>
            <div className="text-xs text-muted-foreground">{description}</div>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
    </Link>
  );
}
