import { Github, Instagram, Linkedin, Youtube } from 'lucide-react';

import { cn } from '@/lib/utils';

export function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn('h-4 w-4', className)}>
      <path
        fill="currentColor"
        d="M12 1.5a10.5 10.5 0 1 0 0 21a10.5 10.5 0 0 0 0-21m4.8 15.15a.75.75 0 0 1-1.03.25c-2.82-1.72-6.36-2.1-10.5-1.13a.75.75 0 1 1-.35-1.46c4.54-1.08 8.48-.65 11.63 1.28a.75.75 0 0 1 .25 1.03m1.47-2.95a.94.94 0 0 1-1.29.31c-3.23-1.99-8.15-2.57-11.97-1.4a.94.94 0 1 1-.56-1.79c4.37-1.33 9.81-.69 13.52 1.59c.44.27.58.84.3 1.29m.13-3.07C14.53 8.3 8.17 8.07 4.48 9.2a1.13 1.13 0 1 1-.66-2.16c4.24-1.29 11.3-1.04 15.76 1.6a1.13 1.13 0 0 1-1.17 1.99"
      />
    </svg>
  );
}

export function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn('h-4 w-4', className)}>
      <path
        fill="currentColor"
        d="M15.88 3c.24 1.9 1.36 3.26 3.12 3.9v2.5a6.13 6.13 0 0 1-3.1-1v5.7c0 3.57-2.6 6.1-6.05 6.1A5.97 5.97 0 0 1 3.8 14.2a5.98 5.98 0 0 1 6.05-5.98c.32 0 .63.02.93.08v2.86a3.1 3.1 0 0 0-.93-.15 3.13 3.13 0 0 0-3.16 3.19 3.12 3.12 0 0 0 3.16 3.18c1.83 0 3.14-1.34 3.14-3.26V3h2.9Z"
      />
    </svg>
  );
}

export function SocialIcon({
  name,
  className
}: {
  name: string;
  className?: string;
}) {
  const iconClassName = cn('h-4 w-4', className);

  switch (name) {
    case 'github':
      return <Github className={iconClassName} aria-hidden="true" />;
    case 'linkedin':
      return <Linkedin className={iconClassName} aria-hidden="true" />;
    case 'youtube':
      return <Youtube className={iconClassName} aria-hidden="true" />;
    case 'spotify':
      return <SpotifyIcon className={iconClassName} />;
    case 'instagram':
      return <Instagram className={iconClassName} aria-hidden="true" />;
    case 'tiktok':
      return <TikTokIcon className={iconClassName} />;
    default:
      return null;
  }
}
