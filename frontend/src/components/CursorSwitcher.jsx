import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSettings, FiX, FiStar } from 'react-icons/fi';

const cursors = [
  { icon: '🍬', name: 'Original Candy' },
  { icon: '🍩', name: 'Sweet Donut' },
  { icon: '🧁', name: 'Magic Cupcake' },
  { icon: '🍦', name: 'Ice Cream' },
  { icon: '🍫', name: 'Choco Bar' },
];

const CursorSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const currentCursor = localStorage.getItem('chatorzzz_cursor') || '🍬';

  const selectCursor = (icon) => {
    localStorage.setItem('chatorzzz_cursor', icon);
    // Dispatch custom event to update CustomCursor in same window
    window.dispatchEvent(new Event('cursorUpdate'));
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9990]">
      <motion.button
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileActive={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-2xl glass-panel flex items-center justify-center text-fuchsia-500 shadow-2xl border-white/60 cursor-none"
      >
        {isOpen ? <FiX size={24} /> : <FiStar size={28} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            className="absolute bottom-20 right-0 glass-panel p-4 rounded-[2rem] w-48 shadow-2xl border-white/80"
          >
            <h4 className="text-sm font-black italic text-fuchsia-900 mb-3 px-2">Pick Your Magic</h4>
            <div className="grid grid-cols-1 gap-2">
              {cursors.map((c) => (
                <button
                  key={c.icon}
                  onClick={() => selectCursor(c.icon)}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-none ${
                    currentCursor === c.icon 
                      ? 'bg-fuchsia-100 text-fuchsia-600 font-bold' 
                      : 'hover:bg-white/50 text-gray-600'
                  }`}
                >
                  <span className="text-xl">{c.icon}</span>
                  <span className="text-xs font-bold uppercase tracking-wider">{c.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CursorSwitcher;
