"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  const t = useTranslations("notFound");
  const locale = useLocale();

  return (
    <div className="container mx-auto px-4 py-24 text-center space-y-8">
      <div className="animate-fade-in">
        <h1 className="font-heading text-6xl md:text-8xl font-bold gradient-text">
          404
        </h1>
      </div>
      <div className="space-y-4 animate-slide-up stagger-1">
        <h2 className="font-heading text-3xl font-semibold">{t("title")}</h2>
        <p className="text-muted-foreground text-lg">{t("description")}</p>
      </div>
      <div className="animate-slide-up stagger-2">
        <Link href={`/${locale}`}>
          <Button variant="default" size="lg" className="gap-2">
            <Home className="h-5 w-5" />
            {t("backHome")}
          </Button>
        </Link>
      </div>
    </div>
  );
}