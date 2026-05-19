'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Loader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show on home page, and only on first ever visit per session
    if (pathname !== '/') return;
    const seen = sessionStorage.getItem('loader_shown');
    if (seen) return;
    sessionStorage.setItem('loader_shown', '1');
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2400);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-[#080810] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Animated gradient orb */}
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, rgba(168,85,247,0.05) 50%, transparent 70%)',
            }}
            animate={{ scale: [1, 1.15, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 2.4, ease: 'easeInOut' }}
          />

          {/* Rings */}
          {[80, 140, 200].map((size, i) => (
            <motion.div
              key={size}
              className="absolute rounded-full border border-cyan-400/10"
              style={{ width: size, height: size }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.8, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}

          {/* Center logo */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Initials badge */}
            <motion.div
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center font-black text-white text-3xl"
              style={{ boxShadow: '0 0 60px rgba(0,212,255,0.35), 0 0 120px rgba(168,85,247,0.15)' }}
              animate={{ boxShadow: [
                '0 0 40px rgba(0,212,255,0.3), 0 0 80px rgba(168,85,247,0.1)',
                '0 0 70px rgba(0,212,255,0.5), 0 0 140px rgba(168,85,247,0.2)',
                '0 0 40px rgba(0,212,255,0.3), 0 0 80px rgba(168,85,247,0.1)',
              ]}}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              A
            </motion.div>

            {/* Name */}
            <div className="text-center">
              <motion.p
                className="text-light font-bold text-lg tracking-wide"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Ashutosh Dubey
              </motion.p>
              <motion.p
                className="text-cyan-400 font-mono text-xs mt-1 tracking-widest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                FULL STACK DEVELOPER
              </motion.p>
            </div>

            {/* Progress bar */}
            <motion.div
              className="w-40 h-0.5 bg-[#1a1a2e] rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.2 }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
