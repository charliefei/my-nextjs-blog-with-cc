"use client";

import { useLocale } from "next-intl";
import { CalendarDays, MapPin, Briefcase } from "lucide-react";
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
    <Card className="glass overflow-hidden animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-heading text-xl font-semibold">{work.position}</h3>
              {isCurrent && (
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  Current
                </Badge>
              )}
            </div>
            <p className="text-lg text-primary font-medium">{work.company}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            <span>
              {work.startDate} - {work.endDate || (locale === "zh" ? "至今" : "Present")}
            </span>
          </div>
          {work.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{work.location}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{work.content}</ReactMarkdown>
        </div>
        {work.technologies && work.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {work.technologies.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}