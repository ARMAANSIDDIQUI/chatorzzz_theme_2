import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Facebook, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative pt-20 pb-10 px-6 overflow-hidden bg-gradient-to-b from-transparent to-fuchsia-200/50 z-10">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-4xl font-black tracking-tighter text-fuchsia-600 drop-shadow-md mb-6 inline-block">
              Chatorzzz
            </Link>
            <p className="text-fuchsia-800 text-lg max-w-md">
              Making the world a sweeter place, one magical candy at a time. Welcome to our universe of joy and color.
            </p>
            <div className="flex gap-4 mt-6">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <motion.a 
                  key={i}
                  href="#" 
                  whileHover={{ y: -5, scale: 1.1 }}
                  className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-fuchsia-600 hover:bg-fuchsia-500 hover:text-white transition-colors"
                >
                  <Icon size={24} />
                </motion.a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-xl font-bold text-fuchsia-900 mb-6">Explore</h4>
            <ul className="flex flex-col gap-4 text-fuchsia-800 font-medium">
              {['Home', 'Products', 'About Us', 'Contact'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="hover:text-fuchsia-500 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-bold text-fuchsia-900 mb-6">Legal</h4>
            <ul className="flex flex-col gap-4 text-fuchsia-800 font-medium">
              {['Privacy Policy', 'Terms of Service', 'Shipping Info', 'Returns'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-fuchsia-500 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-fuchsia-300/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-fuchsia-700 font-medium">
          <p>© 2026 Chatorzzz. All rights reserved.</p>
          <p className="flex items-center gap-2">
            Made with <Heart size={16} className="text-fuchsia-500 fill-fuchsia-500" /> for candy lovers
          </p>
        </div>
      </div>
      
      {/* Floating mini candy icons */}
      <motion.div 
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-10 text-3xl opacity-30"
      >
        🍬
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-20 right-20 text-4xl opacity-30"
      >
        🍭
      </motion.div>
    </footer>
  );
}
