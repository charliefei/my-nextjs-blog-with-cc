"use client";

import { useTranslations, useLocale } from "next-intl";
import { ProfileConfig } from "@/types/profile";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Briefcase, FolderGit2, ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/icons/social-icons";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

// Simple progress component
function ProgressDemo({ value }: { value: number }) {
  return (
    <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

interface ExperienceContentProps {
  profile: ProfileConfig;
}

export function ExperienceContent({ profile }: ExperienceContentProps) {
  const t = useTranslations("experience");
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<"skills" | "projects" | "work">("work");

  const skillsByCategory = profile.skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, typeof profile.skills>
  );

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-4 animate-fade-in">
        <h1 className="font-heading text-4xl font-bold">{t("title")}</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 animate-slide-up stagger-1">
        <Button
          variant={activeTab === "work" ? "default" : "outline"}
          onClick={() => setActiveTab("work")}
          className="gap-2"
        >
          <Briefcase className="h-4 w-4" />
          {t("work")}
        </Button>
        <Button
          variant={activeTab === "skills" ? "default" : "outline"}
          onClick={() => setActiveTab("skills")}
          className="gap-2"
        >
          {t("skills")}
        </Button>
        <Button
          variant={activeTab === "projects" ? "default" : "outline"}
          onClick={() => setActiveTab("projects")}
          className="gap-2"
        >
          <FolderGit2 className="h-4 w-4" />
          {t("projects")}
        </Button>
      </div>

      {/* Work Experience */}
      {activeTab === "work" && (
        <div className="space-y-6 animate-slide-up stagger-2">
          {profile.experience.map((exp, index) => (
            <Card key={index} className="glass overflow-hidden animate-fade-in stagger-1">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-xl font-semibold">{exp.position}</h3>
                      {index === 0 && !exp.endDate && (
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="text-lg text-primary">{exp.company}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        <span>
                          {exp.startDate} - {exp.endDate || t("present")}
                        </span>
                      </div>
                      {exp.location && <span>• {exp.location}</span>}
                    </div>
                    <p className="text-muted-foreground mt-2">{exp.description}</p>
                    {exp.technologies && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {exp.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Skills */}
      {activeTab === "skills" && (
        <div className="space-y-6 animate-slide-up stagger-2">
          {Object.entries(skillsByCategory).map(([category, skills]) => (
            <Card key={category} className="glass">
              <CardHeader>
                <h3 className="font-heading text-xl font-semibold">{category}</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                    </div>
                    <ProgressDemo value={skill.level} />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Projects */}
      {activeTab === "projects" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up stagger-2">
          {profile.projects.map((project, index) => (
            <Card key={index} className="glass overflow-hidden animate-fade-in stagger-1">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-heading text-xl font-semibold">{project.title}</h3>
                  <div className="flex gap-2">
                    {project.github && (
                      <Link
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <GitHubIcon className="h-5 w-5" />
                      </Link>
                    )}
                    {project.link && (
                      <Link
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </Link>
                    )}
                  </div>
                </div>
                <p className="text-muted-foreground">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}