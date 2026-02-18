'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { LanguageToggle } from '@/components/language-toggle';
import { useLanguage } from '@/components/language-provider';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';

export function Navbar() {
  const pathname = usePathname();
  const { dictionary } = useLanguage();

  const navItems = [
    { href: '/', label: dictionary.nav.home },
    { href: '/experience', label: dictionary.nav.experience },
    { href: '/education', label: dictionary.nav.education },
    { href: '/podcast', label: dictionary.nav.podcast },
    { href: '/contact', label: dictionary.nav.contact }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-3">
        <Link href="/" className="font-display text-base font-semibold tracking-tight">
          {siteConfig.author}
          <span className="ml-2 text-sm font-normal text-muted-foreground">{siteConfig.role}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main Navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-full px-3 py-2 text-sm transition-colors hover:bg-accent/70 hover:text-accent-foreground',
                pathname === item.href
                  ? 'bg-secondary text-secondary-foreground shadow-sm'
                  : 'text-muted-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="md:hidden"
                aria-label={dictionary.nav.openMenu}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>{siteConfig.name}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'rounded-md px-3 py-2 text-sm',
                      pathname === item.href
                        ? 'bg-secondary text-secondary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
