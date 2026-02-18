import Image from 'next/image';

import { PageContainer } from '@/components/layout/page-container';
import { SectionHeading } from '@/components/sections/section-heading';
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
      <SectionHeading
        title={dictionary.experience.title}
        description={dictionary.experience.description}
      />
      <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl border bg-muted/30">
        <div className="relative aspect-[4/5]">
          <Image
            src={siteConfig.experienceShowcase.imageSrc}
            alt={siteConfig.experienceShowcase.imageAlt}
            fill
            className="object-cover"
          />
        </div>
      </div>
      <Card>
        <CardContent className="prose-custom pt-6">{currentCareer.content}</CardContent>
      </Card>
      <Timeline items={frontmatter.timeline ?? []} remoteLabel={dictionary.experience.remote} />
    </PageContainer>
  );
}
