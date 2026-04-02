import React from 'react';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiArrowRight, FiZap } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 relative z-10 overflow-hidden">
      <div className="absolute inset-0 candy-gradient opacity-80 z-0" />

      {/* Decorative icons — hidden on very small screens to reduce clutter */}
      <motion.div
        animate={{ y: [0, -24, 0], rotate: [0, 45, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-6 left-6 sm:top-10 sm:left-10 opacity-20 sm:opacity-30 z-0 text-white"
      >
        <FiZap size={48} className="sm:hidden" />
        <FiZap size={80} className="hidden sm:block" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 32, 0], rotate: [0, -45, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-6 right-6 sm:bottom-10 sm:right-20 opacity-20 sm:opacity-30 z-0 text-white"
      >
        <FiShoppingBag size={60} className="sm:hidden" />
        <FiShoppingBag size={100} className="hidden sm:block" />
      </motion.div>

      <div className="container mx-auto max-w-4xl relative z-10 text-center glass-panel rounded-[2.5rem] sm:rounded-[3rem] md:rounded-[4rem] p-8 sm:p-12 md:p-16 lg:p-20 border border-white/40 shadow-2xl">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black italic text-fuchsia-900 mb-5 sm:mb-6 md:mb-8 tracking-tighter leading-tight"
        >
          Actually, You{' '}
          <br className="hidden sm:block" />
          Do Need This.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-fuchsia-800 mb-8 sm:mb-10 md:mb-12 font-bold leading-relaxed"
        >
          Trust us, your future self will thank you for this choice. Grab your first box and see why we're so obsessed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, type: 'spring' }}
        >
          <Link
            to="/register"
            className="inline-flex items-center gap-3 px-8 sm:px-10 md:px-12 py-4 sm:py-5 rounded-[1.5rem] sm:rounded-[2rem] bg-white text-fuchsia-600 font-black italic text-lg sm:text-xl md:text-2xl shadow-xl hover:shadow-fuchsia-300 transform hover:-translate-y-1 transition-all duration-300"
          >
            Let's Do It
            <FiArrowRight />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
