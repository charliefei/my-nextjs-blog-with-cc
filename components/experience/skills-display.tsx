"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SkillCategory } from "@/types/experience";

interface SkillsDisplayProps {
  skills: SkillCategory[];
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function SkillsDisplay({ skills }: SkillsDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {skills.map((category, index) => (
        <Card
          key={category.category}
          className="glass animate-fade-in hover:border-primary/30 transition-colors duration-200"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardHeader className="pb-2 p-5">
            <h3 className="font-heading text-base font-semibold">{category.category}</h3>
          </CardHeader>
          <CardContent className="space-y-3 p-5">
            {category.skills.map((skill) => (
              <div key={skill.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{skill.name}</span>
                  <span className="text-xs text-muted-foreground">{skill.level}%</span>
                </div>
                <ProgressBar value={skill.level} />
                {skill.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed">{skill.description}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}