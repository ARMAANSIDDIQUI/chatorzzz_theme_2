import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiUser, FiHome, FiShoppingBag, FiSettings } from 'react-icons/fi';

export default function Navbar() {
  const { user } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: FiHome },
    { name: 'Shop', path: '/products', icon: FiShoppingBag },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`fixed left-1/2 -translate-x-1/2 transition-all duration-700 ease-in-out z-50 flex justify-between items-center ${
        isScrolled 
          ? 'top-4 w-[95%] max-w-7xl glass-panel rounded-[2.5rem] px-8 py-2.5 border border-white/40 shadow-2xl' 
          : 'top-0 w-full bg-white/20 backdrop-blur-xl px-10 py-3.5 border-b border-white/10 rounded-none shadow-none'
      }`}
    >
      <Link to="/" className="text-3xl md:text-4xl font-black italic tracking-tighter bg-gradient-to-r from-fuchsia-600 to-cyan-600 bg-clip-text text-transparent drop-shadow-md pr-2 transition-all">
        Chatorzzz
      </Link>

      <div className="flex items-center gap-6 lg:gap-10 font-bold text-gray-700">
        <ul className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <motion.li key={link.path} whileHover={{ y: -2 }} className="relative group">
              <Link 
                to={link.path} 
                className={`flex items-center gap-2 transition-colors ${location.pathname === link.path ? 'text-fuchsia-600' : 'hover:text-fuchsia-500'}`}
              >
                <link.icon size={18} />
                {link.name}
                <AnimatePresence>
                  {location.pathname === link.path && (
                    <motion.span 
                      layoutId="nav-underline"
                      className="absolute left-0 bottom-[-6px] w-full h-[3px] bg-fuchsia-500 rounded-full"
                    />
                  )}
                </AnimatePresence>
              </Link>
            </motion.li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative group p-2 rounded-xl transition-all hover:bg-white/50">
            <FiShoppingCart size={24} className="text-gray-700 group-hover:text-fuchsia-600 transition-colors" />
            {cartCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-fuchsia-500 text-white text-[10px] flex items-center justify-center rounded-full font-black border-2 border-white"
              >
                {cartCount}
              </motion.span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              {user.role === 'admin' && (
                <Link to="/admin" className="p-2 rounded-xl text-cyan-600 hover:bg-cyan-50 transition-all" title="Admin Panel">
                  <FiSettings size={24} />
                </Link>
              )}
              <Link to="/profile" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl candy-gradient p-[2px] shadow-sm transform group-hover:scale-105 transition-all">
                  <div className="w-full h-full rounded-[10px] bg-white overflow-hidden">
                    <img 
                      src={user.profileImage || '/assets/images/default-avatar.png'} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <span className="hidden sm:block text-sm font-black italic group-hover:text-fuchsia-600 transition-colors">
                  {user.name.split(' ')[0]}
                </span>
              </Link>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="px-6 py-2.5 rounded-full candy-gradient text-gray-900 text-sm font-black italic shadow-lg hover:shadow-fuchsia-200/50 transform hover:-translate-y-0.5 mt-[-2px] transition-all flex items-center gap-2"
            >
              <FiUser size={18} />
              Login
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
