import { cn } from '@/lib/utils';

export function SectionHeading({
  title,
  description,
  className
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn('mb-8 max-w-2xl space-y-2', className)}>
      <h1 className="font-display text-balance text-2xl font-semibold tracking-tight sm:text-3xl md:text-5xl">
        {title}
      </h1>
      {description ? <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p> : null}
    </div>
  );
}
