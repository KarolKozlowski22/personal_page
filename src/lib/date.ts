import { format } from 'date-fns';

export function formatDate(date: string | Date) {
  const parsed = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(parsed.getTime())) return 'Unknown date';
  return format(parsed, 'MMMM d, yyyy');
}
