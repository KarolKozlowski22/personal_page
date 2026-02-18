import Image from 'next/image';

import { InteractiveProse } from '@/components/interactive-prose';
import { PageContainer } from '@/components/layout/page-container';
import { Timeline, TimelineItem } from '@/components/sections/timeline';
import { Card, CardContent } from '@/components/ui/card';
import { siteConfig } from '@/config/site';
import { getMdxContent, localizedMdxFile } from '@/lib/content';
import { getDictionary } from '@/lib/i18n';
import { getServerLocale } from '@/lib/i18n-server';

export const metadata = {
  title: 'Experience'
};

type ExperienceFrontmatter = {
  timeline: TimelineItem[];
};

export default async function ExperiencePage() {
  const locale = getServerLocale();
  const dictionary = getDictionary(locale);

  const [{ frontmatter }, currentCareer] = await Promise.all([
    getMdxContent<ExperienceFrontmatter>(localizedMdxFile('experience', locale)),
    getMdxContent(localizedMdxFile('career-current', locale))
  ]);

  return (
    <PageContainer className="space-y-10">
      <div className="mb-8 max-w-2xl space-y-2">
        <InteractiveProse
          className="vision-prose experience-prose font-display text-balance text-2xl font-semibold tracking-tight sm:text-3xl md:text-5xl"
          sequenceKey="experience-flow"
          step={1}
          wordDelayMs={150}
        >
          <h1>{dictionary.experience.title}</h1>
        </InteractiveProse>
      </div>
      <div className="group relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-border/70 bg-card/55 shadow-[0_24px_42px_-28px_hsl(var(--primary)/0.45)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_110%_at_8%_0%,hsl(var(--primary)/0.22),transparent_58%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative min-h-[320px] sm:min-h-[420px] md:min-h-[520px]">
          <Image
            src={siteConfig.experienceShowcase.imageSrc}
            alt=""
            fill
            aria-hidden="true"
            className="object-cover blur-xl scale-110 opacity-35 transition-transform duration-500 group-hover:scale-[1.14]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/20 to-background/35" />
          <Image
            src={siteConfig.experienceShowcase.imageSrc}
            alt={siteConfig.experienceShowcase.imageAlt}
            fill
            className="object-contain object-top p-3 transition-transform duration-500 group-hover:scale-[1.015] sm:p-5 md:p-7"
          />
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <InteractiveProse className="prose-custom vision-prose experience-prose" sequenceKey="experience-flow" step={2}>
            {currentCareer.content}
          </InteractiveProse>
        </CardContent>
      </Card>
      <Timeline
        items={frontmatter.timeline ?? []}
        remoteLabel={dictionary.experience.remote}
        sequenceKey="experience-flow"
        startStep={3}
      />
    </PageContainer>
  );
}
