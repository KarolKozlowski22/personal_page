import Image from 'next/image';
import Link from 'next/link';
import { Github, Linkedin, Mail, Youtube } from 'lucide-react';

import { PageContainer } from '@/components/layout/page-container';
import { SectionHeading } from '@/components/sections/section-heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { siteConfig } from '@/config/site';
import { getDictionary } from '@/lib/i18n';
import { getServerLocale } from '@/lib/i18n-server';

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

  return (
    <PageContainer className="space-y-6">
      <SectionHeading title={dictionary.contact.title} description={dictionary.contact.description} />

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
            <CardTitle>{dictionary.contact.getInTouch}</CardTitle>
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
                  className="flex items-center justify-between rounded-md border p-4 text-sm hover:bg-accent"
                >
                  <span className="inline-flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    {item.label}
                  </span>
                  <span className="text-muted-foreground">{dictionary.contact.open}</span>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
