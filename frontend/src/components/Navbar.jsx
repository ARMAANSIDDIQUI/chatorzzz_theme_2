import React from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiUser, FiHome, FiShoppingBag, FiSettings, FiMenu, FiX, FiLogIn } from 'react-icons/fi';
const logoImg = '/logo-removebg.png';

export default function Navbar() {
  const { user } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu whenever route changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/', icon: FiHome },
    { name: 'Shop', path: '/products', icon: FiShoppingBag },
  ];

  const MobileMenu = () =>
    createPortal(
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ willChange: 'transform' }}
              className="fixed inset-y-0 left-0 w-[80%] max-w-sm z-[9999] bg-white/98 backdrop-blur-2xl shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-fuchsia-100">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <img
                    src={logoImg}
                    alt="Chatorzzz Logo"
                    className="h-10 w-auto object-contain mix-blend-multiply"
                  />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-fuchsia-600 hover:bg-fuchsia-50 transition-all"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex-1 px-6 py-8 flex flex-col gap-2 overflow-y-auto">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 + 0.1 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-4 px-4 py-4 rounded-2xl text-xl font-black italic transition-colors ${
                        location.pathname === link.path
                          ? 'bg-fuchsia-50 text-fuchsia-600'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-fuchsia-500'
                      }`}
                    >
                      <link.icon size={22} />
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                <div className="border-t border-fuchsia-100 my-4" />

                {/* Cart */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <Link
                    to="/cart"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 px-4 py-4 rounded-2xl text-xl font-black italic text-gray-500 hover:bg-gray-50 hover:text-fuchsia-500 transition-colors"
                  >
                    <span className="relative">
                      <FiShoppingCart size={22} />
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 w-4 h-4 bg-fuchsia-500 text-white text-[9px] flex items-center justify-center rounded-full font-black">
                          {cartCount}
                        </span>
                      )}
                    </span>
                    Cart {cartCount > 0 && `(${cartCount})`}
                  </Link>
                </motion.div>

                {/* Auth */}
                {user ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.32 }}
                    >
                      <Link
                        to="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-4 px-4 py-4 rounded-2xl text-xl font-black italic text-gray-500 hover:bg-gray-50 hover:text-fuchsia-500 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg candy-gradient p-[2px]">
                          <div className="w-full h-full rounded-md bg-white overflow-hidden">
                            <img
                              src={user.profileImage || '/assets/images/default-avatar.png'}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        {user.name.split(' ')[0]}
                      </Link>
                    </motion.div>

                    {user.role === 'admin' && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.38 }}
                      >
                        <Link
                          to="/admin"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-4 px-4 py-4 rounded-2xl text-xl font-black italic text-cyan-600 hover:bg-cyan-50 transition-colors"
                        >
                          <FiSettings size={22} />
                          Admin Panel
                        </Link>
                      </motion.div>
                    )}
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.32 }}
                    className="mt-2"
                  >
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl candy-gradient text-gray-900 text-lg font-black italic shadow-lg transition-all"
                    >
                      <FiLogIn size={20} />
                      Login
                    </Link>
                  </motion.div>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body
    );

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className={`fixed left-1/2 -translate-x-1/2 transition-all duration-700 ease-in-out z-50 flex justify-between items-center ${
          isScrolled
            ? 'top-4 w-[95%] max-w-7xl glass-panel rounded-[2.5rem] px-4 sm:px-8 py-2.5 border border-white/40 shadow-2xl'
            : 'top-0 w-full bg-white/20 backdrop-blur-xl px-4 sm:px-10 py-3.5 border-b border-white/10 rounded-none shadow-none'
        }`}
      >
        {/* Left side: hamburger + logo */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-fuchsia-600 hover:bg-fuchsia-50 rounded-xl transition-all"
            aria-label="Toggle mobile menu"
          >
            <FiMenu size={24} />
          </button>
          <Link to="/" className="flex items-center gap-2 transition-all">
            <img
              src={logoImg}
              alt="Chatorzzz Logo"
              className="h-9 sm:h-12 w-auto object-contain bg-transparent mix-blend-multiply dark:mix-blend-screen rounded-xl"
            />
          </Link>
        </div>

        {/* Desktop nav links */}
        <div className="flex items-center gap-6 lg:gap-10 font-bold text-gray-700">
          <ul className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <motion.li key={link.path} whileHover={{ y: -2 }} className="relative group">
                <Link
                  to={link.path}
                  className={`flex items-center gap-2 transition-colors ${
                    location.pathname === link.path ? 'text-fuchsia-600' : 'hover:text-fuchsia-500'
                  }`}
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

          {/* Right-side icons (always visible) */}
          <div className="flex items-center gap-3">
            <Link to="/cart" className="relative group p-2 rounded-xl transition-all hover:bg-white/50">
              <FiShoppingCart size={22} className="text-gray-700 group-hover:text-fuchsia-600 transition-colors" />
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
              <div className="flex items-center gap-3">
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="hidden md:block p-2 rounded-xl text-cyan-600 hover:bg-cyan-50 transition-all"
                    title="Admin Panel"
                  >
                    <FiSettings size={22} />
                  </Link>
                )}
                <Link to="/profile" className="flex items-center gap-2 group">
                  <div className="w-9 h-9 rounded-xl candy-gradient p-[2px] shadow-sm transform group-hover:scale-105 transition-all">
                    <div className="w-full h-full rounded-[9px] bg-white overflow-hidden">
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
                className="px-4 sm:px-6 py-2 rounded-full candy-gradient text-gray-900 text-sm font-black italic shadow-lg hover:shadow-fuchsia-200/50 transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <FiUser size={16} />
                <span className="hidden xs:inline">Login</span>
              </Link>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Portal-based mobile menu — rendered outside nav to avoid transform/stacking context issues */}
      <MobileMenu />
    </>
  );
}
