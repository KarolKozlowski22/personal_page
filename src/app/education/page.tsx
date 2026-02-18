import Image from 'next/image';

import { PageContainer } from '@/components/layout/page-container';
import { SectionHeading } from '@/components/sections/section-heading';
import { Card, CardContent } from '@/components/ui/card';
import { siteConfig } from '@/config/site';
import { getMdxContent, localizedMdxFile } from '@/lib/content';
import { getDictionary } from '@/lib/i18n';
import { getServerLocale } from '@/lib/i18n-server';

export const metadata = {
  title: 'Education'
};

export default async function EducationPage() {
  const locale = getServerLocale();
  const dictionary = getDictionary(locale);
  const { content } = await getMdxContent(localizedMdxFile('education', locale));

  return (
    <PageContainer className="space-y-8 md:space-y-10">
      <SectionHeading title={dictionary.education.title} description={dictionary.education.description} />
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            {dictionary.education.galleryTitle}
          </h2>
          <p className="text-sm text-muted-foreground">{dictionary.education.galleryDescription}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-12">
          <div className="relative overflow-hidden rounded-2xl border bg-muted/30 md:col-span-7">
            <div className="relative aspect-[3/4] min-h-[420px] md:min-h-[560px]">
              <Image
                src={siteConfig.educationGallery.thesisPhoto.src}
                alt={siteConfig.educationGallery.thesisPhoto.alt}
                fill
                className="object-cover object-[center_20%]"
              />
            </div>
          </div>

          <div className="grid gap-4 md:col-span-5 md:grid-rows-2">
            <div className="relative min-h-[220px] overflow-hidden rounded-2xl border bg-card md:min-h-[270px]">
              <Image
                src={siteConfig.educationGallery.aghLogo.src}
                alt={siteConfig.educationGallery.aghLogo.alt}
                fill
                className="object-cover"
              />
            </div>

            <div className="relative min-h-[220px] overflow-hidden rounded-2xl border bg-card md:min-h-[270px]">
              <Image
                src={siteConfig.educationGallery.pwLogo.src}
                alt={siteConfig.educationGallery.pwLogo.alt}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Card>
        <CardContent className="prose-custom pt-6">{content}</CardContent>
      </Card>
    </PageContainer>
  );
}
