export interface SocialLink {
  platform: "github" | "linkedin" | "twitter" | "email" | "website";
  url: string;
  username?: string;
}

export interface Skill {
  name: string;
  level: number;
  category: string;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
  image?: string;
  startDate?: string;
  endDate?: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies?: string[];
  location?: string;
}

export interface ProfileConfig {
  personal: {
    name: string;
    avatar: string;
    profession: string;
    jobStatus: {
      openToWork: boolean;
      availableFor?: ("full-time" | "part-time" | "freelance" | "contract")[];
    };
    bio: {
      en: string;
      zh: string;
    };
    location: string;
    email?: string;
  };
  social: SocialLink[];
  skills: Skill[];
  projects: Project[];
  experience: WorkExperience[];
  resume: {
    pdfUrl: string;
    lastUpdated: string;
  };
  theme: {
    primaryColor: string;
    accentColor: string;
  };
  comments?: {
    giscus?: {
      repo: string;
      repoId: string;
      categoryId: string;
      mapping?: "pathname" | "url" | "title" | "og:title";
    };
  };
}