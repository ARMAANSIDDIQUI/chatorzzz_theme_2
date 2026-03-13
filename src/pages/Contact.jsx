import React from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

export default function Contact() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-32 pb-24 px-6 min-h-screen relative z-10 flex items-center"
    >
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-black text-fuchsia-900 mb-4 drop-shadow-md"
          >
            Say Hello!
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-fuchsia-800"
          >
            We'd love to hear from you. Send us a sweet message.
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-panel rounded-[3rem] p-8 md:p-12 relative"
        >
          {/* Floating decoration */}
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -left-10 text-6xl drop-shadow-lg z-20"
          >
            💌
          </motion.div>

          <form className="flex flex-col gap-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-fuchsia-900 font-bold ml-4">Your Name</label>
                <input 
                  type="text" 
                  placeholder="Willy Wonka" 
                  className="w-full px-6 py-4 rounded-full bg-white/50 border-2 border-fuchsia-200 focus:border-fuchsia-500 focus:outline-none focus:ring-4 focus:ring-fuchsia-500/20 text-fuchsia-900 placeholder-fuchsia-300 transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-fuchsia-900 font-bold ml-4">Your Email</label>
                <input 
                  type="email" 
                  placeholder="sweet@tooth.com" 
                  className="w-full px-6 py-4 rounded-full bg-white/50 border-2 border-fuchsia-200 focus:border-fuchsia-500 focus:outline-none focus:ring-4 focus:ring-fuchsia-500/20 text-fuchsia-900 placeholder-fuchsia-300 transition-all"
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-fuchsia-900 font-bold ml-4">Your Message</label>
              <textarea 
                rows="5" 
                placeholder="I love your candies! Can I order 1000 pops?" 
                className="w-full px-6 py-4 rounded-[2rem] bg-white/50 border-2 border-fuchsia-200 focus:border-fuchsia-500 focus:outline-none focus:ring-4 focus:ring-fuchsia-500/20 text-fuchsia-900 placeholder-fuchsia-300 transition-all resize-none"
              ></textarea>
            </div>
            
            <button 
              type="button"
              className="mt-4 self-center flex items-center gap-2 px-12 py-4 rounded-full bg-fuchsia-500 text-white font-bold text-xl shadow-xl hover:bg-fuchsia-400 hover:scale-105 transition-all duration-300"
            >
              <Send size={20} /> Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
