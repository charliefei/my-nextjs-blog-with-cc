"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LanguageSwitcher } from "./language-switcher";

const navItems = [
  { key: "home", href: "/" },
  { key: "blog", href: "/blog" },
  { key: "about", href: "/about" },
  { key: "resume", href: "/resume" },
  { key: "experience", href: "/experience" },
];

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 glass animate-fade-in">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="font-heading text-xl font-bold tracking-tight hover:opacity-80 transition-opacity"
        >
          <span className="gradient-text">Blog</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={`/${locale}${item.href}`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              className="md:hidden inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    href={`/${locale}${item.href}`}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t(item.key)}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}