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
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 backdrop-blur-xl overflow-hidden"
        >
          {/* Layered Gradients for Depth */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-fuchsia-100/40 blur-[150px] animate-pulse"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-cyan-100/40 blur-[180px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/40 to-white/90"></div>
          </div>

          {/* Animated Background Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: Math.random() * 100 + '%', 
                  y: Math.random() * 100 + '%',
                  scale: 0,
                  opacity: 0 
                }}
                animate={{ 
                  y: [null, '-20%', '120%'],
                  scale: [0, 1.2, 0.6],
                  opacity: [0, 0.6, 0]
                }}
                transition={{ 
                  duration: Math.random() * 6 + 6, 
                  repeat: Infinity, 
                  delay: Math.random() * 5,
                  ease: "linear"
                }}
                className={`absolute w-8 h-8 rounded-full blur-xl ${i % 2 === 0 ? 'bg-fuchsia-400/30' : 'bg-cyan-400/30'}`}
              />
            ))}
          </div>

          <div className="relative z-10 text-center">
            <div className="relative py-24 px-12"> {/* Large padding for italics/shadows */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative inline-block"
              >
                {/* Glow behind text */}
                <div className="absolute inset-0 bg-fuchsia-500/20 blur-[80px] rounded-full scale-125"></div>
                
                <motion.h1
                  initial={{ y: 150 }}
                  animate={{ y: 0 }}
                  exit={{ y: -150 }}
                  transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                  className="text-8xl md:text-[10rem] font-black italic text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-600 via-fuchsia-500 to-cyan-500 tracking-tighter drop-shadow-[0_20px_50px_rgba(217,70,239,0.4)] relative z-10 px-12 pr-16"
                >
                  Chatorzzz
                </motion.h1>
              </motion.div>
              
              <div className="flex justify-center mt-12">
                 <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                  className="h-2.5 w-full max-w-[400px] bg-fuchsia-50 rounded-full overflow-hidden backdrop-blur-md border border-fuchsia-100"
                >
                  <motion.div 
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="h-full w-1/2 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent"
                  />
                </motion.div>
              </div>
            </div>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="text-center text-fuchsia-900/60 font-black italic tracking-[0.3em] text-[0.6rem] uppercase"
            >
              Preparing Experience
            </motion.p>
          </div>
          
          {/* Large Abstract Shapes */}
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1],
            }} 
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -left-20 w-[40rem] h-[40rem] border-[60px] border-fuchsia-200/5 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ 
              rotate: -360,
              scale: [1, 1.2, 1],
            }} 
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-40 -right-40 w-[50rem] h-[50rem] border-[80px] border-cyan-200/5 rounded-[10rem] blur-3xl"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CurtainLoader;
