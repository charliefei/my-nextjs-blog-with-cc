export interface SocialLink {
  platform: "github" | "linkedin" | "twitter" | "email" | "website";
  url: string;
  username?: string;
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