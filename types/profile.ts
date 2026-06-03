export interface SocialLink {
  platform: "github" | "linkedin" | "twitter" | "email" | "website";
  url: string;
  username?: string;
}

export interface GiscusConfig {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping?: "pathname" | "url" | "title" | "og:title" | "specific" | "number";
  strict?: "0" | "1";
  reactionsEnabled?: "0" | "1";
  emitMetadata?: "0" | "1";
  inputPosition?: "top" | "bottom";
  theme?: string;
  lang?: string;
  loading?: "lazy" | "eager";
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
    giscus?: GiscusConfig;
  };
}
