"use client";

import { SkillCategory } from "@/types/experience";
import {
  Server,
  Monitor,
  Database,
  Wrench,
  Code2,
  Layers,
} from "lucide-react";

interface SkillsDisplayProps {
  skills: SkillCategory[];
}

// Map category names to icons (works for both EN and ZH)
function getCategoryIcon(category: string) {
  const lower = category.toLowerCase();
  if (lower.includes("后端") || lower.includes("backend") || lower.includes("server")) {
    return <Server className="h-5 w-5" />;
  }
  if (lower.includes("前端") || lower.includes("frontend") || lower.includes("client")) {
    return <Monitor className="h-5 w-5" />;
  }
  if (lower.includes("数据库") || lower.includes("database") || lower.includes("data")) {
    return <Database className="h-5 w-5" />;
  }
  if (lower.includes("运维") || lower.includes("工具") || lower.includes("devops") || lower.includes("tool")) {
    return <Wrench className="h-5 w-5" />;
  }
  if (lower.includes("框架") || lower.includes("framework")) {
    return <Layers className="h-5 w-5" />;
  }
  return <Code2 className="h-5 w-5" />;
}

function getLevelLabel(level: number): string {
  if (level >= 95) return "Expert";
  if (level >= 85) return "Advanced";
  if (level >= 70) return "Intermediate";
  return "Beginner";
}

function SkillBar({ value }: { value: number }) {
  return (
    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted/80">
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-primary/80 to-primary transition-all duration-700 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function SkillsDisplay({ skills }: SkillsDisplayProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {skills.map((category, index) => (
        <div
          key={category.category}
          className="group animate-fade-in overflow-hidden rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/80 hover:shadow-md"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Category header */}
          <div className="flex min-w-0 items-center gap-3 border-b border-border/40 bg-muted/30 px-5 py-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-background/60 text-muted-foreground transition-colors duration-300 group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary">
              {getCategoryIcon(category.category)}
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-heading text-sm font-semibold">{category.category}</h3>
              <p className="text-xs text-muted-foreground">
                {category.skills.length} {category.skills.length === 1 ? "skill" : "skills"}
              </p>
            </div>
          </div>

          {/* Skills list */}
          <div className="space-y-3.5 p-5">
            {category.skills.map((skill) => (
              <div key={skill.name} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="min-w-0 truncate text-sm font-medium">{skill.name}</span>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {getLevelLabel(skill.level)}
                    </span>
                    <span className="rounded-full bg-muted/60 px-2 py-0.5 text-xs font-mono text-muted-foreground">
                      {skill.level}%
                    </span>
                  </div>
                </div>
                <SkillBar value={skill.level} />
                {skill.description && (
                  <p className="text-xs leading-relaxed text-muted-foreground">{skill.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
