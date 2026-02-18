import Link from 'next/link';
import { ArrowUpRight, BriefcaseBusiness, GraduationCap, MicVocal } from 'lucide-react';

import { MotionReveal } from '@/components/motion-reveal';
import { VoiceIntro, TranscriptLine } from '@/components/home/voice-intro';
import { PageContainer } from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { siteConfig } from '@/config/site';
import { getJsonContent } from '@/lib/content';
import { getDictionary } from '@/lib/i18n';
import { getServerLocale } from '@/lib/i18n-server';

export default async function HomePage() {
  const locale = getServerLocale();
  const dictionary = getDictionary(locale);
  const transcript = await getJsonContent<TranscriptLine[]>('intro-transcript.json');

  const highlights = [
    {
      title: dictionary.nav.education,
      href: '/education',
      icon: GraduationCap,
      description: dictionary.home.highlights.education
    },
    {
      title: dictionary.nav.experience,
      href: '/experience',
      icon: BriefcaseBusiness,
      description: dictionary.home.highlights.career
    },
    {
      title: dictionary.nav.podcast,
      href: '/podcast',
      icon: MicVocal,
      description: dictionary.home.highlights.podcast
    }
  ];

  return (
    <PageContainer className="space-y-16">
      <MotionReveal>
        <section className="space-y-8">
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.18em]">
            {siteConfig.role}
          </Badge>
          <h1 className="font-display text-balance max-w-4xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            {dictionary.home.title}
          </h1>
          <p className="text-balance max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {dictionary.home.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/experience">{dictionary.home.viewExperience}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">{dictionary.home.contact}</Link>
            </Button>
          </div>
        </section>
      </MotionReveal>

      <section className="grid gap-4 md:grid-cols-3">
        {highlights.map((item, index) => {
          const Icon = item.icon;
          return (
            <MotionReveal key={item.title} delay={index * 0.05}>
              <Card className="h-full">
                <CardHeader>
                  <Icon className="mb-4 h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-6 text-sm text-muted-foreground">{item.description}</p>
                  <Link
                    href={item.href}
                    className="inline-flex items-center text-sm font-medium text-primary"
                  >
                    {dictionary.home.openSection} <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            </MotionReveal>
          );
        })}
      </section>

      <MotionReveal delay={0.15}>
        <VoiceIntro
          imageSrc={siteConfig.voiceIntro.imageSrc}
          imageAlt={siteConfig.voiceIntro.imageAlt}
          audioSrc={siteConfig.voiceIntro.audioSrc}
          transcript={transcript}
          title={dictionary.voice.title}
          helperText={dictionary.voice.helper}
          placeholderText={dictionary.voice.placeholder}
          playLabel={dictionary.voice.play}
          pauseLabel={dictionary.voice.pause}
          restartLabel={dictionary.voice.restart}
        />
      </MotionReveal>
    </PageContainer>
  );
}
