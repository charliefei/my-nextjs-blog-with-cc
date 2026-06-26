import Link from "next/link";

interface IconProps {
  className?: string;
}

export function GitHubIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export function TwitterIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="none"
      role="img"
    >
      <path
        fill="currentColor"
        d="M9.332 6.925 14.544 1h-1.235L8.783 6.145 5.17 1H1l5.466 7.78L1 14.993h1.235l4.78-5.433 3.816 5.433H15L9.332 6.925ZM7.64 8.848l-.554-.775L2.68 1.91h1.897l3.556 4.975.554.775 4.622 6.466h-1.897L7.64 8.848Z"
      ></path>
    </svg>
  );
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export function WebsiteIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

export function BilibiliIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* TV body */}
      <rect x="2" y="6" width="20" height="14" rx="3" ry="3" />
      {/* Screen area */}
      <rect x="5" y="9" width="14" height="8" rx="1" ry="1" />
      {/* Antenna left */}
      <path d="M7 3L9 6" />
      {/* Antenna right */}
      <path d="M17 3L15 6" />
      {/* Eyes */}
      <circle cx="9" cy="13" r="1" fill="currentColor" />
      <circle cx="15" cy="13" r="1" fill="currentColor" />
    </svg>
  );
}

export function YouTubeIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Play button in rounded rectangle */}
      <rect x="2" y="4" width="20" height="16" rx="4" ry="4" />
      {/* Play triangle */}
      <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Unified social icon mapping - single source of truth
export const SOCIAL_ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  github: GitHubIcon,
  twitter: TwitterIcon,
  linkedin: LinkedInIcon,
  email: MailIcon,
  website: WebsiteIcon,
  bilibili: BilibiliIcon,
  youtube: YouTubeIcon,
};

// Get icon component by platform name
export function getSocialIcon(
  platform: string,
): React.ComponentType<{ className?: string }> | null {
  return SOCIAL_ICON_MAP[platform] || null;
}

// Social link component - unified rendering
interface SocialLinkProps {
  platform: string;
  url: string;
  username?: string;
  className?: string;
  iconClassName?: string;
  variant?: "icon" | "card" | "button";
}

// Helper to render icon by platform name
function SocialIcon({
  platform,
  className,
}: {
  platform: string;
  className?: string;
}) {
  const iconComponent = SOCIAL_ICON_MAP[platform];
  if (!iconComponent) return null;
  const Icon = iconComponent;
  return <Icon className={className} />;
}

export function SocialLink({
  platform,
  url,
  username,
  className = "",
  iconClassName = "h-5 w-5",
  variant = "icon",
}: SocialLinkProps) {
  // Check if platform is supported
  if (!SOCIAL_ICON_MAP[platform]) return null;

  const baseLinkProps = {
    href: url,
    target: "_blank",
    rel: "noopener noreferrer",
  };

  if (variant === "icon") {
    return (
      <Link
        {...baseLinkProps}
        className={`text-muted-foreground hover:text-primary transition-colors ${className}`}
      >
        <SocialIcon platform={platform} className={iconClassName} />
        <span className="sr-only">{platform}</span>
      </Link>
    );
  }

  if (variant === "button") {
    return (
      <Link
        {...baseLinkProps}
        className={`h-9 w-9 rounded-full flex items-center justify-center border border-border/50 bg-background/50 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-200 ${className}`}
      >
        <SocialIcon platform={platform} className={iconClassName} />
        <span className="sr-only">{platform}</span>
      </Link>
    );
  }

  // card variant
  return (
    <Link
      {...baseLinkProps}
      className={`flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors group ${className}`}
    >
      <SocialIcon
        platform={platform}
        className={`${iconClassName} text-muted-foreground group-hover:text-primary transition-colors`}
      />
      <div className="flex-1">
        <p className="font-medium text-sm md:text-base capitalize">
          {platform}
        </p>
        {username && (
          <p className="text-xs md:text-sm text-muted-foreground">{username}</p>
        )}
      </div>
      <svg
        className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    </Link>
  );
}
