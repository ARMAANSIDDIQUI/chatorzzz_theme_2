import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiInstagram, FiTwitter, FiFacebook, FiHeart, FiGift, FiStar } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="relative pt-20 pb-10 px-6 overflow-hidden bg-gradient-to-b from-transparent to-fuchsia-200/50 z-10">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-4xl font-black italic tracking-tighter bg-gradient-to-r from-fuchsia-600 to-cyan-600 bg-clip-text text-transparent drop-shadow-md mb-6 inline-block">
              Chatorzzz
            </Link>
            <p className="text-fuchsia-800 text-lg max-w-md font-medium">
              Making the world a sweeter place, one magical candy at a time. Welcome to our universe of joy and color.
            </p>
            <div className="flex gap-4 mt-8">
              {[
                { icon: FiInstagram, color: 'hover:bg-pink-500' },
                { icon: FiTwitter, color: 'hover:bg-blue-400' },
                { icon: FiFacebook, color: 'hover:bg-blue-600' }
              ].map((item, i) => (
                <motion.a 
                  key={i}
                  href="#" 
                  whileHover={{ y: -5, scale: 1.1 }}
                  className={`w-12 h-12 rounded-2xl glass-panel flex items-center justify-center text-fuchsia-600 hover:text-white transition-all duration-300 shadow-sm ${item.color}`}
                >
                  <item.icon size={22} />
                </motion.a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-xl font-black italic text-fuchsia-900 mb-8 border-b-2 border-fuchsia-200 inline-block pb-1">Explore</h4>
            <ul className="flex flex-col gap-4 text-fuchsia-800 font-bold">
              {[
                { name: 'Home', path: '/' },
                { name: 'Shop Sweets', path: '/products' },
                { name: 'Our Story', path: '/story' },
                { name: 'Contact', path: '/contact' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="hover:text-fuchsia-500 transition-colors flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 group-hover:w-3 transition-all"></div>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-black italic text-fuchsia-900 mb-8 border-b-2 border-fuchsia-200 inline-block pb-1">Legal</h4>
            <ul className="flex flex-col gap-4 text-fuchsia-800 font-bold">
              {[
                { name: 'Privacy Policy', path: '/privacy-policy' },
                { name: 'Terms of Service', path: '/terms' },
                { name: 'Shipping Info', path: '/shipping' },
                { name: 'Returns', path: '/returns' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="hover:text-fuchsia-500 transition-colors flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 group-hover:w-3 transition-all"></div>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-fuchsia-300/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-fuchsia-700 font-bold italic">
          <p>© 2026 Chatorzzz. All rights reserved.</p>
          <p className="flex items-center gap-2 bg-white/40 px-6 py-2 rounded-full backdrop-blur-sm border border-white/40">
            Made with <FiHeart className="text-fuchsia-500 fill-fuchsia-500 animate-pulse" /> for candy lovers
          </p>
        </div>
      </div>
      
      {/* Floating decorative icons - replacing emojis */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 45, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-10 text-fuchsia-300 opacity-20 pointer-events-none"
      >
        <FiGift size={60} />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 25, 0], rotate: [0, -45, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-20 right-20 text-cyan-300 opacity-20 pointer-events-none"
      >
        <FiStar size={80} />
      </motion.div>
    </footer>
  );
}
