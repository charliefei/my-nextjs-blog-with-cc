import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getAbsoluteUrl, getSiteUrl } from "@/lib/site";
import { DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl("/")),
  applicationName: SITE_NAME,
  title: {
    template: `%s | ${SITE_NAME}`,
    default: SITE_NAME,
  },
  description:
    "Charlie Fei's personal blog for full-stack development writing, AI coding notes, projects, resume, and professional experience.",
  authors: [{ name: "Charlie Fei", url: getSiteUrl("/") }],
  creator: "Charlie Fei",
  publisher: "Charlie Fei",
  category: "technology",
  keywords: [
    "Charlie Fei",
    "personal blog",
    "full stack developer",
    "AI coding",
    "frontend development",
    "Next.js",
    "TypeScript",
  ],
  alternates: {
    types: {
      "application/rss+xml": [
        { title: `${SITE_NAME} RSS`, url: getSiteUrl("/rss.xml") },
        { title: `${SITE_NAME} English RSS`, url: getSiteUrl("/en/rss.xml") },
        { title: `${SITE_NAME} Chinese RSS`, url: getSiteUrl("/zh/rss.xml") },
      ],
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description:
      "Full-stack development writing, AI coding notes, projects, resume, and professional experience by Charlie Fei.",
    url: getSiteUrl("/"),
    images: [
      {
        url: getAbsoluteUrl(DEFAULT_OG_IMAGE),
        width: 1638,
        height: 1638,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "Full-stack development writing, AI coding notes, projects, resume, and professional experience by Charlie Fei.",
    images: [getAbsoluteUrl(DEFAULT_OG_IMAGE)],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params?: Promise<{ locale?: string }>;
}>) {
  const locale = (await params)?.locale;
  const htmlLang = locale === "zh" ? "zh-CN" : "en-US";

  return (
    <html
      lang={htmlLang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
