import React from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiStar, FiMapPin, FiAward } from 'react-icons/fi';

const OurStory = () => {
  return (
    <div className="min-h-screen pt-40 pb-20 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-40 left-10 w-64 h-64 bg-fuchsia-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-40 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl md:text-8xl font-black italic bg-gradient-to-r from-fuchsia-600 to-cyan-600 bg-clip-text text-transparent tracking-tighter mb-6">
            Our Sweet Story
          </h1>
          <p className="text-2xl text-fuchsia-800 font-bold italic">Born in Moradabad, Growing Worldwide.</p>
        </motion.div>

        <div className="space-y-24">
          <motion.section 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="glass-panel p-8 rounded-[3rem] border-white/60">
              <div className="w-16 h-16 bg-fuchsia-100 rounded-2xl flex items-center justify-center text-fuchsia-500 mb-6">
                <FiHeart size={32} />
              </div>
              <h2 className="text-4xl font-black italic text-fuchsia-900 mb-6">The Vision</h2>
              <p className="text-fuchsia-800/80 font-medium leading-relaxed">
                Chatorzzz started with a simple vision in the heart of Moradabad: to capture the wonder of shared moments through the most exquisite candies. We believed that every sweet should be a multisensory experience, not just a treat.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[4rem] candy-gradient p-2 rotate-3 transform hover:rotate-0 transition-all duration-500 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[3.5rem] overflow-hidden flex items-center justify-center text-6xl">
                  🍬
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="relative order-2 md:order-1">
              <div className="aspect-square rounded-[4rem] bg-cyan-100 p-2 -rotate-3 transform hover:rotate-0 transition-all duration-500 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[3.5rem] overflow-hidden flex items-center justify-center text-6xl">
                  ✨
                </div>
              </div>
            </div>
            <div className="glass-panel p-8 rounded-[3rem] border-white/60 order-1 md:order-2">
              <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center text-cyan-500 mb-6">
                <FiStar size={32} />
              </div>
              <h2 className="text-4xl font-black italic text-cyan-900 mb-6">The Craft</h2>
              <p className="text-cyan-800/80 font-medium leading-relaxed">
                Our secret lies in "Non-AI" craftsmanship. We combine authentic, time-tested recipes with modern aesthetic flair. Every candy is selected to offer a moment of pure indulgence.
              </p>
            </div>
          </motion.section>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="glass-panel p-12 rounded-[4rem] text-center border-white/80 shadow-2xl"
          >
            <div className="flex justify-center gap-6 mb-8 text-fuchsia-500">
               <FiMapPin size={40} />
               <FiAward size={40} />
            </div>
            <h3 className="text-5xl font-black italic text-fuchsia-900 mb-6">Proudly Moradabad</h3>
            <p className="text-fuchsia-800 text-xl font-bold max-w-2xl mx-auto leading-relaxed italic">
              "From our local roots to your doorstep, we're dedicated to quality, authenticity, and making every moment a little bit sweeter."
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OurStory;
