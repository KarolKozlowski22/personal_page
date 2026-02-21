import Parser from 'rss-parser';
import { unstable_cache } from 'next/cache';

import { siteConfig } from '@/config/site';

export type YouTubeVideo = {
  title: string;
  url: string;
  description?: string;
  publishedAt?: string;
  isShort: boolean;
  durationSeconds?: number;
  viewCount?: number;
  episodeKey?: string;
};

type YouTubeSearchResponse = {
  items?: {
    contentDetails?: {
      relatedPlaylists?: {
        uploads?: string;
      };
    };
  }[];
};

type YouTubePlaylistItemsResponse = {
  nextPageToken?: string;
  items?: {
    contentDetails?: {
      videoId?: string;
    };
  }[];
};

type YouTubeVideoDetailsResponse = {
  items?: {
    id?: string;
    snippet?: {
      title?: string;
      description?: string;
      publishedAt?: string;
    };
    contentDetails?: {
      duration?: string;
    };
    statistics?: {
      viewCount?: string;
    };
  }[];
};

type YouTubeUploadsResult = {
  featured: YouTubeVideo[];
  shorts: YouTubeVideo[];
  liveAvailable: boolean;
};

type LastKnownGoodEntry = {
  updatedAt: number;
  data: YouTubeUploadsResult;
};

const parser = new Parser();
const lastKnownGoodByChannel = new Map<string, LastKnownGoodEntry>();
const YOUTUBE_REVALIDATE_SECONDS = 1800;
const YOUTUBE_MAX_PAGES = Number.parseInt(process.env.YOUTUBE_MAX_PAGES ?? '4', 10);
const SAFE_MAX_PAGES = Number.isFinite(YOUTUBE_MAX_PAGES)
  ? Math.min(Math.max(YOUTUBE_MAX_PAGES, 1), 12)
  : 4;

function extractDescription(item: Parser.Item) {
  const raw = item.contentSnippet ?? item.content ?? '';
  return raw.replace(/\s+/g, ' ').trim();
}

function normalizeYouTubeUrl(url?: string) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube.com/watch?v=${id}` : '';
    }
    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname.includes('/shorts/')) {
        const id = parsed.pathname.split('/').filter(Boolean).pop();
        return id ? `https://www.youtube.com/shorts/${id}` : '';
      }
      const id = parsed.searchParams.get('v') || parsed.pathname.split('/').filter(Boolean).pop();
      return id ? `https://www.youtube.com/watch?v=${id}` : '';
    }
  } catch {
    return '';
  }
  return '';
}

function isShortItem(title: string, description: string, url: string) {
  const haystack = `${title} ${description} ${url}`.toLowerCase();
  return haystack.includes('#shorts') || haystack.includes('/shorts/');
}

function parseDurationToSeconds(durationIso?: string) {
  if (!durationIso) return 0;
  const match = durationIso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const h = Number(match[1] ?? 0);
  const m = Number(match[2] ?? 0);
  const s = Number(match[3] ?? 0);
  return h * 3600 + m * 60 + s;
}

