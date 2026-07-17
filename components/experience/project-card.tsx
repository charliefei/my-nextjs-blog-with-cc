"use client";

import { ExternalLink, Star, Calendar } from "lucide-react";
import { GitHubIcon } from "@/components/icons/social-icons";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/types/experience";
import ReactMarkdown from "react-markdown";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const isFeatured = project.featured;

  return (
    <div
      className="group relative flex animate-fade-in flex-col overflow-hidden rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card/80 hover:shadow-md"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Featured badge */}
      {isFeatured && (
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1">
            <Star className="h-3 w-3 fill-primary" />
            Featured
          </Badge>
        </div>
      )}

      {/* Image */}
      {project.image && (
        <div className="aspect-video overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-heading text-base font-semibold transition-colors group-hover:text-primary">
            {project.title}
          </h3>
          <div className="flex gap-1.5 shrink-0">
            {project.github && (
              <Link
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
              >
                <GitHubIcon className="h-4 w-4" />
              </Link>
            )}
            {project.link && (
              <Link
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Date range */}
        {(project.startDate || project.endDate) && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            <Calendar className="h-3 w-3" />
            <span>
              {project.startDate}{project.endDate ? ` - ${project.endDate}` : ""}
            </span>
          </div>
        )}

        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{project.description}</p>

        <div className="prose-compact dark:prose-invert max-w-none flex-1 prose">
          <ReactMarkdown>{project.content}</ReactMarkdown>
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-border/30">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs px-2 py-0.5 tag-item">
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
