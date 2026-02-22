import Parser from 'rss-parser';
import { unstable_cache } from 'next/cache';

import { siteConfig } from '@/config/site';
import { slugify } from '@/lib/utils';

export type PodcastEpisode = {
  slug: string;
  title: string;
  date: string;
  description: string;
  duration?: string;
  audioUrl?: string;
  episodeUrl?: string;
  spotifyEmbed?: string;
  youtubeEmbed?: string;
};

const parser = new Parser({
  customFields: {
    item: ['itunes:duration']
  }
});

function stripHtml(html?: string) {
  if (!html) return 'No description available.';
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function truncateText(text: string, maxLength = 280) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

function findUrl(text: string, pattern: RegExp) {
  const match = text.match(pattern);
  return match?.[0];
}

function normalizeYoutubeUrl(url?: string) {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : undefined;
    }
    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v');
      return id ? `https://www.youtube.com/embed/${id}` : undefined;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

function normalizeSpotifyEmbed(url?: string) {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes('spotify.com')) return undefined;
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length >= 2) {
      return `https://open.spotify.com/embed/${parts[0]}/${parts[1]}`;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

export async function getPodcastEpisodes() {
  const feed = await parser.parseURL(siteConfig.podcastRssUrl);

  return (feed.items ?? [])
    .map((item) => {
      const date = item.isoDate ?? item.pubDate ?? new Date().toISOString();
      const title = item.title?.trim() || 'Untitled Episode';
      const descriptionRaw = item.contentSnippet || item.content || item.summary || '';
      const description = truncateText(stripHtml(descriptionRaw));
      const searchableText = `${descriptionRaw} ${item.link ?? ''}`;

      const spotifyUrl =
        findUrl(searchableText, /https?:\/\/(open\.)?spotify\.com\/[\w\-/?.=&%]+/i) ?? undefined;
      const youtubeUrl =
        findUrl(searchableText, /https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/[\w\-/?.=&%]+/i) ??
        undefined;

      const parsedDate = new Date(date);
      const datePart = Number.isNaN(parsedDate.getTime())
        ? 'undated'
        : parsedDate.toISOString().slice(0, 10);
      const slug = slugify(`${datePart}-${title}`);
      const itunesItem = item as Parser.Item & { 'itunes:duration'?: string };

      return {
        slug,
        title,
        date,
        description,
        duration: itunesItem['itunes:duration'] ?? undefined,
        audioUrl: item.enclosure?.url,
        episodeUrl: item.link,
        spotifyEmbed: normalizeSpotifyEmbed(spotifyUrl),
        youtubeEmbed: normalizeYoutubeUrl(youtubeUrl)
      };
    })
    .filter((episode) => Boolean(episode.title));
}

const getPodcastEpisodesCached = unstable_cache(
  async () => getPodcastEpisodes(),
  ['podcast-episodes-feed'],
  { revalidate: 1800 }
);

export async function getPodcastEpisodesSafe() {
  try {
    const episodes = await getPodcastEpisodesCached();
    return { episodes, error: null as string | null };
  } catch {
    return {
      episodes: [] as Awaited<ReturnType<typeof getPodcastEpisodes>>,
      error: 'Episodes are currently unavailable. Please use direct platform links below.'
    };
  }
}

export type PodcastEpisodeResolved = Awaited<ReturnType<typeof getPodcastEpisodes>>[number];
