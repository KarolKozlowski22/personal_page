import Link from 'next/link';
import { Calendar, Clock, ExternalLink } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/date';
import { PodcastEpisode } from '@/lib/podcast';

type EpisodeCardLabels = Readonly<{
  episode?: string;
  badge?: string;
  details: string;
  listen: string;
}>;

export function EpisodeCard({ episode, labels }: { episode: PodcastEpisode; labels: EpisodeCardLabels }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" /> {formatDate(episode.date)}
          </span>
          {episode.duration ? (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> {episode.duration}
            </span>
          ) : null}
        </div>
        <CardTitle className="line-clamp-2 text-lg">
          <Link href={`/podcast/${episode.slug}`} className="hover:text-primary">
            {episode.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-4 text-sm text-muted-foreground">{episode.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2">
        <Badge variant="outline">{labels.episode ?? labels.badge ?? 'Episode'}</Badge>
        <div className="flex items-center gap-3 text-sm">
          <Link href={`/podcast/${episode.slug}`} className="hover:text-primary">
            {labels.details}
          </Link>
          {episode.audioUrl ? (
            <Link href={episode.audioUrl} target="_blank" rel="noreferrer" className="hover:text-primary">
              {labels.listen} <ExternalLink className="ml-1 inline h-3 w-3" />
            </Link>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  );
}
