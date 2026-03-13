import React from 'react';
import { motion } from 'framer-motion';

export default function CTA() {
  return (
    <section className="py-32 px-6 relative z-10 overflow-hidden">
      <div className="absolute inset-0 candy-gradient opacity-80 z-0"></div>
      
      {/* Decorative floating elements */}
      <motion.div 
        animate={{ y: [0, -30, 0], rotate: [0, 45, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-10 text-6xl opacity-50 z-0"
      >
        🍬
      </motion.div>
      <motion.div 
        animate={{ y: [0, 40, 0], rotate: [0, -45, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-10 right-20 text-7xl opacity-50 z-0"
      >
        🍭
      </motion.div>
      
      <div className="container mx-auto max-w-4xl relative z-10 text-center glass-panel rounded-[3rem] p-16">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-black text-fuchsia-900 mb-8"
        >
          Ready For A Sweet Adventure?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-2xl text-fuchsia-800 mb-10"
        >
          Join the Chatorzzz family and get 20% off your first magical order.
        </motion.p>
        <motion.button 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, type: "spring" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="px-12 py-5 rounded-full bg-white text-fuchsia-600 font-black text-2xl shadow-2xl hover:shadow-fuchsia-500/50 transition-all duration-300"
        >
          Shop Chatorzzz
        </motion.button>
      </div>
    </section>
  );
}
