'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';

declare global {
  interface Window {
    __motionRevealDone?: Record<string, boolean>;
  }
}

export function MotionReveal({
  children,
  delay = 0,
  direction = 'up',
  revealKey
}: {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right';
  revealKey?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [shouldAnimate, setShouldAnimate] = useState(!revealKey);
  const xFrom = direction === 'left' ? -34 : direction === 'right' ? 34 : 0;
  const yFrom = direction === 'up' ? 18 : 6;

  useEffect(() => {
    if (!revealKey) {
      setShouldAnimate(true);
      return;
    }
    const done = window.__motionRevealDone?.[revealKey] ?? false;
    setShouldAnimate(!done);
  }, [revealKey]);

  if (prefersReducedMotion || !shouldAnimate) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: xFrom * 0.45,
        y: yFrom,
        scale: 0.985
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1
      }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{
        duration: 0.32,
        ease: [0.22, 1, 0.36, 1],
        delay
      }}
      style={{ willChange: 'transform, opacity' }}
      onAnimationComplete={() => {
        if (!revealKey) return;
        const state = window.__motionRevealDone ?? {};
        state[revealKey] = true;
        window.__motionRevealDone = state;
      }}
    >
      {children}
    </motion.div>
  );
}
