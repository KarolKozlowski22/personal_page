'use client';

import { motion } from 'framer-motion';

export function AmbientBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute -top-28 left-[6%] h-72 w-72 rounded-full bg-primary/15 blur-3xl"
        animate={{ x: [0, 26, -10, 0], y: [0, 14, -8, 0], scale: [1, 1.08, 0.96, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-orange-300/15 blur-3xl dark:bg-orange-400/10"
        animate={{ x: [0, -24, 8, 0], y: [0, -18, 10, 0], scale: [1, 0.95, 1.05, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-8%] left-1/3 h-72 w-72 rounded-full bg-sky-300/10 blur-3xl dark:bg-sky-400/10"
        animate={{ x: [0, 18, -12, 0], y: [0, -10, 12, 0], scale: [1, 1.04, 0.98, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
