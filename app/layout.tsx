import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getSiteUrl } from "@/lib/site";
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
  title: {
    template: "%s | Charlie's Personal Blog",
    default: "Charlie's Personal Blog",
  },
  description: "A personal blog of Charlie, for publishing Charlie's blog posts, introducing Charlie's personal resume, and viewing Charlie's CV.",
  alternates: {
    types: {
      "application/rss+xml": [
        { title: "Charlie's Personal Blog RSS", url: "/rss.xml" },
        { title: "Charlie's Personal Blog English RSS", url: "/en/rss.xml" },
        { title: "Charlie's Personal Blog Chinese RSS", url: "/zh/rss.xml" },
      ],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