function extractEpisodeKey(title: string, description: string) {
  const haystack = `${title} ${description}`;
  const match = haystack.match(/(?:#|odcinek\s*|episode\s*)(\d{1,3})/i);
  if (!match) return '';
  return `ep-${match[1]}`;
}

function toTimestamp(value?: string) {
  if (!value) return 0;
  const ts = Date.parse(value);
  return Number.isNaN(ts) ? 0 : ts;
}

async function fetchYouTubeUploads(channelId: string) {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const feed = await parser.parseURL(feedUrl);

  const items = (feed.items ?? [])
    .map((item) => {
      const title = item.title?.trim() ?? '';
      const description = extractDescription(item);
      const url = normalizeYouTubeUrl(item.link ?? '');

      if (!title || !url) return null;

      return {
        title,
        url,
        description: description || undefined,
        publishedAt: item.isoDate ?? item.pubDate ?? undefined,
        isShort: isShortItem(title, description, url),
        episodeKey: extractEpisodeKey(title, description) || undefined
      } as YouTubeVideo;
    })
    .filter((item): item is YouTubeVideo => Boolean(item));

  return items;
}

function chunkArray<T>(array: T[], chunkSize: number) {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

async function fetchYouTubeUploadsWithApi(channelId: string, apiKey: string) {
  const channelParams = new URLSearchParams({
    part: 'contentDetails',
    id: channelId,
    key: apiKey
  });

  const channelRes = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?${channelParams.toString()}`,
    { next: { revalidate: YOUTUBE_REVALIDATE_SECONDS } }
  );
  if (!channelRes.ok) {
    throw new Error(`YouTube channels API failed: ${channelRes.status}`);
  }

  const channelJson = (await channelRes.json()) as YouTubeSearchResponse;
  const uploadsPlaylistId =
    channelJson.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ?? '';
  if (!uploadsPlaylistId) return [] as YouTubeVideo[];

  const ids: string[] = [];
  let nextPageToken = '';
  let page = 0;

  // Collect recent uploads from the channel uploads playlist (most stable source).
  while (page < SAFE_MAX_PAGES) {
    const playlistParams = new URLSearchParams({
      part: 'contentDetails',
      playlistId: uploadsPlaylistId,
      maxResults: '50',
      key: apiKey
    });
    if (nextPageToken) playlistParams.set('pageToken', nextPageToken);

    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?${playlistParams.toString()}`,
      { next: { revalidate: YOUTUBE_REVALIDATE_SECONDS } }
    );
    if (!playlistRes.ok) {
      throw new Error(`YouTube playlistItems API failed: ${playlistRes.status}`);
    }

    const playlistJson = (await playlistRes.json()) as YouTubePlaylistItemsResponse;
    const pageIds = (playlistJson.items ?? [])
      .map((item) => item.contentDetails?.videoId)
      .filter((id: string | undefined): id is string => Boolean(id));

    ids.push(...pageIds);
    nextPageToken = playlistJson.nextPageToken ?? '';
    page += 1;
    if (!nextPageToken) break;
  }

  const uniqueIds = [...new Set(ids)];
  if (!uniqueIds.length) return [] as YouTubeVideo[];

  const detailChunks = chunkArray(uniqueIds, 50);
  const allItems: YouTubeVideo[] = [];

  for (const idsChunk of detailChunks) {
    const detailsParams = new URLSearchParams({
      part: 'snippet,contentDetails,statistics',
      id: idsChunk.join(','),
      key: apiKey
    });

    const detailsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?${detailsParams.toString()}`,
      { next: { revalidate: YOUTUBE_REVALIDATE_SECONDS } }
    );
    if (!detailsRes.ok) {
      throw new Error(`YouTube videos API failed: ${detailsRes.status}`);
    }

    const detailsJson = (await detailsRes.json()) as YouTubeVideoDetailsResponse;
    const parsedItems = (detailsJson.items ?? []).map((item) => {
      const id = item.id;
      const title = item.snippet?.title?.trim() ?? '';
      const description = item.snippet?.description?.trim() ?? '';
      const publishedAt = item.snippet?.publishedAt;
      const viewCount = Number(item.statistics?.viewCount ?? 0);
      const seconds = parseDurationToSeconds(item.contentDetails?.duration);
      const url = id ? `https://www.youtube.com/watch?v=${id}` : '';
      // For API data, duration is the most reliable way to separate shorts from full episodes.
      const isShort = seconds > 0 && seconds <= 180;

      return {
        title,
        url,
        description: description || undefined,
        publishedAt,
        isShort,
        durationSeconds: seconds || undefined,
        viewCount,
        episodeKey: extractEpisodeKey(title, description) || undefined
      } as YouTubeVideo;
    });

    allItems.push(...parsedItems.filter((item) => item.title && item.url));
  }

  return allItems.sort((a, b) => {
    const aTs = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const bTs = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return bTs - aTs;
  });
}

function selectBestShortsPerEpisode(videos: YouTubeVideo[]) {
  const episodes = videos
    .filter((video) => !video.isShort && (video.durationSeconds ?? 0) > 180)
    .sort((a, b) => toTimestamp(b.publishedAt) - toTimestamp(a.publishedAt));

  const shorts = videos
    .filter((video) => video.isShort)
    .sort((a, b) => toTimestamp(b.publishedAt) - toTimestamp(a.publishedAt));

  const byEpisode = new Map<string, YouTubeVideo>();

  for (let index = 0; index < episodes.length; index += 1) {
    const episode = episodes[index];
    const episodeTs = toTimestamp(episode.publishedAt);
    const newerEpisodeTs = index === 0 ? Number.POSITIVE_INFINITY : toTimestamp(episodes[index - 1].publishedAt);

    const candidates = shorts.filter((short) => {
      const shortTs = toTimestamp(short.publishedAt);
      return shortTs >= episodeTs && shortTs < newerEpisodeTs;
    });
    if (!candidates.length) continue;

    const best = candidates.reduce((acc, current) => {
      const accViews = acc.viewCount ?? 0;
      const currentViews = current.viewCount ?? 0;
      if (currentViews > accViews) return current;
      if (currentViews < accViews) return acc;
      return toTimestamp(current.publishedAt) > toTimestamp(acc.publishedAt) ? current : acc;
    });

    byEpisode.set(episode.url, best);
  }

  const mapped = episodes
    .map((episode) => byEpisode.get(episode.url))
    .filter((short): short is YouTubeVideo => Boolean(short));

  if (mapped.length > 0) return mapped;

  // Fallback: when strict episode windows produce no matches, still show live shorts deterministically.
  return shorts
    .slice()
    .sort((a, b) => {
      const viewDiff = (b.viewCount ?? 0) - (a.viewCount ?? 0);
      if (viewDiff !== 0) return viewDiff;
      return toTimestamp(b.publishedAt) - toTimestamp(a.publishedAt);
    })
    .slice(0, 8);
}

