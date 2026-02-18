import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type TimelineItem = {
  title: string;
  company?: string;
  period: string;
  location?: string;
  summary: string;
  tags?: string[];
};

export function Timeline({ items, remoteLabel = 'Remote' }: { items: TimelineItem[]; remoteLabel?: string }) {
  return (
    <ol className="relative ml-3 border-l border-border pl-8">
      {items.map((item) => (
        <li key={`${item.title}-${item.period}`} className="mb-8">
          <span className="absolute -left-1.5 mt-6 h-3 w-3 rounded-full bg-primary" />
          <Card>
            <CardHeader>
              <p className="text-sm text-muted-foreground">{item.period}</p>
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {item.company ? `${item.company} • ` : ''}
                {item.location ?? remoteLabel}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
              {item.tags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </li>
      ))}
    </ol>
  );
}
