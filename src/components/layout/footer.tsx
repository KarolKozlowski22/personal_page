import Link from 'next/link';

import { SocialIcon } from '@/components/ui/brand-icons';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

const socialLabels: Record<string, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  spotify: 'Spotify',
  instagram: 'Instagram',
  x: 'X'
};

const socials = Object.entries(siteConfig.social).map(([key, href]) => ({
  key,
  label: socialLabels[key] ?? key,
  href
}));

const socialToneClass: Record<string, string> = {
  github: 'social-tone-github',
  linkedin: 'social-tone-linkedin',
  youtube: 'social-tone-youtube',
  spotify: 'social-tone-spotify',
  instagram: 'social-tone-instagram',
  x: 'social-tone-x'
};

export function Footer() {
  return (
    <footer className="mt-8 border-t border-border/70 bg-card/45">
      <div className="container flex justify-center py-8">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {socials.map((social) => (
            <Link
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className={cn(
                'footer-social-link group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs text-muted-foreground transition-all duration-200 sm:text-sm',
                socialToneClass[social.key] ?? 'social-tone-github'
              )}
            >
              <SocialIcon
                name={social.key}
                className="footer-social-icon transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110"
              />
              {social.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
