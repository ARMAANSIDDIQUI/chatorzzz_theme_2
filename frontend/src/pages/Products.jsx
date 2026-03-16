import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { FiShoppingBag, FiSearch, FiFilter, FiStar, FiPlus, FiArrowRight } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
        setLoading(false);
      } catch (err) {
        toast.error('Failed to load sweets');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'All' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 pt-40 pb-20 max-w-7xl">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block px-4 py-1.5 rounded-full bg-fuchsia-100 text-fuchsia-600 font-black text-xs uppercase tracking-widest mb-4"
        >
          Our Magical Collection
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-7xl font-black italic bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent tracking-tighter"
        >
          Sweet Universe
        </motion.h1>
        <p className="text-gray-500 mt-6 text-xl font-medium max-w-2xl mx-auto italic">
          Indulge in our collection of artisanal candies, crafted to spark joy in every bite.
        </p>
      </div>

      {/* Redesigned Filters & Search */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-24 max-w-5xl mx-auto"
      >
        {/* Background Glow */}
        <div className="absolute inset-0 bg-fuchsia-100/50 blur-[80px] rounded-full -z-10"></div>
        
        <div className="glass-panel p-2 rounded-[3.5rem] flex flex-col lg:flex-row items-center gap-2 border-white/60 shadow-2xl backdrop-blur-3xl">
          {/* Search Side */}
          <div className="relative w-full lg:w-2/5 group">
            <FiSearch className="absolute left-7 top-1/2 -translate-y-1/2 text-fuchsia-400 group-focus-within:text-fuchsia-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search your craving..."
              className="w-full pl-16 pr-8 py-5 rounded-[3rem] bg-white/40 border-none focus:bg-white/80 focus:ring-0 font-bold text-gray-700 placeholder:text-gray-400 transition-all italic text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Divider (Desktop) */}
          <div className="hidden lg:block w-[1.5px] h-12 bg-fuchsia-100 mx-2"></div>

          {/* Categories Side */}
          <div className="flex-grow flex items-center gap-3 overflow-x-auto py-3 px-4 no-scrollbar">
            {categories.map(cat => {
              const isActive = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-7 py-3.5 rounded-[2rem] font-black italic text-sm uppercase tracking-widest whitespace-nowrap transition-all relative group overflow-hidden ${
                    isActive 
                    ? 'text-white shadow-lg' 
                    : 'text-fuchsia-400 hover:text-fuchsia-600'
                  }`}
                >
                  {/* Active Background Animation */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute inset-0 candy-gradient"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                  
                  {/* Hover effect for non-active */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-fuchsia-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Decoration */}
          <div className="hidden xl:flex pr-6 text-fuchsia-200">
            <FiFilter size={24} />
          </div>
        </div>
      </motion.div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-40">
           <div className="text-4xl font-black italic text-fuchsia-500 animate-pulse">Unwrapping Magic...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, idx) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                price={product.price.toString()}
                image={product.image}
                rating={product.rating}
                delay={idx * 0.05}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="glass-panel p-20 rounded-[3rem] text-center border-white/40 max-w-2xl mx-auto">
          <div className="inline-block p-6 bg-gray-50 rounded-full text-gray-300 mb-6">
            <FiShoppingBag size={64} />
          </div>
          <h2 className="text-3xl font-black italic text-gray-800 mb-4">No sweets found!</h2>
          <p className="text-gray-500 text-lg font-medium mb-8">Even magic has its limits. Try searching for something else!</p>
          <button 
            onClick={() => {setSearchTerm(''); setCategory('All');}}
            className="px-10 py-4 candy-gradient text-white rounded-2xl font-black italic shadow-lg hover:shadow-fuchsia-200 transition-all"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
