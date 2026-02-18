'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Pause, Play, Volume2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type TranscriptLine = {
  time: number;
  end?: number;
  text: string;
  words?: {
    text: string;
    start: number;
    end: number;
  }[];
};

type VoiceIntroProps = {
  imageSrc: string;
  imageAlt: string;
  audioSrc: string;
  transcript: TranscriptLine[];
  title: string;
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
  placeholderText,
  playLabel,
  pauseLabel,
  restartLabel
}: VoiceIntroProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const safeTranscript = useMemo(
    () => [...transcript].sort((a, b) => a.time - b.time),
    [transcript]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const syncSubtitle = () => {
      setCurrentTime(audio.currentTime);
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onLoadedMetadata = () => setAudioDuration(Number.isFinite(audio.duration) ? audio.duration : 0);

    audio.addEventListener('timeupdate', syncSubtitle);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', syncSubtitle);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, [safeTranscript]);

  const activeBlock = useMemo(() => {
    if (!safeTranscript.length) return null;

    const now = Math.max(0, currentTime);
    const findLineEnd = (line: TranscriptLine, index: number) => {
      const next = safeTranscript[index + 1];
      return line.end ?? next?.time ?? (audioDuration > line.time ? audioDuration : line.time + 4);
    };

    const lastStartedIndex = safeTranscript.reduce((acc, line, index) => (line.time <= now ? index : acc), -1);
    if (lastStartedIndex < 0) return null;

    const active = safeTranscript[lastStartedIndex];
    const blockEnd = findLineEnd(active, lastStartedIndex);
    const words = active.words?.length
      ? active.words
      : [{ text: active.text, start: active.time, end: blockEnd }];

    const isTokenWord = (token: string) => /\S/.test(token);
    let activeWordIndex = words.findIndex(
      (word) => isTokenWord(word.text) && now >= word.start && now < word.end
    );

    if (activeWordIndex < 0) {
      for (let i = words.length - 1; i >= 0; i -= 1) {
        if (isTokenWord(words[i].text) && words[i].start <= now) {
          activeWordIndex = i;
          break;
        }
      }
    }

    return {
      key: `${active.time}-${lastStartedIndex}`,
      words,
      activeWordIndex
    };
  }, [audioDuration, currentTime, safeTranscript]);

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
      <CardContent className="grid gap-5 md:grid-cols-[180px_1fr] md:items-start md:gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 12 }}
          animate={{ opacity: isPlaying ? 1 : 0.92, scale: isPlaying ? 1 : 0.95, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative mx-auto h-32 w-32 overflow-hidden rounded-2xl border sm:h-40 sm:w-40 md:mx-0 md:mt-1"
        >
          <Image src={imageSrc} alt={imageAlt} fill className="object-cover object-[center_18%]" priority />
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
          <div
            className="subtitle-panel flex min-h-[120px] items-center rounded-xl border bg-gradient-to-b from-muted/50 to-background p-3 sm:min-h-[150px]"
          >
            {!activeBlock ? (
              <p className="min-h-10 w-full text-center text-sm leading-relaxed text-muted-foreground">
                {placeholderText}
              </p>
            ) : (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeBlock.key}
                  initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -8, filter: 'blur(3px)' }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="subtitle-block w-full rounded-lg bg-card/72 px-3 py-2.5 shadow-sm"
                >
                  <p className="subtitle-text text-center text-sm leading-relaxed text-foreground">
                    {activeBlock.words.map((word, index) => (
                      <span
                        key={`${activeBlock.key}-${index}`}
                        className={cn('subtitle-word', index === activeBlock.activeWordIndex && 'subtitle-word-active')}
                      >
                        {word.text}
                      </span>
                    ))}
                  </p>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              onClick={togglePlay}
              className="w-full bg-gradient-to-r from-primary to-primary/85 shadow-[0_14px_24px_-18px_hsl(var(--primary)/0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:from-primary/95 hover:to-primary sm:w-auto"
            >
              {isPlaying ? (
                <>
                  <Pause className="mr-2 h-4 w-4 transition-transform duration-200" /> {pauseLabel}
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4 transition-transform duration-200" /> {playLabel}
                </>
              )}
            </Button>

            <Button
              variant="outline"
              className="w-full border-border/75 bg-background/75 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-accent/45 hover:shadow-[0_12px_24px_-18px_hsl(var(--primary)/0.75)] sm:w-auto"
              onClick={() => {
                const audio = audioRef.current;
                if (!audio) return;
                audio.pause();
                audio.currentTime = 0;
                setIsPlaying(false);
                setCurrentTime(0);
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
