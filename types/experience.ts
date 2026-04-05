// Experience content types

export interface WorkFrontmatter {
  type: "work";
  company: string;
  position: string;
  startDate: string;
  endDate?: string; // null means present
  location?: string;
  technologies?: string[];
  logo?: string;
  order: number; // for sorting
}

export interface WorkExperience extends WorkFrontmatter {
  slug: string;
  content: string;
}

export interface ProjectFrontmatter {
  type: "project";
  title: string;
  description: string;
  technologies: string[];
  github?: string;
  link?: string;
  image?: string;
  startDate?: string;
  endDate?: string;
  featured?: boolean;
  order: number;
}

export interface Project extends ProjectFrontmatter {
  slug: string;
  content: string;
}

export interface SkillCategory {
  category: string;
  skills: SkillItem[];
}

export interface SkillItem {
  name: string;
  level: number; // 0-100
  description?: string;
}