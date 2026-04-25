"use client";

import { useLocale } from "next-intl";
import { CalendarDays, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkExperience } from "@/types/experience";
import ReactMarkdown from "react-markdown";

interface WorkCardProps {
  work: WorkExperience;
  index: number;
}

export function WorkCard({ work, index }: WorkCardProps) {
  const locale = useLocale();
  const isCurrent = !work.endDate;

  return (
    <Card
      className="glass overflow-hidden animate-fade-in cursor-pointer hover:border-primary/30 transition-colors duration-200"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardHeader className="pb-2 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-heading text-base font-semibold">{work.position}</h3>
              {isCurrent && (
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs px-2 py-0.5">
                  Current
                </Badge>
              )}
            </div>
            <p className="text-sm text-primary font-medium">{work.company}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1.5">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>
              {work.startDate} - {work.endDate || (locale === "zh" ? "至今" : "Present")}
            </span>
          </div>
          {work.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{work.location}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-5 pt-0">
        <div className="prose-compact dark:prose-invert max-w-none">
          <ReactMarkdown>{work.content}</ReactMarkdown>
        </div>
        {work.technologies && work.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {work.technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs px-2 py-0.5 tag-item">
                {tech}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}