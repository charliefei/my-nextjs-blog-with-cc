"use client";

import { useTranslations } from "next-intl";
import { CalendarDays, MapPin, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WorkExperience } from "@/types/experience";
import ReactMarkdown from "react-markdown";

interface WorkCardProps {
  work: WorkExperience;
  index: number;
}

export function WorkCard({ work, index }: WorkCardProps) {
  const t = useTranslations("experience");
  const isCurrent = !work.endDate;

  return (
    <div
      className="group relative animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Timeline dot */}
      <div className="absolute -left-6 top-6 z-10 flex h-5.75 w-5.75 items-center justify-center">
        <div
          className={`h-3 w-3 rounded-full border-2 transition-colors duration-300 ${
            isCurrent
              ? "border-primary bg-primary shadow-sm shadow-primary/30"
              : "border-border bg-background group-hover:border-primary/50"
          }`}
        />
      </div>

      {/* Card */}
      <div className="overflow-hidden rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/80 hover:shadow-md">
        {/* Header */}
        <div className="border-b border-border/40 bg-muted/30 px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="min-w-0 font-heading text-base font-semibold">{work.position}</h3>
                {isCurrent && (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs px-2 py-0.5">
                    {t("current")}
                  </Badge>
                )}
              </div>
              <div className="mt-1 flex min-w-0 items-center gap-2">
                <Building2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                <p className="min-w-0 truncate text-sm font-medium text-primary">{work.company}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-2">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>
                {work.startDate} - {work.endDate || t("present")}
              </span>
            </div>
            {work.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                <span>{work.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 p-5">
          <div className="prose-compact dark:prose-invert max-w-none">
            <ReactMarkdown>{work.content}</ReactMarkdown>
          </div>
          {work.technologies && work.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/30">
              {work.technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs px-2 py-0.5 tag-item">
                  {tech}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
