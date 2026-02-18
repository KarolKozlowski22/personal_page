import Image from 'next/image';
import Link from 'next/link';
import { AudioLines, ExternalLink, MicVocal, Radio } from 'lucide-react';

import { PageContainer } from '@/components/layout/page-container';
import { SectionHeading } from '@/components/sections/section-heading';
import { SocialIcon } from '@/components/ui/brand-icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { siteConfig } from '@/config/site';
import { getJsonContent, getMdxContent, localizedMdxFile } from '@/lib/content';
import { getDictionary } from '@/lib/i18n';
import { getServerLocale } from '@/lib/i18n-server';

export const metadata = {
  title: 'Podcast'
};

type PodcastFrontmatter = {
  platforms?: { label: string; url: string }[];
  featuredEpisodes?: { title: string; url: string; description?: string }[];
};

type ShortsData = {
  title?: string;
  url: string;
}[];

function toEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.slice(1);
      return `https://www.youtube.com/embed/${id}`;
    }
    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v') || parsed.pathname.split('/').pop();
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    return '';
  }
  return '';
}

export default async function PodcastPage() {
  const locale = getServerLocale();
  const dictionary = getDictionary(locale);

  const [{ content, frontmatter }, shorts] = await Promise.all([
    getMdxContent<PodcastFrontmatter>(localizedMdxFile('podcast', locale)),
    getJsonContent<ShortsData>('shorts.json')
  ]);

  return (
    <PageContainer className="space-y-12">
      <SectionHeading title={dictionary.podcast.title} description={dictionary.podcast.description} />

      <Card className="overflow-hidden">
        <div className="grid items-stretch md:grid-cols-[280px_1fr]">
          <div className="relative min-h-[260px]">
            <Image
              src={siteConfig.voiceIntro.imageSrc}
              alt={siteConfig.voiceIntro.imageAlt}
              fill
              className="object-cover object-[center_18%]"
            />
          </div>
          <div className="flex flex-col justify-center gap-4 p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Host</p>
            <h2 className="font-display text-2xl font-semibold tracking-tight">{siteConfig.author}</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {dictionary.podcast.description}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
                <MicVocal className="h-3.5 w-3.5 text-primary" />
                Podcast
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
                <Radio className="h-3.5 w-3.5 text-primary" />
                Stories
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
                <AudioLines className="h-3.5 w-3.5 text-primary" />
                Insights
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardContent className="prose-custom pt-6">{content}</CardContent>
      </Card>

      {frontmatter.featuredEpisodes?.length ? (
        <section className="space-y-5">
          <h2 className="text-2xl font-semibold">{dictionary.podcast.featured}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {frontmatter.featuredEpisodes.map((episode) => (
              <Card key={episode.url}>
                <CardHeader>
                  <CardTitle className="text-base">{episode.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video overflow-hidden rounded-md border">
                    <iframe
                      src={toEmbedUrl(episode.url)}
                      title={episode.title}
                      className="h-full w-full"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  {episode.description ? (
                    <p className="text-sm text-muted-foreground">{episode.description}</p>
                  ) : null}
                  <Link
                    href={episode.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary"
                  >
                    {dictionary.podcast.watchOnYoutube}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      {shorts.length ? (
        <section className="space-y-5">
          <h2 className="text-2xl font-semibold">{dictionary.podcast.shorts}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {shorts.map((short) => (
              <iframe
                key={short.url}
                src={toEmbedUrl(short.url)}
                title={short.title ?? 'YouTube Short'}
                className="aspect-video h-full w-full rounded-xl"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{dictionary.podcast.platforms}</h2>
        <div className="flex flex-wrap gap-3">
          {(frontmatter.platforms ?? []).map((platform) => (
            <Link
              key={platform.label}
              href={platform.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-sm hover:bg-accent/70"
            >
              <SocialIcon name={platform.label.toLowerCase()} className="text-primary" />
              {platform.label}
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
