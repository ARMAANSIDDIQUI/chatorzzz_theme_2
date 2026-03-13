import React from 'react';
import { motion } from 'framer-motion';

export default function ProductCard({ name, price, image, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: delay }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="glass-panel rounded-3xl p-6 flex flex-col items-center gap-4 relative overflow-hidden group cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
      
      <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-fuchsia-200 to-cyan-100 flex items-center justify-center shadow-inner overflow-hidden relative">
        <motion.img 
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          src={image} 
          alt={name} 
          className="w-32 h-32 object-contain drop-shadow-xl"
        />
      </div>
      
      <div className="text-center z-10">
        <h3 className="text-2xl font-bold text-fuchsia-900 mb-1">{name}</h3>
        <p className="text-xl font-black text-fuchsia-600 mb-4">{price}</p>
        <button className="px-6 py-2 rounded-full bg-white/80 text-fuchsia-800 font-bold shadow-sm hover:bg-fuchsia-500 hover:text-white transition-colors duration-300">
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
