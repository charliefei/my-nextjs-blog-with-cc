import { routing } from "@/i18n/routing";
import { getAboutMarkdown } from "@/lib/about";
import {
  getAllProjects,
  getAllWorkExperiences,
  getSkills,
} from "@/lib/experience";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { getProfile } from "@/lib/profile";
import { getAbsoluteUrl, getSiteUrl } from "@/lib/site";
import type { Post } from "@/types/post";

type Locale = (typeof routing.locales)[number];

const SITE_TITLE = "Charlie Fei's Blog";
const SITE_DESCRIPTION =
  "A bilingual personal blog by Charlie Fei about full-stack development, AI coding, projects, work experience, and personal writing.";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  zh: "Chinese",
};

function normalizeText(value: string): string {
  return value.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}

function mdText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\[/g, "\\[").replace(/\]/g, "\\]");
}

function mdLink(title: string, url: string, description?: string): string {
  const suffix = description ? `: ${description}` : "";
  return `- [${mdText(title)}](${url})${suffix}`;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toISOString().slice(0, 10);
}

function getLocalePath(locale: Locale, path = "/"): string {
  const normalizedPath = path === "/" ? "/" : `/${path.replace(/^\/+/, "")}`;
  return `/${locale}${normalizedPath}`;
}

function getPostItems(locale: Locale) {
  return getAllPosts(locale)
    .map((post) => getPostBySlug(post.slug, locale))
    .filter((post): post is Post => Boolean(post));
}

function renderLocaleLinks(locale: Locale): string[] {
  const label = LOCALE_LABELS[locale];
  const posts = getAllPosts(locale);

  return [
    mdLink(`${label} home`, getSiteUrl(getLocalePath(locale))),
    mdLink(`${label} blog index`, getSiteUrl(getLocalePath(locale, "/blog/"))),
    mdLink(`${label} about`, getSiteUrl(getLocalePath(locale, "/about/"))),
    mdLink(
      `${label} experience`,
      getSiteUrl(getLocalePath(locale, "/experience/"))
    ),
    mdLink(`${label} resume`, getSiteUrl(getLocalePath(locale, "/resume/"))),
    mdLink(`${label} RSS feed`, getSiteUrl(getLocalePath(locale, "/rss.xml"))),
    ...posts.map((post) =>
      mdLink(
        `${label} post: ${post.title}`,
        getSiteUrl(getLocalePath(locale, `/blog/${post.slug}/`)),
        post.description
      )
    ),
  ];
}

function renderProfileSummary(): string {
  const profile = getProfile();
  const socialLinks = profile.social
    .map((link) => mdLink(link.platform, link.url, link.username))
    .join("\n");

  return [
    `- Name: ${profile.personal.name}`,
    `- Profession: ${profile.personal.profession}`,
    `- Location: ${profile.personal.location}`,
    `- Open to work: ${profile.personal.jobStatus.openToWork ? "yes" : "no"}`,
    `- Resume PDF: ${getAbsoluteUrl(profile.resume.pdfUrl)} (last updated ${profile.resume.lastUpdated})`,
    "",
    "### Social Links",
    socialLinks,
  ].join("\n");
}

function renderPostContent(locale: Locale): string {
  const label = LOCALE_LABELS[locale];
  const posts = getPostItems(locale);

  if (posts.length === 0) {
    return `### ${label} Blog Posts\n\nNo published posts.`;
  }

  const renderedPosts = posts.map((post) => {
    const tags = [post.category, ...post.tags].filter(Boolean).join(", ");
    const postUrl = getSiteUrl(getLocalePath(locale, `/blog/${post.slug}/`));

    return [
      `#### ${post.title}`,
      "",
      `- URL: ${postUrl}`,
      `- Date: ${formatDate(post.date)}`,
      `- Author: ${post.author}`,
      `- Tags: ${tags}`,
      `- Description: ${post.description}`,
      "",
      normalizeText(post.content),
    ].join("\n");
  });

  return [`### ${label} Blog Posts`, "", ...renderedPosts].join("\n\n");
}

function renderExperienceContent(locale: Locale): string {
  const label = LOCALE_LABELS[locale];
  const work = getAllWorkExperiences(locale);
  const projects = getAllProjects(locale);
  const skills = getSkills(locale);

  const renderedWork =
    work.length > 0
      ? work
          .map((item) =>
            [
              `#### ${item.position} at ${item.company}`,
              "",
              `- Dates: ${item.startDate} - ${item.endDate || "Present"}`,
              item.location ? `- Location: ${item.location}` : undefined,
              item.technologies?.length
                ? `- Technologies: ${item.technologies.join(", ")}`
                : undefined,
              "",
              normalizeText(item.content),
            ]
              .filter(Boolean)
              .join("\n")
          )
          .join("\n\n")
      : "No work experience entries.";

  const renderedProjects =
    projects.length > 0
      ? projects
          .map((project) =>
            [
              `#### ${project.title}`,
              "",
              `- Description: ${project.description}`,
              `- Technologies: ${project.technologies.join(", ")}`,
              project.github ? `- GitHub: ${project.github}` : undefined,
              project.link ? `- Link: ${project.link}` : undefined,
              "",
              normalizeText(project.content),
            ]
              .filter(Boolean)
              .join("\n")
          )
          .join("\n\n")
      : "No project entries.";

  return [
    `### ${label} Work Experience`,
    "",
    renderedWork,
    "",
    `### ${label} Projects`,
    "",
    renderedProjects,
    "",
    `### ${label} Skills`,
    "",
    "```json",
    JSON.stringify(skills, null, 2),
    "```",
  ].join("\n");
}

function renderLocaleFull(locale: Locale): string {
  const label = LOCALE_LABELS[locale];
  const about = normalizeText(getAboutMarkdown(locale));

  return [
    `## ${label} Content`,
    "",
    `### ${label} About`,
    "",
    `- URL: ${getSiteUrl(getLocalePath(locale, "/about/"))}`,
    "",
    about || "No about content.",
    "",
    renderPostContent(locale),
    "",
    renderExperienceContent(locale),
  ].join("\n");
}

export function generateLlmsTxt(): string {
  const sections = [
    `# ${SITE_TITLE}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "This file lists the most useful machine-readable entry points for LLMs. The complete text export is linked below.",
    "",
    "## Primary",
    "",
    mdLink("Full LLM text export", getSiteUrl("/llms-full.txt")),
    mdLink("Home", getSiteUrl("/")),
    mdLink("RSS feed", getSiteUrl("/rss.xml")),
    "",
    "## Content",
    "",
    ...routing.locales.flatMap((locale) => renderLocaleLinks(locale as Locale)),
    "",
    "## About The Author",
    "",
    renderProfileSummary(),
  ];

  return `${sections.join("\n")}\n`;
}

export function generateLlmsFullTxt(): string {
  const sections = [
    `# ${SITE_TITLE}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "This is the complete LLM-oriented text export for Charlie Fei's Blog. It is generated at build time from the local Markdown and JSON content sources.",
    "",
    "## Canonical Links",
    "",
    mdLink("Concise llms.txt", getSiteUrl("/llms.txt")),
    mdLink("Home", getSiteUrl("/")),
    mdLink("RSS feed", getSiteUrl("/rss.xml")),
    "",
    "## Site Profile",
    "",
    renderProfileSummary(),
    "",
    ...routing.locales.map((locale) => renderLocaleFull(locale as Locale)),
  ];

  return `${sections.join("\n")}\n`;
}
