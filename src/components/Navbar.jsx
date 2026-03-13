import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-4xl glass-panel rounded-full px-8 py-4 flex justify-between items-center"
    >
      <Link to="/" className="text-2xl font-black tracking-tighter text-fuchsia-600 drop-shadow-md">
        Chatorzzz
      </Link>
      <ul className="flex gap-8 text-sm font-bold text-fuchsia-800">
        {['Home', 'Products', 'Product', 'Contact'].map((item) => (
          <motion.li key={item} whileHover={{ y: -3, scale: 1.05 }} className="relative group cursor-pointer">
            <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}>
              {item}
              <span className="absolute left-0 bottom-[-4px] w-0 h-[3px] bg-fuchsia-500 rounded-full transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  );
}
