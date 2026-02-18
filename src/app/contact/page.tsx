import Image from 'next/image';
import Link from 'next/link';
import { Github, Linkedin, Mail, Youtube } from 'lucide-react';

import { InteractiveProse } from '@/components/interactive-prose';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { siteConfig } from '@/config/site';
import { getDictionary } from '@/lib/i18n';
import { getServerLocale } from '@/lib/i18n-server';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'Contact'
};

export default function ContactPage() {
  const locale = getServerLocale();
  const dictionary = getDictionary(locale);

  const links = [
    { label: dictionary.contact.email, href: `mailto:${siteConfig.email}`, icon: Mail },
    { label: 'GitHub', href: siteConfig.social.github, icon: Github },
    { label: 'LinkedIn', href: siteConfig.social.linkedin, icon: Linkedin },
    { label: 'YouTube', href: siteConfig.social.youtube, icon: Youtube }
  ];

  const toneClassByLabel: Record<string, string> = {
    [dictionary.contact.email]: 'social-tone-mail',
    GitHub: 'social-tone-github',
    LinkedIn: 'social-tone-linkedin',
    YouTube: 'social-tone-youtube'
  };

  return (
    <PageContainer className="space-y-6">
      <div className="mb-8 max-w-2xl space-y-2">
        <InteractiveProse
          className="vision-prose experience-prose font-display text-balance text-2xl font-semibold tracking-tight sm:text-3xl md:text-5xl"
          wordDelayMs={150}
        >
          <h1>{dictionary.contact.title}</h1>
        </InteractiveProse>
      </div>

      <div className="space-y-4">
        <Card className="overflow-hidden">
          <div className="relative min-h-[360px] md:min-h-[460px]">
            <Image
              src={siteConfig.contactShowcase.imageSrc}
              alt=""
              fill
              aria-hidden="true"
              className="object-cover blur-xl scale-110 opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/20 to-background/35" />
            <Image
              src={siteConfig.contactShowcase.imageSrc}
              alt={siteConfig.contactShowcase.imageAlt}
              fill
              className="object-contain p-4 md:p-6"
            />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="podcast-section-title text-xl sm:text-2xl">
              {dictionary.contact.getInTouch}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {links.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('mailto') ? undefined : '_blank'}
                  rel={item.href.startsWith('mailto') ? undefined : 'noreferrer'}
                  className={cn(
                    'footer-social-link group flex items-center justify-between rounded-xl border p-4 text-sm transition-all duration-200 hover:-translate-y-0.5',
                    toneClassByLabel[item.label] ?? 'social-tone-github'
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <Icon className="footer-social-icon h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110" />
                    {item.label}
                  </span>
                  <span className="rounded-full border border-border/65 bg-background/65 px-2.5 py-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                    {dictionary.contact.open}
                  </span>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
