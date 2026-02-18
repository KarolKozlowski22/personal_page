import { cn } from '@/lib/utils';

export function PageContainer({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('container py-10 sm:py-12 md:py-20', className)}>{children}</div>;
}
