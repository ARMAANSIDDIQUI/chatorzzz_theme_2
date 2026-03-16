import React from 'react';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiArrowRight, FiZap } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section className="py-32 px-6 relative z-10 overflow-hidden">
      <div className="absolute inset-0 candy-gradient opacity-80 z-0"></div>
      
      {/* Decorative floating elements */}
      <motion.div 
        animate={{ y: [0, -30, 0], rotate: [0, 45, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-10 opacity-30 z-0 text-white"
      >
        <FiZap size={80} />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 40, 0], rotate: [0, -45, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-10 right-20 opacity-30 z-0 text-white"
      >
        <FiShoppingBag size={100} />
      </motion.div>
      
      <div className="container mx-auto max-w-4xl relative z-10 text-center glass-panel rounded-[4rem] p-12 md:p-20 border border-white/40 shadow-2xl">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-black italic text-fuchsia-900 mb-8 tracking-tighter"
        >
          Ready For A Sweet Adventure?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-2xl text-fuchsia-800 mb-12 font-bold leading-relaxed"
        >
          Join the Chatorzzz family and get <span className="text-white px-2 py-1 bg-fuchsia-600 rounded-lg">20% off</span> your first magical order.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, type: "spring" }}
        >
          <Link 
            to="/register" 
            className="inline-flex items-center gap-4 px-12 py-5 rounded-[2rem] bg-white text-fuchsia-600 font-black italic text-2xl shadow-xl hover:shadow-fuchsia-300 transform hover:-translate-y-1 transition-all duration-300"
          >
            Join Now
            <FiArrowRight />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
