'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-pastel-pink-50 via-white to-pastel-mint-50"
          style={{
            paddingTop: 'env(safe-area-inset-top, 0px)',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          }}
        >
          <div className="relative w-32 h-32">
            {/* Circular progress ring that "fills" */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="rgba(236, 72, 153, 0.2)"
                strokeWidth="8"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="rgb(236, 72, 153)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 56}
                initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.8, ease: 'easeInOut' }}
              />
            </svg>
            {/* Cat face in the center */}
            <svg
              className="absolute inset-0 w-full h-full drop-shadow-sm"
              viewBox="0 0 128 128"
              fill="none"
              stroke="rgb(236, 72, 153)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Head */}
              <circle cx="64" cy="68" r="28" fill="rgba(255,255,255,0.9)" />
              {/* Ears */}
              <path d="M 44 48 L 52 28 L 60 48 Z" fill="rgba(255,255,255,0.9)" />
              <path d="M 68 48 L 76 28 L 84 48 Z" fill="rgba(255,255,255,0.9)" />
              {/* Eyes */}
              <ellipse cx="56" cy="64" rx="4" ry="5" fill="rgb(236, 72, 153)" />
              <ellipse cx="72" cy="64" rx="4" ry="5" fill="rgb(236, 72, 153)" />
              {/* Nose */}
              <path d="M 64 72 L 62 76 L 66 76 Z" fill="rgb(236, 72, 153)" />
              {/* Whiskers */}
              <line x1="36" y1="68" x2="48" y2="70" />
              <line x1="36" y1="74" x2="48" y2="74" />
              <line x1="80" y1="70" x2="92" y2="68" />
              <line x1="80" y1="74" x2="92" y2="74" />
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
