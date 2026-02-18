'use client';

import { CSSProperties, ElementType, useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

declare global {
  interface Window {
    __typingSequenceProgress?: Record<string, number>;
  }
}

const SEQUENCE_EVENT = 'interactive-prose-step-complete';

type AnimatedPaintTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
  sequenceKey?: string;
  step?: number;
  hideUntilStart?: boolean;
  wordStaggerMs?: number;
  wordDurationMs?: number;
};

export function AnimatedPaintText({
  text,
  as: Tag = 'p',
  className,
  sequenceKey,
  step = 1,
  hideUntilStart = false,
  wordStaggerMs = 95,
  wordDurationMs = 520
}: AnimatedPaintTextProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const completeTimerRef = useRef<number | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [isStepReady, setIsStepReady] = useState(step <= 1 || !sequenceKey);
  const [hasStarted, setHasStarted] = useState(false);

  const tokens = useMemo(() => text.split(/(\s+)/).filter((token) => token.length > 0), [text]);
  const wordCount = useMemo(() => tokens.filter((token) => /\S/.test(token)).length, [tokens]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!sequenceKey || step <= 1) {
      setIsStepReady(true);
      return;
    }

    const progress = window.__typingSequenceProgress?.[sequenceKey] ?? 0;
    if (progress >= step - 1) {
      setIsStepReady(true);
      return;
    }

    const onStepComplete = (event: Event) => {
      const custom = event as CustomEvent<{ key: string; step: number }>;
      if (custom.detail?.key !== sequenceKey) return;
      if (custom.detail.step >= step - 1) setIsStepReady(true);
    };

    window.addEventListener(SEQUENCE_EVENT, onStepComplete as EventListener);
    return () => window.removeEventListener(SEQUENCE_EVENT, onStepComplete as EventListener);
  }, [sequenceKey, step]);

  useEffect(() => {
    if (!isInView || !isStepReady || hasStarted) return;
    setHasStarted(true);
  }, [hasStarted, isInView, isStepReady]);

  useEffect(() => {
    if (!hasStarted || !sequenceKey) return;

    const totalMs = Math.max(0, (Math.max(0, wordCount - 1) * wordStaggerMs) + wordDurationMs + 80);

    completeTimerRef.current = window.setTimeout(() => {
      const state = window.__typingSequenceProgress ?? {};
      state[sequenceKey] = Math.max(state[sequenceKey] ?? 0, step);
      window.__typingSequenceProgress = state;
      window.dispatchEvent(new CustomEvent(SEQUENCE_EVENT, { detail: { key: sequenceKey, step } }));
    }, totalMs);

    return () => {
      if (completeTimerRef.current !== null) window.clearTimeout(completeTimerRef.current);
    };
  }, [hasStarted, sequenceKey, step, wordCount, wordDurationMs, wordStaggerMs]);

  let wordIndex = -1;

  return (
    <div
      ref={rootRef}
      className={cn('will-change-transform', hideUntilStart && !hasStarted ? 'opacity-0 pointer-events-none' : '', className)}
    >
      <Tag className="paint-text">
        {tokens.map((token, tokenIndex) => {
          if (!/\S/.test(token)) return <span key={`space-${tokenIndex}`}>{token}</span>;

          wordIndex += 1;
          const delay = wordIndex * wordStaggerMs;

          return (
            <span
              key={`word-${tokenIndex}`}
              className={cn('paint-word', hasStarted && 'is-visible')}
              style={
                {
                  '--paint-delay': `${delay}ms`,
                  '--paint-duration': `${wordDurationMs}ms`
                } as CSSProperties
              }
            >
              <span className="paint-word-base">{token}</span>
              <span className="paint-word-fill">{token}</span>
              <span className="paint-word-sheen" aria-hidden="true" />
            </span>
          );
        })}
      </Tag>
    </div>
  );
}
