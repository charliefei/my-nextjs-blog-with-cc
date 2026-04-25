"use client";

import { ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/icons/social-icons";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/types/experience";
import ReactMarkdown from "react-markdown";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <Card
      className="glass overflow-hidden group hover:border-primary/30 transition-colors duration-200 animate-fade-in h-full flex flex-col cursor-pointer"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {project.image && (
        <div className="aspect-video overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-heading text-base font-semibold group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <div className="flex gap-1.5 ml-2 shrink-0">
            {project.github && (
              <Link
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <GitHubIcon className="h-4 w-4" />
              </Link>
            )}
            {project.link && (
              <Link
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{project.description}</p>
        <div className="prose-compact dark:prose-invert max-w-none flex-1">
          <ReactMarkdown>{project.content}</ReactMarkdown>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border/50">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs px-2 py-0.5 tag-item">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}