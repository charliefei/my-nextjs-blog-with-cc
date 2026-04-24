"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Menu, Home, FileText, User, Star } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { getAssetPath, cn } from "@/lib/utils";

const navItems = [
  { key: "home", href: "/" },
  { key: "blog", href: "/blog" },
  { key: "about", href: "/about" },
  { key: "resume", href: "/resume" },
  { key: "experience", href: "/experience" },
];

const navIconMap: Record<string, React.ElementType> = {
  home: Home,
  blog: FileText,
  about: User,
  resume: FileText,
  experience: Star,
};

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 glass animate-fade-in">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <img src={getAssetPath("/logo.png")} alt="Logo" className="h-8 w-8 object-contain" />
          <span className="font-heading text-xl font-bold tracking-tight">Charlie Fei&apos;s Blog</span>
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
            <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[380px] p-0" showCloseButton={false}>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <img src={getAssetPath("/logo.png")} alt="Logo" className="h-8 w-8 object-contain" />
                  <span className="font-heading text-lg font-bold tracking-tight">Charlie Fei</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center rounded-md h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  <span className="sr-only">Close menu</span>
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 flex flex-col gap-1 px-3 py-6 overflow-y-auto">
                {navItems.map((item, index) => {
                  const Icon = navIconMap[item.key];
                  const isActive =
                    item.href === "/"
                      ? pathname === `/${locale}` || pathname === `/${locale}/`
                      : pathname.startsWith(`/${locale}${item.href}`);
                  return (
                    <Link
                      key={item.key}
                      href={`/${locale}${item.href}`}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "relative flex items-center gap-3.5 px-4 py-3 rounded-lg text-[15px] font-medium",
                        "transition-all duration-200 ease-out",
                        "hover:bg-accent/10 hover:text-foreground hover:translate-x-0.5",
                        "animate-slide-up opacity-0",
                        isActive
                          ? "text-foreground bg-accent/5 font-semibold"
                          : "text-muted-foreground"
                      )}
                      style={{
                        animationDelay: `${0.1 + index * 0.06}s`,
                        animationFillMode: "forwards",
                      }}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-primary" />
                      )}
                      {Icon && <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={isActive ? 2.25 : 1.75} />}
                      {t(item.key)}
                    </Link>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="mt-auto px-6 py-4 border-t border-border/40">
                <p className="text-xs text-muted-foreground">
                  &copy; {new Date().getFullYear()} Charlie Fei
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}