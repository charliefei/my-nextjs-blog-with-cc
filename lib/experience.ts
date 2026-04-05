import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  WorkExperience,
  WorkFrontmatter,
  Project,
  ProjectFrontmatter,
  SkillCategory,
} from "@/types/experience";

const contentDirectory = path.join(process.cwd(), "content/experience");

// ==================== Work Experience ====================

export function getAllWorkExperiences(locale: string): WorkExperience[] {
  const workDirectory = path.join(contentDirectory, "work", locale);

  if (!fs.existsSync(workDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(workDirectory);

  const experiences = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(workDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        ...(data as WorkFrontmatter),
        slug,
        content,
      };
    })
    .sort((a, b) => a.order - b.order);

  return experiences;
}

export function getWorkExperienceBySlug(
  slug: string,
  locale: string
): WorkExperience | null {
  const workDirectory = path.join(contentDirectory, "work", locale);

  try {
    const fullPath = path.join(workDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      ...(data as WorkFrontmatter),
      slug,
      content,
    };
  } catch {
    return null;
  }
}

// ==================== Projects ====================

export function getAllProjects(locale: string): Project[] {
  const projectsDirectory = path.join(contentDirectory, "projects", locale);

  if (!fs.existsSync(projectsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(projectsDirectory);

  const projects = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(projectsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        ...(data as ProjectFrontmatter),
        slug,
        content,
      };
    })
    .sort((a, b) => a.order - b.order);

  return projects;
}

export function getFeaturedProjects(locale: string): Project[] {
  return getAllProjects(locale).filter((project) => project.featured);
}

export function getProjectBySlug(slug: string, locale: string): Project | null {
  const projectsDirectory = path.join(contentDirectory, "projects", locale);

  try {
    const fullPath = path.join(projectsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      ...(data as ProjectFrontmatter),
      slug,
      content,
    };
  } catch {
    return null;
  }
}

// ==================== Skills ====================

export function getSkills(locale: string): SkillCategory[] {
  const skillsPath = path.join(contentDirectory, "skills", `${locale}.json`);

  if (!fs.existsSync(skillsPath)) {
    // Fallback to English if locale file doesn't exist
    const fallbackPath = path.join(contentDirectory, "skills", "en.json");
    if (!fs.existsSync(fallbackPath)) {
      return [];
    }
    return JSON.parse(fs.readFileSync(fallbackPath, "utf8"));
  }

  return JSON.parse(fs.readFileSync(skillsPath, "utf8"));
}

// ==================== Combined ====================

export function getExperienceData(locale: string) {
  return {
    work: getAllWorkExperiences(locale),
    projects: getAllProjects(locale),
    skills: getSkills(locale),
  };
}