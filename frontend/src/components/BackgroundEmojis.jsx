import React from 'react';
import { motion } from 'framer-motion';

const BackgroundEmojis = () => {
  const emojis = ['🍭', '🍬', '🍦', '🍩', '🍪', '🧁', '🍫', '🍧'];
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1] opacity-30 select-none">
      {/* desktop only for performance */}
      <div className="hidden md:block">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + 'vw', 
              y: '110vh',
              rotate: 0 
            }}
            animate={{ 
              y: '-10vh',
              rotate: 360,
              x: (Math.random() * 100 - 10) + 'vw'
            }}
            transition={{ 
              duration: Math.random() * 10 + 15, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 10
            }}
            className="absolute text-2xl"
          >
            {emojis[i % emojis.length]}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BackgroundEmojis;
