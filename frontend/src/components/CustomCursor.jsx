import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [cursorType, setCursorType] = useState('🍬');

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check for saved cursor
    const saved = localStorage.getItem('chatorzzz_cursor');
    if (saved) setCursorType(saved);

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (isHidden) setIsHidden(false);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isClickable = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsPointer(isClickable);
    };

    const handleStorageChange = () => {
      const updated = localStorage.getItem('chatorzzz_cursor');
      if (updated) setCursorType(updated);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('storage', handleStorageChange);
    // Custom event for same-window updates
    window.addEventListener('cursorUpdate', handleStorageChange);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cursorUpdate', handleStorageChange);
    };
  }, [mouseX, mouseY, isHidden]);

  if (isHidden) return null;

  return (
    <motion.div
      style={{
        left: cursorX,
        top: cursorY,
        x: "-50%",
        y: "-50%",
      }}
      className="fixed pointer-events-none z-[10000] flex items-center justify-center p-2"
    >
      {/* Outer Glow */}
      <motion.div 
        animate={{
          scale: isPointer ? 1.5 : 1,
          opacity: isPointer ? 0.6 : 1,
        }}
        className="absolute w-12 h-12 rounded-full bg-fuchsia-400/20 blur-xl"
      />
      
      {/* Candy Emoji / Icon */}
      <motion.div
        animate={{
          scale: isPointer ? 1.4 : 1,
          rotate: isPointer ? [0, 10, -10, 0] : 0,
        }}
        transition={isPointer ? { repeat: Infinity, duration: 2 } : {}}
        className="text-3xl select-none"
      >
        {cursorType === '🍬' ? (isPointer ? '🍭' : '🍬') :
         cursorType === '🍩' ? (isPointer ? '🍪' : '🍩') :
         cursorType === '🧁' ? (isPointer ? '🍰' : '🧁') :
         cursorType === '🍦' ? (isPointer ? '🍧' : '🍦') :
         cursorType === '🍫' ? (isPointer ? '🍯' : '🍫') :
         (isPointer ? '🍭' : cursorType)}
      </motion.div>
    </motion.div>
  );
};

export default CustomCursor;
