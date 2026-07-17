"use client";

import { useTranslations } from "next-intl";
import { Briefcase, FolderGit2, Code2, Sparkles } from "lucide-react";
import { useState } from "react";
import { WorkExperience, Project, SkillCategory } from "@/types/experience";
import { WorkCard } from "@/components/experience/work-card";
import { ProjectCard } from "@/components/experience/project-card";
import { SkillsDisplay } from "@/components/experience/skills-display";
import { Badge } from "@/components/ui/badge";

interface ExperienceContentProps {
  work: WorkExperience[];
  projects: Project[];
  skills: SkillCategory[];
}

type TabType = "work" | "skills" | "projects";

export function ExperienceContent({ work, projects, skills }: ExperienceContentProps) {
  const t = useTranslations("experience");
  const [activeTab, setActiveTab] = useState<TabType>("work");

  const totalSkills = skills.reduce((acc, cat) => acc + cat.skills.length, 0);

  const tabs: { key: TabType; label: string; icon: React.ReactNode; meta: string }[] = [
    { key: "work", label: t("work"), icon: <Briefcase className="h-4 w-4" />, meta: `${work.length}` },
    { key: "skills", label: t("skills"), icon: <Code2 className="h-4 w-4" />, meta: `${totalSkills}` },
    { key: "projects", label: t("projects"), icon: <FolderGit2 className="h-4 w-4" />, meta: `${projects.length}` },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Ambient gradient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-105 bg-[radial-gradient(ellipse_60%_60%_at_30%_0%,oklch(0.7_0.12_190/0.16),transparent_70%),radial-gradient(ellipse_50%_50%_at_85%_5%,oklch(0.65_0.12_170/0.12),transparent_70%)]"
      />

      <div className="container mx-auto max-w-6xl px-6 py-8 md:py-12 lg:px-8 lg:py-16">
        {/* Header */}
        <header className="animate-slide-up mb-8 md:mb-10">
          <div className="flex flex-col gap-4">
            <Badge variant="outline" className="w-fit border-primary/20 bg-primary/5 text-primary">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              {t("eyebrow")}
            </Badge>
            <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
              <span className="gradient-text">{t("title")}</span>
            </h1>
            <p className="max-w-lg text-sm text-muted-foreground">
              {t("description")}
            </p>
          </div>
        </header>

        {/* Segmented tabs with sliding indicator */}
        <div className="animate-slide-up mb-8" style={{ animationDelay: "0.08s" }}>
          <div
            role="tablist"
            aria-label={t("tabsLabel")}
            className="relative grid w-full grid-cols-3 rounded-full border border-border/50 bg-muted/30 p-1 backdrop-blur-sm sm:max-w-md"
          >
            {/* Sliding active pill */}
            <span
              aria-hidden
              className={`pointer-events-none absolute inset-y-1 left-1 w-[calc(33.333%-0.25rem)] rounded-full bg-background shadow-sm ring-1 ring-border/50 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                activeTab === "skills" ? "translate-x-full" : activeTab === "projects" ? "translate-x-[200%]" : "translate-x-0"
              }`}
            />
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`experience-${tab.key}-panel`}
                  id={`experience-${tab.key}-tab`}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative z-10 flex cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
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
        </div>

        {/* Content */}
        <main className="animate-slide-up" style={{ animationDelay: "0.16s" }}>
          {/* Work Experience */}
          {activeTab === "work" && (
            <section
              key="work"
              role="tabpanel"
              id="experience-work-panel"
              aria-labelledby="experience-work-tab"
              className="animate-tab-left"
            >
              {work.length > 0 ? (
                <div className="relative space-y-6 pl-6 before:absolute before:left-2.75 before:top-2 before:bottom-2 before:w-px before:bg-border/50">
                  {work.map((item, index) => (
                    <WorkCard key={item.slug} work={item} index={index} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Briefcase className="h-10 w-10" />}
                  title={t("empty.work")}
                  description={t("empty.workHint")}
                />
              )}
            </section>
          )}

          {/* Skills */}
          {activeTab === "skills" && (
            <section
              key="skills"
              role="tabpanel"
              id="experience-skills-panel"
              aria-labelledby="experience-skills-tab"
              className="animate-tab-right"
            >
              {skills.length > 0 ? (
                <SkillsDisplay skills={skills} />
              ) : (
                <EmptyState
                  icon={<Code2 className="h-10 w-10" />}
                  title={t("empty.skills")}
                  description={t("empty.skillsHint")}
                />
              )}
            </section>
          )}

          {/* Projects */}
          {activeTab === "projects" && (
            <section
              key="projects"
              role="tabpanel"
              id="experience-projects-panel"
              aria-labelledby="experience-projects-tab"
              className="animate-tab-left"
            >
              {projects.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {projects.map((project, index) => (
                    <ProjectCard key={project.slug} project={project} index={index} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<FolderGit2 className="h-10 w-10" />}
                  title={t("empty.projects")}
                  description={t("empty.projectsHint")}
                />
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Empty State
   ────────────────────────────────────────────── */

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 px-6 py-16 text-center backdrop-blur-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border/50 bg-muted/40 text-muted-foreground/60">
        {icon}
      </div>
      <h2 className="mt-5 font-heading text-lg font-semibold tracking-tight">
        {title}
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