function extractChannelIdFromUrl(url: string) {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split('/').filter(Boolean);

    if (parts[0] === 'channel' && parts[1]?.startsWith('UC')) return parts[1];
  } catch {
    return '';
  }

  return '';
}

async function resolveChannelIdFromHandleUrl(youtubeUrl: string) {
  const direct = extractChannelIdFromUrl(youtubeUrl);
  if (direct) return direct;

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(youtubeUrl);
  } catch {
    return '';
  }

  const handlePath = parsedUrl.pathname;
  if (!handlePath || !handlePath.startsWith('/@')) return '';

  try {
    const res = await fetch(`https://www.youtube.com${handlePath}`, {
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; personal-page-bot/1.0)'
      },
      next: { revalidate: 86400 }
    });

    if (!res.ok) return '';
    const html = await res.text();
    const match = html.match(/"channelId":"(UC[\w-]{20,})"/);
    return match?.[1] ?? '';
  } catch {
    return '';
  }
}

const fetchYouTubeUploadsCached = unstable_cache(
  async (channelId: string) => fetchYouTubeUploads(channelId),
  ['youtube-uploads-feed'],
  { revalidate: YOUTUBE_REVALIDATE_SECONDS }
);

const fetchYouTubeUploadsApiCached = unstable_cache(
  async (channelId: string, apiKey: string) => fetchYouTubeUploadsWithApi(channelId, apiKey),
  ['youtube-uploads-api'],
  { revalidate: YOUTUBE_REVALIDATE_SECONDS }
);

const resolveChannelIdCached = unstable_cache(
  async (youtubeUrl: string) => resolveChannelIdFromHandleUrl(youtubeUrl),
  ['youtube-channel-id-resolver'],
  { revalidate: YOUTUBE_REVALIDATE_SECONDS }
);

export async function getYouTubeUploadsSafe(): Promise<YouTubeUploadsResult> {
  let channelId = siteConfig.youtubeChannelId.trim();
  if (!channelId) {
    channelId = await resolveChannelIdCached(siteConfig.social.youtube);
    if (!channelId) {
      // Fallback without cache in case the previous cached lookup failed temporarily.
      channelId = await resolveChannelIdFromHandleUrl(siteConfig.social.youtube);
    }
  }

  if (!channelId) {
    console.warn('[youtube] source=static-fallback reason=missing-channel-id');
    return {
      featured: [] as YouTubeVideo[],
      shorts: [] as YouTubeVideo[],
      liveAvailable: false
    };
  }

  try {
    const apiKey = process.env.YOUTUBE_API_KEY?.trim() ?? '';
    const uploads: YouTubeVideo[] = apiKey
      ? await fetchYouTubeUploadsApiCached(channelId, apiKey)
      : await fetchYouTubeUploadsCached(channelId);

    const featured = uploads.filter((item: YouTubeVideo) => {
      if (item.url.includes('/shorts/')) return false;
      const duration = item.durationSeconds ?? 0;
      // Always include full episodes.
      return duration === 0 || duration > 180;
    });
    const shorts = apiKey
      ? selectBestShortsPerEpisode(uploads)
      : uploads.filter((item: YouTubeVideo) => item.isShort).slice(0, 6);

    const liveResult: YouTubeUploadsResult = { featured, shorts, liveAvailable: true };
    console.info(
      `[youtube] source=${apiKey ? 'live-api' : 'live-rss'} status=ok featured=${featured.length} shorts=${shorts.length}`
    );
    lastKnownGoodByChannel.set(channelId, {
      updatedAt: Date.now(),
      data: liveResult
    });
    return liveResult;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[youtube] live fetch failed for channel ${channelId}: ${message}`);

    const lastKnownGood = lastKnownGoodByChannel.get(channelId);
    if (lastKnownGood) {
      console.warn(
        `[youtube] source=last-known-good status=ok featured=${lastKnownGood.data.featured.length} shorts=${lastKnownGood.data.shorts.length} ageMs=${Date.now() - lastKnownGood.updatedAt}`
      );
      return {
        featured: [...lastKnownGood.data.featured],
        shorts: [...lastKnownGood.data.shorts],
        liveAvailable: true
      };
    }

    console.warn('[youtube] source=static-fallback reason=live-failed-no-last-known-good');
    return {
      featured: [] as YouTubeVideo[],
      shorts: [] as YouTubeVideo[],
      liveAvailable: false
    };
  }
}
