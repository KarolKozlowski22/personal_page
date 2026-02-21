'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronUp, ExternalLink, Linkedin, Instagram, X, Youtube } from 'lucide-react';

import { useLanguage } from '@/components/language-provider';
import { SocialIcon } from '@/components/ui/brand-icons';
import { siteConfig } from '@/config/site';

const POPUP_DELAY_MS = 10_000;
const socialPreview = {
  youtube: '/social/youtube.jpeg',
  linkedin: '/social/linkedin.jpeg',
  instagram: '/social/instagram.jpeg',
  tiktok: '/social/tiktok.jpeg'
} as const;

export function SocialPromoPopup() {
  const { locale } = useLanguage();
  const [open, setOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setOpen(true);
      setMobileExpanded(false);
    }, POPUP_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (!open) return null;

  const isPl = locale === 'pl';
  const title = isPl ? 'Bądźmy w kontakcie' : "Let's stay connected";
  const description = isPl ? 'Obserwuj mnie w social mediach.' : 'Follow me on socials.';
  const maybeLater = isPl ? 'Może później' : 'Maybe later';
  const youtubeLabel = isPl ? 'Kanał YouTube' : 'YouTube Channel';
  const linkedinLabel = 'LinkedIn';
  const instagramLabel = 'Instagram';
  const tiktokLabel = 'TikTok';
  const openLabel = isPl ? 'Otwórz' : 'Open';
  const openPanelLabel = isPl ? 'Rozwiń' : 'Expand';
  const collapseLabel = isPl ? 'Zwiń' : 'Collapse';

  const cards: {
    key: string;
    href: string;
    preview: string;
    title: string;
    badge: string;
    accent: string;
    icon: ReactNode;
  }[] = [
    {
      key: 'youtube',
      href: siteConfig.social.youtube,
      preview: socialPreview.youtube,
      title: youtubeLabel,
      badge: 'YouTube',
      accent: '#ff3d3d',
      icon: <Youtube className="h-3.5 w-3.5 text-[#ff3d3d]" />
    },
    {
      key: 'linkedin',
      href: siteConfig.social.linkedin,
      preview: socialPreview.linkedin,
      title: linkedinLabel,
      badge: 'LinkedIn',
      accent: '#1a66ff',
      icon: <Linkedin className="h-3.5 w-3.5 text-[#1a66ff]" />
    },
    {
      key: 'instagram',
      href: siteConfig.social.instagram,
      preview: socialPreview.instagram,
      title: instagramLabel,
      badge: 'Instagram',
      accent: '#d62976',
      icon: <Instagram className="h-3.5 w-3.5 text-[#d62976]" />
    },
    {
      key: 'tiktok',
      href: siteConfig.social.tiktok,
      preview: socialPreview.tiktok,
      title: tiktokLabel,
      badge: 'TikTok',
      accent: '#25f4ee',
      icon: <SocialIcon name="tiktok" className="h-3.5 w-3.5 text-[#25f4ee]" />
    }
  ];

  const cardClass =
    'group overflow-hidden rounded-xl border border-border/70 bg-background/75 transition-all duration-200 hover:-translate-y-0.5';

  return (
    <>
      <div className="hidden md:block">
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/38 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border/70 bg-card/95 p-5 shadow-[0_28px_60px_-28px_hsl(var(--foreground)/0.55)]"
            initial={{ y: 30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={isPl ? 'Zamknij' : 'Close'}
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-background/80 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mb-4 pr-10">
              <p className="font-display text-xl font-semibold tracking-tight">{title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {cards.map((card) => (
                <Link
                  key={card.key}
                  href={card.href}
                  target="_blank"
                  rel="noreferrer"
                  className={cardClass}
                  style={{ borderColor: `color-mix(in oklab, hsl(var(--border)) 72%, ${card.accent} 28%)` }}
                >
                  <div className="relative h-24 bg-gradient-to-br from-background/95 via-card/90 to-muted/70">
                    <Image src={card.preview} alt="" fill aria-hidden="true" className="object-contain p-1 opacity-85" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-transparent" />
                    <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-2 py-1 text-[11px] text-white">
                      {card.icon}
                      {card.badge}
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <span className="text-sm font-medium">{card.title}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground">
                      {openLabel}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {maybeLater}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="md:hidden">
        <AnimatePresence>
          {mobileExpanded ? (
            <motion.button
              type="button"
              aria-label={isPl ? 'Zamknij panel' : 'Close panel'}
              className="fixed inset-0 z-[79] bg-black/30 backdrop-blur-[1px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileExpanded(false)}
            />
          ) : null}
        </AnimatePresence>

        <motion.div
          className="fixed inset-x-3 bottom-3 z-[80]"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {!mobileExpanded ? (
            <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/95 shadow-[0_20px_36px_-24px_hsl(var(--foreground)/0.5)]">
              <button
                type="button"
                onClick={() => setMobileExpanded(true)}
                className="flex w-full items-center justify-between px-3 py-2.5 text-left"
              >
                <div>
                  <p className="font-display text-sm font-semibold tracking-tight">{title}</p>
                  <p className="text-[11px] text-muted-foreground">{description}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-border/65 bg-background/70 px-2.5 py-1 text-[11px] text-muted-foreground">
                  {openPanelLabel}
                  <ChevronUp className="h-3.5 w-3.5" />
                </span>
              </button>
            </div>
          ) : (
            <motion.div
              className="overflow-hidden rounded-2xl border border-border/70 bg-card/95 p-3 shadow-[0_28px_60px_-28px_hsl(var(--foreground)/0.55)]"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-2.5 flex items-center justify-between gap-2">
                <p className="font-display text-sm font-semibold tracking-tight">{title}</p>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setMobileExpanded(false)}
                    className="rounded-full border border-border/65 bg-background/70 px-2 py-1 text-[11px] text-muted-foreground"
                  >
                    {collapseLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border/70 bg-background/80 text-muted-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {cards.map((card) => (
                  <Link
                    key={card.key}
                    href={card.href}
                    target="_blank"
                    rel="noreferrer"
                    className={cardClass}
                    style={{ borderColor: `color-mix(in oklab, hsl(var(--border)) 72%, ${card.accent} 28%)` }}
                  >
                    <div className="relative h-16 bg-gradient-to-br from-background/95 via-card/90 to-muted/70">
                      <Image src={card.preview} alt="" fill aria-hidden="true" className="object-contain p-1 opacity-85" />
                    </div>
                    <div className="flex items-center justify-between px-2 py-1.5">
                      <span className="text-[11px] font-medium">{card.title}</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
}
