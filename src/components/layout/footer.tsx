import Link from 'next/link';

import { SocialIcon } from '@/components/ui/brand-icons';
import { siteConfig } from '@/config/site';

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

export function Footer() {
  return (
    <footer className="border-t bg-card/50">
      <div className="container flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">{siteConfig.author}</p>
        <div className="flex flex-wrap gap-4">
          {socials.map((social) => (
            <Link
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-transparent px-2.5 py-1 text-sm text-muted-foreground transition-colors hover:border-border/70 hover:bg-accent/40 hover:text-foreground"
            >
              <SocialIcon name={social.key} />
              {social.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
