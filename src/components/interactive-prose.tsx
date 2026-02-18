'use client';

import { ReactNode, useEffect, useState, useRef } from 'react';

import { cn } from '@/lib/utils';

declare global {
  interface Window {
    __typingSequenceProgress?: Record<string, number>;
  }
}

const SEQUENCE_EVENT = 'interactive-prose-step-complete';

export function InteractiveProse({
  children,
  className,
  wordDelayMs = 120,
  sequenceKey,
  step = 1,
  hideUntilStart = false,
  typing = true
}: {
  children: ReactNode;
  className?: string;
  wordDelayMs?: number;
  sequenceKey?: string;
  step?: number;
  hideUntilStart?: boolean;
  typing?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const animatedRef = useRef(false);
  const [isInView, setIsInView] = useState(false);
  const [isStepReady, setIsStepReady] = useState(step <= 1 || !sequenceKey);
  const [hasStarted, setHasStarted] = useState(false);

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
    if (sequenceKey && step === 1) {
      const state = window.__typingSequenceProgress ?? {};
      if (state[sequenceKey] === undefined) {
        state[sequenceKey] = 0;
      }
      window.__typingSequenceProgress = state;
    }
  }, [sequenceKey, step]);

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
      if (custom.detail.step >= step - 1) {
        setIsStepReady(true);
      }
    };

    window.addEventListener(SEQUENCE_EVENT, onStepComplete as EventListener);
    return () => window.removeEventListener(SEQUENCE_EVENT, onStepComplete as EventListener);
  }, [sequenceKey, step]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (!isInView || !isStepReady) return;

    if (sequenceKey) {
      const progress = window.__typingSequenceProgress?.[sequenceKey] ?? 0;
      if (progress >= step) {
        animatedRef.current = true;
        setHasStarted(true);
        return;
      }
    }

    const animateWords = () => {
      if (animatedRef.current) return;
      animatedRef.current = true;
      setHasStarted(true);

      if (!typing) {
        if (sequenceKey) {
          const state = window.__typingSequenceProgress ?? {};
          state[sequenceKey] = Math.max(state[sequenceKey] ?? 0, step);
          window.__typingSequenceProgress = state;
          window.dispatchEvent(new CustomEvent(SEQUENCE_EVENT, { detail: { key: sequenceKey, step } }));
        }
        return;
      }

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const textNodes: Text[] = [];

      while (walker.nextNode()) {
        const node = walker.currentNode as Text;
        if (node.nodeValue && node.nodeValue.trim()) {
          textNodes.push(node);
        }
      }

      const words: HTMLSpanElement[] = [];

      textNodes.forEach((node) => {
        const value = node.nodeValue ?? '';
        const tokens = value.split(/(\s+)/);
        const fragment = document.createDocumentFragment();

        tokens.forEach((token) => {
          if (!token) return;
          if (/^\s+$/.test(token)) {
            fragment.appendChild(document.createTextNode(token));
            return;
          }

          const span = document.createElement('span');
          span.className = 'typed-word';
          span.textContent = token;
          fragment.appendChild(span);
          words.push(span);
        });

        node.parentNode?.replaceChild(fragment, node);
      });

      let i = 0;
      const timer = window.setInterval(() => {
        const next = words[i];
        if (next) {
          next.classList.add('is-visible');
          i += 1;
          return;
        }

        window.clearInterval(timer);

        if (sequenceKey) {
          const state = window.__typingSequenceProgress ?? {};
          state[sequenceKey] = Math.max(state[sequenceKey] ?? 0, step);
          window.__typingSequenceProgress = state;
          window.dispatchEvent(new CustomEvent(SEQUENCE_EVENT, { detail: { key: sequenceKey, step } }));
        }
      }, wordDelayMs);
    };

    animateWords();
  }, [isInView, isStepReady, sequenceKey, step, typing, wordDelayMs]);

  return (
    <div
      ref={rootRef}
      className={cn('will-change-transform', hideUntilStart && !hasStarted ? 'opacity-0 pointer-events-none' : '', className)}
    >
      {children}
    </div>
  );
}
