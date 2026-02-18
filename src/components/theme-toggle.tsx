'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { setTheme } = useTheme();
  const { dictionary } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label={dictionary.controls.theme}>
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>{dictionary.controls.light}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>{dictionary.controls.dark}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>{dictionary.controls.system}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
