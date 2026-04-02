import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CurtainLoader = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          style={{ willChange: 'transform' }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 backdrop-blur-xl overflow-hidden"
        >
          {/* Background blobs */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div
              className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-fuchsia-100/50 blur-[60px] animate-pulse"
              style={{ willChange: 'opacity' }}
            />
            <div
              className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] rounded-full bg-cyan-100/50 blur-[60px] animate-pulse"
              style={{ animationDelay: '1s', willChange: 'opacity' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/40 to-white/90" />
          </div>

          {/* Content — fully mobile responsive */}
          <div className="relative z-10 text-center w-full px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="relative inline-block"
              style={{ willChange: 'transform, opacity, filter' }}
            >
              {/* Glow */}
              <div className="absolute inset-0 bg-fuchsia-500/20 blur-[50px] rounded-full scale-125" />

              <motion.h1
                initial={{ y: 80 }}
                animate={{ y: 0 }}
                exit={{ y: -80 }}
                transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
                style={{ willChange: 'transform' }}
                className="text-[3.5rem] xs:text-7xl sm:text-8xl md:text-[10rem] font-black italic text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-600 via-fuchsia-500 to-cyan-500 tracking-tighter drop-shadow-[0_10px_30px_rgba(217,70,239,0.35)] relative z-10"
              >
                Chatorzzz
              </motion.h1>
            </motion.div>

            {/* Progress bar */}
            <div className="flex justify-center mt-8 sm:mt-12 px-4">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.4, delay: 0.4, ease: 'circOut' }}
                style={{ willChange: 'transform' }}
                className="h-2 sm:h-2.5 w-full max-w-[280px] sm:max-w-[400px] bg-fuchsia-50 rounded-full overflow-hidden border border-fuchsia-100"
              >
                <motion.div
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ willChange: 'transform' }}
                  className="h-full w-1/2 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent"
                />
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="mt-5 sm:mt-6 text-center text-fuchsia-900/60 font-black italic tracking-[0.25em] sm:tracking-[0.3em] text-[0.55rem] sm:text-[0.6rem] uppercase"
            >
              Preparing Experience
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CurtainLoader;
