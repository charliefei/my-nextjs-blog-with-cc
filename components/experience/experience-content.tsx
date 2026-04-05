"use client";

import { useTranslations } from "next-intl";
import { Briefcase, FolderGit2, Code2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WorkExperience, Project, SkillCategory } from "@/types/experience";
import { WorkCard } from "@/components/experience/work-card";
import { ProjectCard } from "@/components/experience/project-card";
import { SkillsDisplay } from "@/components/experience/skills-display";

interface ExperienceContentProps {
  work: WorkExperience[];
  projects: Project[];
  skills: SkillCategory[];
}

type TabType = "work" | "skills" | "projects";

export function ExperienceContent({ work, projects, skills }: ExperienceContentProps) {
  const t = useTranslations("experience");
  const [activeTab, setActiveTab] = useState<TabType>("work");

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: "work", label: t("work"), icon: <Briefcase className="h-4 w-4" /> },
    { key: "skills", label: t("skills"), icon: <Code2 className="h-4 w-4" /> },
    { key: "projects", label: t("projects"), icon: <FolderGit2 className="h-4 w-4" /> },
  ];

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-4 animate-fade-in">
        <h1 className="font-heading text-4xl font-bold">{t("title")}</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 animate-slide-up stagger-1 flex-wrap">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "default" : "outline"}
            onClick={() => setActiveTab(tab.key)}
            className="gap-2"
          >
            {tab.icon}
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Content */}
      <div className="animate-slide-up stagger-2">
        {/* Work Experience */}
        {activeTab === "work" && (
          <div className="space-y-6">
            {work.length > 0 ? (
              work.map((item, index) => (
                <WorkCard key={item.slug} work={item} index={index} />
              ))
            ) : (
              <Card className="glass p-8 text-center text-muted-foreground">
                <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No work experience found.</p>
                <p className="text-sm mt-2">Add markdown files to content/experience/work/</p>
              </Card>
            )}
          </div>
        )}

        {/* Skills */}
        {activeTab === "skills" && (
          skills.length > 0 ? (
            <SkillsDisplay skills={skills} />
          ) : (
            <Card className="glass p-8 text-center text-muted-foreground">
              <Code2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No skills data found.</p>
              <p className="text-sm mt-2">Add skills JSON to content/experience/skills/</p>
            </Card>
          )
        )}

        {/* Projects */}
        {activeTab === "projects" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <ProjectCard key={project.slug} project={project} index={index} />
              ))
            ) : (
              <Card className="glass p-8 text-center text-muted-foreground col-span-full">
                <FolderGit2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No projects found.</p>
                <p className="text-sm mt-2">Add markdown files to content/experience/projects/</p>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Import Card for empty states
import { Card } from "@/components/ui/card";