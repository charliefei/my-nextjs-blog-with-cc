"use client";

import { useTranslations, useLocale } from "next-intl";
import { ProfileConfig } from "@/types/profile";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Calendar, FileText } from "lucide-react";
import Link from "next/link";

interface ResumeContentProps {
  profile: ProfileConfig;
}

export function ResumeContent({ profile }: ResumeContentProps) {
  const t = useTranslations("resume");
  const locale = useLocale();

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-4 animate-fade-in">
        <h1 className="font-heading text-4xl font-bold">{t("title")}</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{t("lastUpdated", { date: profile.resume.lastUpdated })}</span>
        </div>
      </div>

      {/* Download Button */}
      <div className="animate-slide-up stagger-1">
        <Link href={profile.resume.pdfUrl} target="_blank" download>
          <Button variant="default" size="lg" className="gap-2">
            <Download className="h-5 w-5" />
            {t("download")}
          </Button>
        </Link>
      </div>

      {/* PDF Viewer Placeholder */}
      <Card className="animate-slide-up stagger-2 glass">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="font-medium">Resume Preview</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="aspect-[1/1.4] bg-muted/50 rounded-lg flex items-center justify-center border border-border">
            <div className="text-center space-y-4 p-8">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">
                PDF preview is loading...
              </p>
              <p className="text-sm text-muted-foreground">
                Please download the PDF to view the full resume, or add your PDF file to
                <code className="text-xs bg-muted px-1 rounded"> content/resume/resume.pdf</code>
              </p>
              <Link href={profile.resume.pdfUrl} target="_blank">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Open PDF
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card className="animate-slide-up stagger-3 glass">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <Link href={`/${locale}/about`} className="p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <h3 className="font-semibold">About Me</h3>
              <p className="text-sm text-muted-foreground">Learn more about my background</p>
            </Link>
            <Link href={`/${locale}/experience`} className="p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <h3 className="font-semibold">Experience</h3>
              <p className="text-sm text-muted-foreground">View my work history</p>
            </Link>
            <Link href={`/${locale}/blog`} className="p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <h3 className="font-semibold">Blog</h3>
              <p className="text-sm text-muted-foreground">Read my articles</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}