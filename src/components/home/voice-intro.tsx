'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Pause, Play, Volume2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type TranscriptLine = {
  time: number;
  text: string;
};

type VoiceIntroProps = {
  imageSrc: string;
  imageAlt: string;
  audioSrc: string;
  transcript: TranscriptLine[];
  title: string;
  helperText: string;
  placeholderText: string;
  playLabel: string;
  pauseLabel: string;
  restartLabel: string;
};

export function VoiceIntro({
  imageSrc,
  imageAlt,
  audioSrc,
  transcript,
  title,
  helperText,
  placeholderText,
  playLabel,
  pauseLabel,
  restartLabel
}: VoiceIntroProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const subtitlesRef = useRef<HTMLDivElement | null>(null);

  const safeTranscript = useMemo(
    () => [...transcript].sort((a, b) => a.time - b.time),
    [transcript]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const syncSubtitle = () => {
      const t = audio.currentTime;
      const nextCount = safeTranscript.filter((line) => line.time < t).length;
      setVisibleCount((current) => (nextCount > current ? nextCount : current));
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', syncSubtitle);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', syncSubtitle);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, [safeTranscript]);

  useEffect(() => {
    const container = subtitlesRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, [visibleCount]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      await audio.play();
    } else {
      audio.pause();
    }
  };

  return (
    <Card className="overflow-hidden border-primary/20">
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2 text-xl">
          <Volume2 className="h-5 w-5 text-primary" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-[180px_1fr] md:items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 12 }}
          animate={{ opacity: isPlaying ? 1 : 0.92, scale: isPlaying ? 1 : 0.95, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative mx-auto h-40 w-40 overflow-hidden rounded-2xl border"
        >
          <Image src={imageSrc} alt={imageAlt} fill className="object-cover" priority />
          <AnimatePresence>
            {isPlaying ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-primary/10"
              />
            ) : null}
          </AnimatePresence>
        </motion.div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{helperText}</p>

          <div
            ref={subtitlesRef}
            className="max-h-72 space-y-2 overflow-y-auto rounded-xl border bg-gradient-to-b from-muted/50 to-background p-4"
          >
            {visibleCount === 0 ? (
              <p className="min-h-16 text-sm leading-relaxed text-muted-foreground">
                {placeholderText}
              </p>
            ) : null}

            <AnimatePresence initial={false}>
              {safeTranscript.slice(0, visibleCount).map((line, index) => (
                <motion.p
                  key={`${line.time}-${index}`}
                  initial={{ opacity: 0, y: 8, filter: 'blur(2px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="rounded-lg border border-border/70 bg-card/80 px-3 py-2 text-sm leading-relaxed text-foreground shadow-sm"
                >
                  {line.text}
                </motion.p>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={togglePlay}>
              {isPlaying ? (
                <>
                  <Pause className="mr-2 h-4 w-4" /> {pauseLabel}
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" /> {playLabel}
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                const audio = audioRef.current;
                if (!audio) return;
                audio.pause();
                audio.currentTime = 0;
                setIsPlaying(false);
                setVisibleCount(0);
              }}
            >
              {restartLabel}
            </Button>
          </div>
        </div>
      </CardContent>

      <audio ref={audioRef} preload="metadata" src={audioSrc} />
    </Card>
  );
}
