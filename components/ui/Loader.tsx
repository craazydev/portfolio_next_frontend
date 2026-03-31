'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2 } from 'lucide-react';

const LINES = [
  'initializing portfolio...',
  'loading 3d engine...',
  'fetching projects...',
  'ready.',
];

export default function Loader() {
  const [visible, setVisible] = useState(true);
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    // Cycle through loading lines
    const lineTimer = setInterval(() => {
      setLineIdx(i => {
        if (i >= LINES.length - 1) { clearInterval(lineTimer); return i; }
        return i + 1;
      });
    }, 500);

    // Hide after 2.2s
    const hideTimer = setTimeout(() => setVisible(false), 2200);
    return () => { clearInterval(lineTimer); clearTimeout(hideTimer); };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-[#080810] flex flex-col items-center justify-center gap-8"
        >
          {/* Animated logo */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center"
            style={{ boxShadow: '0 0 40px rgba(0,212,255,0.4)' }}
          >
            <Code2 size={28} className="text-white" />
          </motion.div>

          {/* Progress bar */}
          <div className="w-48 h-0.5 bg-[#1a1a2e] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
            />
          </div>

          {/* Terminal output */}
          <div className="font-mono text-xs text-cyan-400/70 text-center min-h-[20px]">
            <motion.span
              key={lineIdx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {LINES[lineIdx]}
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
