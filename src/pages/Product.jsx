import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';

export default function Product() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-32 pb-24 px-6 min-h-screen relative z-10 flex items-center"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="glass-panel rounded-[3rem] p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Product Image */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="relative w-full aspect-square rounded-full bg-gradient-to-tr from-fuchsia-200 to-cyan-100 flex items-center justify-center shadow-inner"
          >
            <motion.img 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              src="https://cdn-icons-png.flaticon.com/512/2682/2682465.png" 
              alt="Unicorn Pop" 
              className="w-2/3 h-2/3 object-contain drop-shadow-2xl"
            />
          </motion.div>
          
          {/* Product Details */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-2 text-yellow-500">
              {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" size={20} />)}
              <span className="text-fuchsia-800 font-bold ml-2">(128 reviews)</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-fuchsia-900">Unicorn Pop</h1>
            <p className="text-4xl font-black text-fuchsia-600">$4.99</p>
            
            <p className="text-lg text-fuchsia-800 leading-relaxed">
              A magical swirl of strawberry, blueberry, and vanilla flavors. This giant lollipop is perfect for parties, gifts, or just a sweet treat for yourself. Sprinkled with edible stardust!
            </p>
            
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center glass-panel rounded-full px-4 py-2">
                <button className="text-fuchsia-900 font-bold text-xl px-2 hover:text-fuchsia-600">-</button>
                <span className="text-fuchsia-900 font-bold text-xl px-4">1</span>
                <button className="text-fuchsia-900 font-bold text-xl px-2 hover:text-fuchsia-600">+</button>
              </div>
              <button className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-fuchsia-500 text-white font-bold text-lg shadow-xl hover:bg-fuchsia-400 hover:scale-105 transition-all duration-300">
                <ShoppingCart size={24} /> Add to Cart
              </button>
            </div>
          </motion.div>
          
        </div>
      </div>
    </motion.div>
  );
}
